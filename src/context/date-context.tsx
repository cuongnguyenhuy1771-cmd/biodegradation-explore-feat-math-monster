import React, { createContext, useContext, useState, ReactNode } from 'react'

interface DateContextType {
  selectedDate: string
  setSelectedDate: (date: string) => void
  refreshTrigger: number
  triggerRefresh: () => void
}

const DateContext = createContext<DateContextType | undefined>(undefined)

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate, refreshTrigger, triggerRefresh }}>
      {children}
    </DateContext.Provider>
  )
}

export const useDate = () => {
  const context = useContext(DateContext)
  if (context === undefined) {
    throw new Error('useDate must be used within a DateProvider')
  }
  return context
}
