import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { messages, items, context } = await req.json()

    const authorName: string = context?.author_name || 'one of the lads'
    const dayNumber: number = context?.day_number || 1
    const itemId: string | undefined = context?.item_id
    const itemTitle: string | undefined = context?.item_title
    const itemEmoji: string | undefined = context?.item_emoji

    const SYSTEM = `You are an enthusiastic AI travel planner helping plan a Cyprus lads trip (Aug 5–10, 2025) for 4–5 guys in their early 20s. You're chatting with ${authorName} who wants to suggest a change or addition.

Personality: casual, fun, decisive. Keep replies short and punchy — max 2–3 sentences. Light banter is good.

${
  itemId
    ? `Context: ${authorName} is suggesting a change to "${itemEmoji || ''} ${itemTitle}" on Day ${dayNumber}.`
    : `Context: ${authorName} wants to add or change something on Day ${dayNumber}.`
}

Day locations:
- Day 1 (Aug 5): Larnaca arrival → Ayia Napa
- Day 2 (Aug 6): Ayia Napa full day
- Day 3 (Aug 7): Protaras / Cape Greco
- Day 4 (Aug 8): Limassol
- Day 5 (Aug 9): Paphos
- Day 6 (Aug 10): Departure

When they suggest something:
1. Good idea → call apply_changes IMMEDIATELY then confirm in your reply what you did
2. Unclear → ask ONE short question
3. Conflicts with something → say why briefly, offer an alternative
4. Already in the plan → point it out and ask if they want a tweak

Always be decisive. Never just say "I'll consider it." Either do it or explain why not.

Current itinerary (use item IDs exactly as shown for updates/removals):
${JSON.stringify(items, null, 2)}`

    const tools: Anthropic.Tool[] = [
      {
        name: 'apply_changes',
        description:
          'Apply changes to the itinerary. Use this to add new activities, update existing ones, or remove them. Call it as soon as you decide to make a change — do not ask for confirmation first.',
        input_schema: {
          type: 'object' as const,
          properties: {
            changes: {
              type: 'array',
              description: 'List of changes to apply',
              items: {
                type: 'object',
                properties: {
                  action: {
                    type: 'string',
                    enum: ['add', 'update', 'remove'],
                    description: 'add = new item, update = edit existing, remove = delete',
                  },
                  item_id: {
                    type: 'string',
                    description: 'UUID of existing item. Required for update and remove.',
                  },
                  updates: {
                    type: 'object',
                    description:
                      'Fields to update (for update action). Any of: title, description, location, time_slot (morning|afternoon|evening|night), emoji, type (activity|meal|nightlife|transport)',
                  },
                  item: {
                    type: 'object',
                    description: 'Full new item to insert (for add action)',
                    properties: {
                      day_number: { type: 'number' },
                      day_date: { type: 'string', description: 'YYYY-MM-DD format' },
                      time_slot: {
                        type: 'string',
                        enum: ['morning', 'afternoon', 'evening', 'night'],
                      },
                      type: {
                        type: 'string',
                        enum: ['activity', 'meal', 'nightlife', 'transport'],
                      },
                      title: { type: 'string' },
                      description: { type: 'string' },
                      location: { type: 'string' },
                      emoji: { type: 'string' },
                      order_index: {
                        type: 'number',
                        description: 'Use 99 to append at end of time slot',
                      },
                    },
                    required: ['day_number', 'day_date', 'time_slot', 'type', 'title'],
                  },
                },
                required: ['action'],
              },
            },
          },
          required: ['changes'],
        },
      },
    ]

    // Build message list for Anthropic
    const anthropicMessages: Anthropic.MessageParam[] = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })
    )

    // First API call
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM,
      tools,
      messages: anthropicMessages,
    })

    let changesApplied = false
    let replyText = ''

    // Extract text and tool use blocks
    const toolUseBlock = response.content.find((b) => b.type === 'tool_use')
    const textBlock = response.content.find((b) => b.type === 'text')

    if (textBlock?.type === 'text') {
      replyText = textBlock.text
    }

    // Handle tool call
    if (toolUseBlock?.type === 'tool_use' && toolUseBlock.name === 'apply_changes') {
      const { changes } = toolUseBlock.input as {
        changes: Array<{
          action: 'add' | 'update' | 'remove'
          item_id?: string
          updates?: Record<string, unknown>
          item?: Record<string, unknown>
        }>
      }

      const errors: string[] = []

      for (const change of changes || []) {
        if (change.action === 'update' && change.item_id && change.updates) {
          const { error } = await supabase
            .from('itinerary_items')
            .update({ ...change.updates, updated_at: new Date().toISOString() })
            .eq('id', change.item_id)
          if (error) errors.push(error.message)
        }
        if (change.action === 'add' && change.item) {
          const { error } = await supabase.from('itinerary_items').insert(change.item)
          if (error) errors.push(error.message)
        }
        if (change.action === 'remove' && change.item_id) {
          const { error } = await supabase
            .from('itinerary_items')
            .delete()
            .eq('id', change.item_id)
          if (error) errors.push(error.message)
        }
      }

      changesApplied = errors.length === 0
      const toolResultContent = changesApplied
        ? 'Changes applied successfully to the database.'
        : `Error applying changes: ${errors.join(', ')}`

      // Second API call to get Claude's text response after tool result
      if (!replyText) {
        const followUp = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 512,
          system: SYSTEM,
          tools,
          messages: [
            ...anthropicMessages,
            { role: 'assistant' as const, content: response.content },
            {
              role: 'user' as const,
              content: [
                {
                  type: 'tool_result' as const,
                  tool_use_id: toolUseBlock.id,
                  content: toolResultContent,
                },
              ],
            },
          ],
        })

        const followUpText = followUp.content.find((b) => b.type === 'text')
        if (followUpText?.type === 'text') {
          replyText = followUpText.text
        }
      }
    }

    if (!replyText) {
      replyText = changesApplied
        ? 'Done! Check the itinerary — it should be updated now.'
        : "Hmm, I'm not sure what you mean. Can you give me a bit more detail?"
    }

    return NextResponse.json({ reply: replyText, changesApplied })
  } catch (err: unknown) {
    console.error('Chat error:', err)
    let message = 'Something went wrong. Try again in a moment.'
    if (err instanceof Error) {
      if (err.message.includes('credit balance') || err.message.includes('billing')) {
        message = 'The AI is temporarily unavailable (API credits need topping up). Check back soon!'
      } else if (err.message.includes('rate_limit')) {
        message = 'Too many requests at once — wait a few seconds and try again.'
      } else if (err.message.includes('invalid_api_key')) {
        message = 'AI config issue — let the trip organiser know.'
      } else {
        message = err.message
      }
    }
    // Try to parse Anthropic error JSON buried in the message
    try {
      const match = message.match(/\{.*"message":"([^"]+)".*\}/)
      if (match) message = match[1]
    } catch { /* ignore */ }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
