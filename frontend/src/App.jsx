"use client"

import { useState } from "react"
import { useEffect } from "react"
import Calendar from "./components/Calendar"
import EventModal from "./components/EventModal"
import SearchAndFilter from "./components/SearchAndFilter"
import EventList from "./components/EventList"
import { format } from "date-fns"
import { useLocalStorage } from "./hooks/useLocalStorage" 

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useLocalStorage("calendarEvents", [])

  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredEvents, setFilteredEvents] = useState([])
  const [viewMode, setViewMode] = useState("calendar")

  
  useEffect(() => {
  let filtered = events

  if (searchTerm.trim()) {
    filtered = filtered.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  if (selectedCategory !== "all") {
    filtered = filtered.filter((event) => event.category === selectedCategory)
  }

  setFilteredEvents(filtered)
}, [events, searchTerm, selectedCategory])

  const handleAddEvent = (eventData) => {
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
      createdAt: new Date().toISOString(),
    }
    setEvents((prev) => [...prev, newEvent])
    setIsModalOpen(false)
  }

  const handleEditEvent = (eventData) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === selectedEvent.id ? { ...event, ...eventData } : event))
    )
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const handleDayClick = (date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setModalMode("add")
    setIsModalOpen(true)
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleEventDrop = (eventId, newDate) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, date: format(newDate, "yyyy-MM-dd") } : event
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">Event Calendar</h1>
          <p className="text-gray-600 text-center mt-2">Click on a day to add events, drag events to reschedule</p>
        </header>

        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          events={events}
          filteredEvents={filteredEvents}
        />

        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-lg p-1 flex">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "calendar" ? "bg-blue-500 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "list" ? "bg-blue-500 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {viewMode === "calendar" ? (
          <Calendar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            events={filteredEvents.length > 0 || searchTerm || selectedCategory !== "all" ? filteredEvents : events}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
          />
        ) : (
          <EventList
            events={filteredEvents.length > 0 || searchTerm || selectedCategory !== "all" ? filteredEvents : events}
            onEventClick={handleEventClick}
            searchTerm={searchTerm}
          />
        )}

        {isModalOpen && (
          <EventModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedEvent(null)
            }}
            onSave={modalMode === "add" ? handleAddEvent : handleEditEvent}
            onDelete={handleDeleteEvent}
            event={selectedEvent}
            selectedDate={selectedDate}
            mode={modalMode}
          />
        )}
      </div>
    </div>
  )
}

export default App
