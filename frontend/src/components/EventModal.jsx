"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { X, Trash2 } from "lucide-react"

export default function EventModal({ isOpen, onClose, onSave, onDelete, event, selectedDate, mode }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    recurrence: "none",
    color: "bg-blue-100 text-blue-800",
    category: "personal",
  })

  const colorOptions = [
    { value: "bg-blue-100 text-blue-800", label: "Blue" },
    { value: "bg-green-100 text-green-800", label: "Green" },
    { value: "bg-red-100 text-red-800", label: "Red" },
    { value: "bg-yellow-100 text-yellow-800", label: "Yellow" },
    { value: "bg-purple-100 text-purple-800", label: "Purple" },
    { value: "bg-pink-100 text-pink-800", label: "Pink" },
  ]


  const categoryOptions = [
    { value: "personal", label: "Personal", icon: "👤" },
    { value: "work", label: "Work", icon: "💼" },
    { value: "health", label: "Health", icon: "🏥" },
    { value: "social", label: "Social", icon: "👥" },
    { value: "education", label: "Education", icon: "📚" },
    { value: "travel", label: "Travel", icon: "✈️" },
    { value: "finance", label: "Finance", icon: "💰" },
    { value: "other", label: "Other", icon: "📝" },
  ]

  
  useEffect(() => {
    if (mode === "edit" && event) {
      setFormData({
        title: event.title || "",
        date: event.date || "",
        time: event.time || "",
        description: event.description || "",
        recurrence: event.recurrence || "none",
        color: event.color || "bg-blue-100 text-blue-800",
        category: event.category || "personal",
      })
    } else if (mode === "add" && selectedDate) {
      setFormData({
        title: "",
        date: format(selectedDate, "yyyy-MM-dd"),
        time: "",
        description: "",
        recurrence: "none",
        color: "bg-blue-100 text-blue-800",
        category: "personal",
      })
    }
  }, [mode, event, selectedDate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert("Please enter a title for the event")
      return
    }

    onSave(formData)
  }


  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">{mode === "add" ? "Add Event" : "Edit Event"}</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

        {/* Modal Body */}
      <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event description"
            />
          </div>

          {/* Recurrence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence</label>
            <select
              name="recurrence"
              value={formData.recurrence}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">No recurrence</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* pick color for events */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color: option.value }))}
                  className={`
                    p-2 rounded-md text-sm font-medium transition-all
                    ${option.value}
                    ${formData.color === option.value ? "ring-2 ring-gray-400" : ""}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, category: option.value }))}
                  className={`
          p-3 rounded-md text-sm font-medium transition-all border-2 flex items-center gap-2
          ${
            formData.category === option.value
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          }
        `}
                >
                  <span className="text-lg">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form  */}
          <div className="flex items-center justify-between pt-4">
            <div>
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {mode === "add" ? "Add Event" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
