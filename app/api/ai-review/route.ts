import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SYSTEM_PROMPT = `You are an expert travel planner helping a group of young guys (early 20s) plan a lads holiday to Cyprus, Aug 5–10, 2025. You are reviewing their current itinerary and a list of friend suggestions, then deciding what changes to make.

Your personality: fun, practical, knows Cyprus well, looks out for the group's good time.

You will receive:
1. The current itinerary items (JSON array)
2. Pending suggestions from friends (JSON array)

Your job:
- Read all suggestions carefully
- Decide which ones to apply, partially apply, or ignore (with brief reason)
- Return a JSON object with the changes to make

CRITICAL: Your entire response must be valid JSON. Nothing else. No markdown fences, no explanation text, just the JSON object.

Return this exact structure:
{
  "changes": [
    {
      "action": "update",
      "item_id": "<uuid of existing item>",
      "updates": {
        "title": "new title (optional)",
        "description": "new description (optional)",
        "location": "new location (optional)",
        "time_slot": "morning|afternoon|evening|night (optional)",
        "emoji": "emoji (optional)"
      }
    },
    {
      "action": "add",
      "item": {
        "day_number": 2,
        "day_date": "2025-08-06",
        "time_slot": "afternoon",
        "type": "activity|meal|nightlife|transport",
        "title": "Title",
        "description": "Description",
        "location": "Location",
        "emoji": "🏖️",
        "order_index": 99
      }
    },
    {
      "action": "remove",
      "item_id": "<uuid>"
    }
  ],
  "applied_suggestion_ids": ["<uuid1>", "<uuid2>"],
  "ignored_suggestion_ids": ["<uuid3>"],
  "summary": "Brief human-readable summary of what changed (1–2 sentences)"
}`

export async function POST(req: NextRequest) {
  try {
    const { items, suggestions } = await req.json()

    if (!suggestions || suggestions.length === 0) {
      return NextResponse.json({ error: 'No pending suggestions to review' }, { status: 400 })
    }

    const userMessage = `
CURRENT ITINERARY:
${JSON.stringify(items, null, 2)}

PENDING SUGGESTIONS FROM FRIENDS:
${JSON.stringify(suggestions, null, 2)}

Please review the suggestions and return your JSON response.
`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const rawText = response.content[0].type === 'text' ? response.content[0].text : ''

    // Strip markdown fences if Claude includes them despite instructions
    const cleaned = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

    let result: {
      changes: Array<{
        action: 'update' | 'add' | 'remove'
        item_id?: string
        updates?: Record<string, unknown>
        item?: Record<string, unknown>
      }>
      applied_suggestion_ids: string[]
      ignored_suggestion_ids: string[]
      summary: string
    }

    try {
      result = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse AI response:', rawText)
      return NextResponse.json(
        { error: 'AI returned invalid JSON. Try again.' },
        { status: 500 }
      )
    }

    // Apply changes to database
    const errors: string[] = []

    for (const change of result.changes || []) {
      if (change.action === 'update' && change.item_id && change.updates) {
        const { error } = await supabase
          .from('itinerary_items')
          .update({ ...change.updates, updated_at: new Date().toISOString() })
          .eq('id', change.item_id)
        if (error) errors.push(`Update ${change.item_id}: ${error.message}`)
      }

      if (change.action === 'add' && change.item) {
        const { error } = await supabase.from('itinerary_items').insert(change.item)
        if (error) errors.push(`Add item: ${error.message}`)
      }

      if (change.action === 'remove' && change.item_id) {
        const { error } = await supabase
          .from('itinerary_items')
          .delete()
          .eq('id', change.item_id)
        if (error) errors.push(`Remove ${change.item_id}: ${error.message}`)
      }
    }

    // Mark suggestions as applied or dismissed
    if (result.applied_suggestion_ids?.length > 0) {
      await supabase
        .from('suggestions')
        .update({ status: 'applied' })
        .in('id', result.applied_suggestion_ids)
    }

    if (result.ignored_suggestion_ids?.length > 0) {
      await supabase
        .from('suggestions')
        .update({ status: 'dismissed' })
        .in('id', result.ignored_suggestion_ids)
    }

    return NextResponse.json({
      summary: result.summary,
      changesApplied: result.changes?.length || 0,
      suggestionsApplied: result.applied_suggestion_ids?.length || 0,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err: unknown) {
    console.error('AI review error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
