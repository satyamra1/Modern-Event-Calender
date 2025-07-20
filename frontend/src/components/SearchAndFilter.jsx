"use client"

import { useState } from "react"
import { Search, Filter, X, Calendar, Clock, Tag } from "lucide-react"

export default function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  events,
  filteredEvents,
}) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const categories = [...new Set(events.map((event) => event.category).filter(Boolean))]

  const totalEvents = events.length
  const filteredCount = filteredEvents.length
  const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date()).length

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
  }

  const hasActiveFilters = searchTerm.trim() || selectedCategory !== "all"

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search events by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
          {/* cat filter */}
      
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
              showAdvancedFilters
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Adv Filters */}
      {showAdvancedFilters && (
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Categories</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategory === "all"
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

        
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statistics</label>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Total Events: {totalEvents}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Upcoming: {upcomingEvents}</span>
                </div>
                {hasActiveFilters && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Filtered: {filteredCount}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-800">
              {filteredCount === 0 ? (
                <span>No events found matching your criteria</span>
              ) : (
                <span>
                  Showing {filteredCount} of {totalEvents} events
                  {searchTerm && (
                    <span>
                      {" "}
                      for "<strong>{searchTerm}</strong>"
                    </span>
                  )}
                  {selectedCategory !== "all" && (
                    <span>
                      {" "}
                      in <strong>{selectedCategory}</strong> category
                    </span>
                  )}
                </span>
              )}
            </div>
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800 underline">
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
