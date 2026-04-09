'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  ItineraryItem,
  Suggestion,
  DAY_LABELS,
  TIME_SLOT_ORDER,
  TIME_SLOT_LABEL,
  TIME_SLOT_EMOJI,
  TYPE_COLORS,
  TYPE_BADGE,
} from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'loading'; onClose: () => void }) {
  useEffect(() => {
    if (type !== 'loading') {
      const t = setTimeout(onClose, 4000)
      return () => clearTimeout(t)
    }
  }, [type, onClose])

  const colors = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    loading: 'bg-indigo-600',
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white shadow-2xl toast-enter ${colors[type]} max-w-sm`}>
      {type === 'loading' && (
        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {type === 'success' && <span>✓</span>}
      {type === 'error' && <span>✕</span>}
      <span className="text-sm font-medium">{message}</span>
      {type !== 'loading' && (
        <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100 text-lg leading-none">×</button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Suggest Modal
// ─────────────────────────────────────────────────────────────────────────────
function SuggestModal({
  item,
  dayNumber,
  onClose,
  onSubmit,
}: {
  item: ItineraryItem | null
  dayNumber: number
  onClose: () => void
  onSubmit: (data: { author: string; content: string; type: string; itemId: string | null; dayNumber: number }) => Promise<void>
}) {
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [suggType, setSuggType] = useState('general')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!author.trim() || !content.trim()) return
    setSubmitting(true)
    await onSubmit({
      author: author.trim(),
      content: content.trim(),
      type: suggType,
      itemId: item?.id ?? null,
      dayNumber,
    })
    setSubmitting(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center modal-backdrop bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-lg sm:mx-4 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {item ? '💡 Suggest a Change' : '➕ Propose Something New'}
            </h2>
            {item && (
              <p className="text-sm text-gray-500 mt-0.5">
                Re: <span className="font-medium text-gray-700">{item.emoji} {item.title}</span>
              </p>
            )}
            {!item && (
              <p className="text-sm text-gray-500 mt-0.5">Day {dayNumber} · {DAY_LABELS[dayNumber]?.date}</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Jake"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Suggestion type</label>
            <div className="flex gap-2 flex-wrap">
              {(['general', 'edit', 'addition', 'swap'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSuggType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    suggType === t
                      ? 'bg-sky-500 text-white border-sky-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300'
                  }`}
                >
                  {t === 'general' ? '💬 General' : t === 'edit' ? '✏️ Edit' : t === 'addition' ? '➕ Add' : '🔄 Swap'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your suggestion</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={item
                ? `e.g. "Move this to the evening instead" or "There's a better spot nearby — try X"`
                : `e.g. "We should add a boat trip on Day 2" or "What about renting quad bikes?"`
              }
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sm resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !author.trim() || !content.trim()}
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Suggestion'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Activity Card
// ─────────────────────────────────────────────────────────────────────────────
function ActivityCard({
  item,
  suggestionCount,
  onSuggest,
}: {
  item: ItineraryItem
  suggestionCount: number
  onSuggest: (item: ItineraryItem) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const colorClass = TYPE_COLORS[item.type]
  const badgeClass = TYPE_BADGE[item.type]

  return (
    <div className={`card-hover bg-white border-l-4 rounded-2xl shadow-sm overflow-hidden ${colorClass}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5 flex-shrink-0">{item.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-gray-900 text-sm leading-tight">{item.title}</h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
                {item.type}
              </span>
            </div>
            {item.location && (
              <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {item.location}
              </p>
            )}
            {item.description && (
              <div>
                <p className={`text-xs text-gray-600 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
                  {item.description}
                </p>
                {item.description.length > 100 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-sky-600 font-medium mt-1 hover:text-sky-700"
                  >
                    {expanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => onSuggest(item)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-sky-600 transition-colors group"
          >
            <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Suggest edit
          </button>
          {suggestionCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full pulse-badge">
              {suggestionCount} suggestion{suggestionCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Suggestions Panel
// ─────────────────────────────────────────────────────────────────────────────
function SuggestionsPanel({
  suggestions,
  items,
  isOpen,
  onClose,
}: {
  suggestions: Suggestion[]
  items: ItineraryItem[]
  isOpen: boolean
  onClose: () => void
}) {
  const pending = suggestions.filter((s) => s.status === 'pending')
  const applied = suggestions.filter((s) => s.status === 'applied')

  const itemMap = new Map(items.map((i) => [i.id, i]))

  function formatTime(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) +
      ' at ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  const SuggCard = ({ s }: { s: Suggestion }) => {
    const relatedItem = s.item_id ? itemMap.get(s.item_id) : null
    const typeBg: Record<string, string> = {
      general: 'bg-blue-50 text-blue-700',
      edit: 'bg-orange-50 text-orange-700',
      addition: 'bg-green-50 text-green-700',
      swap: 'bg-purple-50 text-purple-700',
    }
    return (
      <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${s.status === 'applied' ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {s.author_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{s.author_name}</p>
              <p className="text-xs text-gray-400">{formatTime(s.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeBg[s.type] || typeBg.general}`}>
              {s.type}
            </span>
            {s.status === 'applied' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">✓ applied</span>
            )}
          </div>
        </div>
        {relatedItem && (
          <p className="text-xs text-gray-400 mb-1.5 pl-10">
            Re: {relatedItem.emoji} {relatedItem.title}
            {s.day_number && <> · Day {s.day_number}</>}
          </p>
        )}
        {!relatedItem && s.day_number && (
          <p className="text-xs text-gray-400 mb-1.5 pl-10">Day {s.day_number} · {DAY_LABELS[s.day_number]?.date}</p>
        )}
        <p className="text-sm text-gray-700 leading-relaxed pl-10">{s.content}</p>
      </div>
    )
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 modal-backdrop sm:hidden" onClick={onClose} />
      )}
      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full z-30 w-full sm:w-96 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white sticky top-0">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Suggestions</h2>
            <p className="text-xs text-gray-500">
              {pending.length} pending · {applied.length} applied
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {suggestions.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-gray-500 font-medium">No suggestions yet</p>
              <p className="text-gray-400 text-sm mt-1">Be the first to add one!</p>
            </div>
          )}

          {pending.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Pending ({pending.length})</p>
              <div className="space-y-3">
                {pending.map((s) => <SuggCard key={s.id} s={s} />)}
              </div>
            </div>
          )}

          {applied.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Applied by AI ({applied.length})</p>
              <div className="space-y-3">
                {applied.map((s) => <SuggCard key={s.id} s={s} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AI Review Button
// ─────────────────────────────────────────────────────────────────────────────
function AIReviewButton({
  pendingCount,
  onReview,
  reviewing,
}: {
  pendingCount: number
  onReview: () => void
  reviewing: boolean
}) {
  return (
    <button
      onClick={onReview}
      disabled={reviewing || pendingCount === 0}
      className="ai-btn relative flex items-center gap-2 px-4 py-2 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      {reviewing ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          AI is reviewing...
        </>
      ) : (
        <>
          <span>✨</span>
          AI Review
          {pendingCount > 0 && (
            <span className="bg-white/30 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </>
      )}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-l-4 border-gray-200 p-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full skeleton flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 skeleton rounded-lg w-3/4" />
          <div className="h-3 skeleton rounded-lg w-1/2" />
          <div className="h-3 skeleton rounded-lg w-full" />
          <div className="h-3 skeleton rounded-lg w-5/6" />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const [items, setItems] = useState<ItineraryItem[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selectedDay, setSelectedDay] = useState(1)
  const [loading, setLoading] = useState(true)
  const [suggestTarget, setSuggestTarget] = useState<ItineraryItem | null | 'new'>()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading' } | null>(null)
  const [copied, setCopied] = useState(false)

  const showToast = (message: string, type: 'success' | 'error' | 'loading') => {
    setToast({ message, type })
  }

  const dismissToast = useCallback(() => setToast(null), [])

  // Load data
  const loadData = useCallback(async () => {
    const [{ data: itemsData }, { data: suggsData }] = await Promise.all([
      supabase.from('itinerary_items').select('*').order('day_number').order('order_index'),
      supabase.from('suggestions').select('*').order('created_at', { ascending: false }),
    ])
    if (itemsData) setItems(itemsData)
    if (suggsData) setSuggestions(suggsData)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()

    // Realtime subscriptions
    const channel = supabase
      .channel('realtime-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'itinerary_items' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'suggestions' }, loadData)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [loadData])

  // Compute derived data
  const dayItems = items.filter((i) => i.day_number === selectedDay)
  const pendingSuggestions = suggestions.filter((s) => s.status === 'pending')

  const getSuggestionCount = (itemId: string) =>
    suggestions.filter((s) => s.item_id === itemId && s.status === 'pending').length

  const itemsByTimeSlot = TIME_SLOT_ORDER.reduce((acc, slot) => {
    acc[slot] = dayItems.filter((i) => i.time_slot === slot).sort((a, b) => a.order_index - b.order_index)
    return acc
  }, {} as Record<string, ItineraryItem[]>)

  // Submit suggestion
  async function handleSuggestionSubmit(data: {
    author: string
    content: string
    type: string
    itemId: string | null
    dayNumber: number
  }) {
    const { error } = await supabase.from('suggestions').insert({
      author_name: data.author,
      content: data.content,
      type: data.type,
      item_id: data.itemId,
      day_number: data.dayNumber,
      status: 'pending',
    })
    if (error) {
      showToast('Failed to submit suggestion. Try again.', 'error')
    } else {
      showToast('Suggestion submitted!', 'success')
      await loadData()
    }
  }

  // AI review
  async function handleAIReview() {
    if (pendingSuggestions.length === 0) return
    setReviewing(true)
    showToast('Claude is reviewing all suggestions...', 'loading')

    try {
      const res = await fetch('/api/ai-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, suggestions: pendingSuggestions }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'AI review failed')
      }

      dismissToast()
      showToast(`Done! ${json.summary}`, 'success')
      await loadData()
    } catch (err: unknown) {
      dismissToast()
      const message = err instanceof Error ? err.message : 'AI review failed. Check your API key.'
      showToast(message, 'error')
    } finally {
      setReviewing(false)
    }
  }

  // Copy share link
  function handleCopy() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const DAY_THEMES = [
    { bg: 'from-sky-500 to-blue-600', label: 'Arrival' },
    { bg: 'from-orange-400 to-pink-500', label: 'Adventure' },
    { bg: 'from-teal-400 to-cyan-600', label: 'Beach & Chill' },
    { bg: 'from-violet-500 to-purple-600', label: 'Limassol' },
    { bg: 'from-amber-400 to-orange-500', label: 'Paphos' },
    { bg: 'from-emerald-400 to-teal-600', label: 'Last Day' },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="wave-bg text-white">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">🌊</span>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Group Trip Planner</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black gradient-text leading-tight">
                Cyprus 2025
              </h1>
              <p className="text-blue-200 text-sm mt-1 font-medium">
                Aug 5–10 · Ayia Napa, Protaras, Limassol, Paphos
              </p>
              <p className="text-blue-300 text-xs mt-0.5">4–5 guys · The boys trip 🍻</p>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {copied ? 'Copied!' : 'Share'}
              </button>
              <AIReviewButton
                pendingCount={pendingSuggestions.length}
                onReview={handleAIReview}
                reviewing={reviewing}
              />
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex gap-4 mt-5 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-xl font-black">6</p>
              <p className="text-blue-200 text-xs">Days</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-xl font-black">{items.length}</p>
              <p className="text-blue-200 text-xs">Activities</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center cursor-pointer" onClick={() => setShowSuggestions(true)}>
              <p className="text-xl font-black">{suggestions.length}</p>
              <p className="text-blue-200 text-xs">Suggestions</p>
            </div>
            {pendingSuggestions.length > 0 && (
              <>
                <div className="w-px bg-white/20" />
                <div className="text-center cursor-pointer" onClick={() => setShowSuggestions(true)}>
                  <p className="text-xl font-black text-amber-300">{pendingSuggestions.length}</p>
                  <p className="text-blue-200 text-xs">Pending</p>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Day Selector */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-3">
            {Object.entries(DAY_LABELS).map(([dayNum, info]) => {
              const day = Number(dayNum)
              const isActive = day === selectedDay
              const theme = DAY_THEMES[day - 1]
              const daySuggCount = suggestions.filter((s) => s.day_number === day && s.status === 'pending').length

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl transition-all text-xs font-bold relative ${
                    isActive
                      ? `bg-gradient-to-b ${theme.bg} text-white shadow-md`
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className={isActive ? 'text-white/80' : 'text-gray-400'} style={{ fontSize: '0.65rem' }}>
                    {info.shortDate}
                  </span>
                  <span>{info.label}</span>
                  {daySuggCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-amber-400 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {daySuggCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Day header */}
        <div className={`bg-gradient-to-r ${DAY_THEMES[selectedDay - 1].bg} rounded-2xl p-5 mb-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">
                Day {selectedDay} of 6
              </p>
              <h2 className="text-xl font-black">{DAY_LABELS[selectedDay].date}</h2>
              <p className="text-white/80 text-sm mt-0.5">{DAY_THEMES[selectedDay - 1].label}</p>
            </div>
            <button
              onClick={() => setSuggestTarget('new')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>+</span> Add idea
            </button>
          </div>
        </div>

        {/* Items by time slot */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-8">
            {TIME_SLOT_ORDER.map((slot) => {
              const slotItems = itemsByTimeSlot[slot]
              if (!slotItems || slotItems.length === 0) return null

              return (
                <section key={slot}>
                  <div className="time-slot-header">
                    <span>{TIME_SLOT_EMOJI[slot]}</span>
                    <span>{TIME_SLOT_LABEL[slot]}</span>
                  </div>
                  <div className="space-y-3">
                    {slotItems.map((item) => (
                      <ActivityCard
                        key={item.id}
                        item={item}
                        suggestionCount={getSuggestionCount(item.id)}
                        onSuggest={(i) => setSuggestTarget(i)}
                      />
                    ))}
                  </div>
                </section>
              )
            })}

            {dayItems.length === 0 && (
              <div className="text-center py-16">
                <p className="text-5xl mb-3">📋</p>
                <p className="text-gray-500 font-semibold">No activities yet for this day</p>
                <button
                  onClick={() => setSuggestTarget('new')}
                  className="mt-3 text-sky-600 text-sm font-bold hover:text-sky-700"
                >
                  + Suggest something
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">Got a better idea? 💡</p>
            <p className="text-gray-500 text-xs mt-0.5">Suggest edits or additions — everyone with the link can see them.</p>
          </div>
          <button
            onClick={() => setSuggestTarget('new')}
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
          >
            Suggest
          </button>
        </div>

        {/* Suggestions button (mobile) */}
        <button
          onClick={() => setShowSuggestions(true)}
          className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:border-sky-300 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-sm">View All Suggestions</p>
              <p className="text-gray-400 text-xs">
                {suggestions.length === 0
                  ? 'No suggestions yet'
                  : `${pendingSuggestions.length} pending · ${suggestions.filter((s) => s.status === 'applied').length} applied`}
              </p>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </main>

      {/* Suggestions Panel */}
      <SuggestionsPanel
        suggestions={suggestions}
        items={items}
        isOpen={showSuggestions}
        onClose={() => setShowSuggestions(false)}
      />

      {/* Suggest Modal */}
      {suggestTarget !== undefined && (
        <SuggestModal
          item={suggestTarget === 'new' ? null : suggestTarget}
          dayNumber={selectedDay}
          onClose={() => setSuggestTarget(undefined)}
          onSubmit={handleSuggestionSubmit}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={dismissToast} />
      )}
    </div>
  )
}
