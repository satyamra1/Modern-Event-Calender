"use client"

import { format, parseISO, isToday, isTomorrow, isYesterday } from "date-fns"
import { Calendar, Clock, Tag } from "lucide-react"

export default function EventList({ events, onEventClick, searchTerm }) {

  const groupEventsByDate = (events) => {
    const grouped = {}
    events.forEach((event) => {
      const dateKey = event.date
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(event)
    })

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b))
    return sortedDates.map((date) => ({
      date,
      events: grouped[date].sort((a, b) => (a.time || "").localeCompare(b.time || "")),
    }))
  }

  const formatDateLabel = (dateString) => {
    const date = parseISO(dateString)
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    if (isYesterday(date)) return "Yesterday"
    return format(date, "EEEE, MMM d, yyyy")
  }

  const getCategoryIcon = (category) => {
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

  // Highlight search terms
  const highlightText = (text, searchTerm) => {
    if (!searchTerm.trim()) return text

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const groupedEvents = groupEventsByDate(events)

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Event List</h3>
        <p className="text-sm text-gray-500">{events.length} events found</p>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {groupedEvents.map(({ date, events: dayEvents }) => (
          <div key={date} className="border-b last:border-b-0">
            {/* Date Header */}
            <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b">
              <h4 className="font-medium text-gray-900">{formatDateLabel(date)}</h4>
            </div>

            <div className="divide-y">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    
                    <div className={`w-3 h-3 rounded-full mt-1 ${event.color?.split(" ")[0] || "bg-blue-500"}`} />

                    <div className="flex-1 min-w-0">
                      {/*  Title */}
                      <h5 className="font-medium text-gray-900 truncate">{highlightText(event.title, searchTerm)}</h5>

                      {/* Event Details */}
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        {event.time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.time}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <span>{getCategoryIcon(event.category)}</span>
                          <span className="capitalize">{event.category}</span>
                        </div>

                        {event.recurrence && event.recurrence !== "none" && (
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span className="capitalize">{event.recurrence}</span>
                          </div>
                        )}
                      </div>

                      {/* Event Description */}
                      {event.description && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {highlightText(event.description, searchTerm)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
