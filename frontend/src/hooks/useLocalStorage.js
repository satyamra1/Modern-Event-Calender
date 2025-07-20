"use client"

import { useState, useEffect, useRef } from "react"

export function useLocalStorage(key, initialValue) {

  const initialized = useRef(false)

  const [storedValue, setStoredValue] = useState(() => {

    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const testKey = "__test__"
      localStorage.setItem(testKey, "test")
      localStorage.removeItem(testKey)

      const item = localStorage.getItem(key)

      if (item === null) {
        return initialValue
      }

      const parsed = JSON.parse(item)
   
      return parsed
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)

      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(valueToStore))
     
        const verification = localStorage.getItem(key)
        if (verification) {
          const verified = JSON.parse(verification)
      
        }
      }
    } catch (error) {
      
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
    }
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
    
    } else {
      console.log( storedValue)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

export function debugLocalStorage() {
  if (typeof window === "undefined") {
    return false
  }

  try {
 
    localStorage.setItem("__debug__", "test")
    const result = localStorage.getItem("__debug__")
    localStorage.removeItem("__debug__")

    if (result === "test") {
   
      const events = localStorage.getItem("calendarEvents")
      console.log(" Calendar events:", events ? JSON.parse(events) : "None")

      return true
    } else {
   
      return false
    }
  } catch (error) {
   
    return false
  }
}
