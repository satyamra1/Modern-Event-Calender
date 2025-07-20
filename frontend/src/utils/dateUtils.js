import { format, parseISO, isToday, isTomorrow, isYesterday, addDays, addWeeks, addMonths } from 'date-fns'

export function formatDateLabel(dateString) {
  const date = parseISO(dateString)
  if (isToday(date)) return "Today"
  if (isTomorrow(date)) return "Tomorrow"
  if (isYesterday(date)) return "Yesterday"
  return format(date, "EEEE, MMM d, yyyy")
}


export function checkRecurringEvent(event, checkDate) {
  const eventDate = parseISO(event.date)
  const daysDiff = Math.floor((checkDate - eventDate) / (1000 * 60 * 60 * 24))

  if (daysDiff < 0) return false

  switch (event.recurrence) {
    case 'daily':
      return true
    case 'weekly':
      return daysDiff % 7 === 0
    case 'monthly':
      return checkDate.getDate() === eventDate.getDate()
    case 'none':
    default:
      return daysDiff === 0
  }
}


export function generateRecurringEvents(event, startDate, endDate) {
  if (event.recurrence === 'none') {
    return [event]
  }

  const instances = []
  const eventDate = parseISO(event.date)
  let currentDate = new Date(Math.max(eventDate, startDate))

  while (currentDate <= endDate) {
    if (checkRecurringEvent(event, currentDate)) {
      instances.push({
        ...event,
        id: `${event.id}-${format(currentDate, 'yyyy-MM-dd')}`,
        date: format(currentDate, 'yyyy-MM-dd'),
        isRecurring: true,
        originalId: event.id
      })
    }

    switch (event.recurrence) {
      case 'daily':
        currentDate = addDays(currentDate, 1)
        break
      case 'weekly':
        currentDate = addWeeks(currentDate, 1)
        break
      case 'monthly':
        currentDate = addMonths(currentDate, 1)
        break
      default:
        currentDate = addDays(currentDate, 1)
    }

    if (instances.length > 365) break
  }

  return instances
}

export function getCategoryIcon(category) {
  const icons = {
    personal: "👤",
    work: "💼",
    health: "🏥",
    social: "👥",
    education: "📚",
    travel: "✈️",
    finance: "💰",
    other: "📝",
  }
  return icons[category] || "📝"
}

export function getCategoryColor(category) {
  const colors = {
    personal: "bg-blue-100 text-blue-800",
    work: "bg-purple-100 text-purple-800",
    health: "bg-green-100 text-green-800",
    social: "bg-pink-100 text-pink-800",
    education: "bg-yellow-100 text-yellow-800",
    travel: "bg-indigo-100 text-indigo-800",
    finance: "bg-red-100 text-red-800",
    other: "bg-gray-100 text-gray-800",
  }
  return colors[category] || "bg-gray-100 text-gray-800"
}
