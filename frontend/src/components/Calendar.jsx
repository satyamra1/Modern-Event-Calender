"use client"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CalendarDay from "./CalendarDay"

export default function Calendar({
  currentDate,
  setCurrentDate,
  events,
  onDayClick,
  onEventClick,
  onEventDrop,
}) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  const getEventsForDate = (date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return events.filter((event) => {
      if (event.date === dateString) return true
      if (event.recurrence && event.recurrence !== "none") {
        return checkRecurringEvent(event, date)
      }
      return false
    })
  }

  const checkRecurringEvent = (event, checkDate) => {
    const eventDate = new Date(event.date)
    const daysDiff = Math.floor((checkDate - eventDate) / (1000 * 60 * 60 * 24))
    switch (event.recurrence) {
      case "daily":
        return daysDiff >= 0
      case "weekly":
        return daysDiff >= 0 && daysDiff % 7 === 0
      case "monthly":
        return daysDiff >= 0 && checkDate.getDate() === eventDate.getDate()
      default:
        return false
    }
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={goToPreviousMonth}>
          <ChevronLeft />
        </button>
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Today
          </button>
        </div>
        <button onClick={goToNextMonth}>
          <ChevronRight />
        </button>
      </div>


      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

    
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => (
          <CalendarDay
            key={day.toISOString()}
            date={day}
            isCurrentMonth={isSameMonth(day, currentDate)}
            isToday={isToday(day)}
            events={getEventsForDate(day)}
            onClick={() => onDayClick(day)}
            onEventClick={onEventClick}
            onEventDrop={onEventDrop}
          />
        ))}
      </div>
    </div>
  )
}
