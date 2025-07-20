"use client"

import { useState } from "react"
import { format } from "date-fns"

export default function CalendarDay({ date, isCurrentMonth, isToday, events, onClick, onEventClick, onEventDrop }) {
  const [isDragOver, setIsDragOver] = useState(false)

  //  drag over
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  // drag leave
  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  // drop
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)

    const eventId = e.dataTransfer.getData("text/plain")
    if (eventId) {
      onEventDrop(eventId, date)
    }
  }

  //  drag 
  const handleEventDragStart = (e, event) => {
    e.dataTransfer.setData("text/plain", event.id)
    e.stopPropagation()
  }

  const dayClasses = `
    min-h-[120px] p-2 border border-gray-200 cursor-pointer transition-colors
    ${isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50 text-gray-400"}
    ${isToday ? "bg-blue-50 border-blue-200" : ""}
    ${isDragOver ? "bg-blue-100 border-blue-300" : ""}
  `

  return (
    <div
      className={dayClasses}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
    
      <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : ""}`}>{format(date, "d")}</div>

      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            draggable
            onDragStart={(e) => handleEventDragStart(e, event)}
            onClick={(e) => {
              e.stopPropagation()
              onEventClick(event)
            }}
            className={`
              text-xs p-1 rounded cursor-pointer truncate
              ${event.color || "bg-blue-100 text-blue-800"}
              hover:opacity-80 transition-opacity
            `}
            title={event.title}
          >
            {event.title}
          </div>
        ))}

   
        {events.length > 3 && <div className="text-xs text-gray-500 pl-1">+{events.length - 3} more</div>}
      </div>
    </div>
  )
}
