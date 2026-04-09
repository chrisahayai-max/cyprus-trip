export interface ItineraryItem {
  id: string
  day_number: number
  day_date: string
  time_slot: 'morning' | 'afternoon' | 'evening' | 'night'
  type: 'activity' | 'meal' | 'nightlife' | 'transport'
  title: string
  description: string | null
  location: string | null
  emoji: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface Suggestion {
  id: string
  item_id: string | null
  day_number: number | null
  author_name: string
  content: string
  type: 'edit' | 'addition' | 'swap' | 'general'
  status: 'pending' | 'applied' | 'dismissed'
  created_at: string
}

export const DAY_LABELS: Record<number, { label: string; date: string; shortDate: string }> = {
  1: { label: 'Day 1', date: 'Tuesday, Aug 5', shortDate: 'Aug 5' },
  2: { label: 'Day 2', date: 'Wednesday, Aug 6', shortDate: 'Aug 6' },
  3: { label: 'Day 3', date: 'Thursday, Aug 7', shortDate: 'Aug 7' },
  4: { label: 'Day 4', date: 'Friday, Aug 8', shortDate: 'Aug 8' },
  5: { label: 'Day 5', date: 'Saturday, Aug 9', shortDate: 'Aug 9' },
  6: { label: 'Day 6', date: 'Sunday, Aug 10', shortDate: 'Aug 10' },
}

export const TIME_SLOT_ORDER = ['morning', 'afternoon', 'evening', 'night'] as const

export const TYPE_COLORS: Record<ItineraryItem['type'], string> = {
  activity: 'border-sky-400 bg-sky-50',
  meal: 'border-orange-400 bg-orange-50',
  nightlife: 'border-purple-400 bg-purple-50',
  transport: 'border-gray-300 bg-gray-50',
}

export const TYPE_BADGE: Record<ItineraryItem['type'], string> = {
  activity: 'bg-sky-100 text-sky-700',
  meal: 'bg-orange-100 text-orange-700',
  nightlife: 'bg-purple-100 text-purple-700',
  transport: 'bg-gray-100 text-gray-600',
}

export const TIME_SLOT_LABEL: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
}

export const TIME_SLOT_EMOJI: Record<string, string> = {
  morning: '🌅',
  afternoon: '☀️',
  evening: '🌇',
  night: '🌙',
}
