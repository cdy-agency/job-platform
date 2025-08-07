import { useState, useEffect, useCallback } from 'react'

export function useDebouncedSearch(initialValue: string = '', delay: number = 300) {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [searchTerm, delay])

  const updateSearchTerm = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
    setDebouncedSearchTerm('')
  }, [])

  return {
    searchTerm,
    debouncedSearchTerm,
    updateSearchTerm,
    clearSearch,
    isSearching: searchTerm !== debouncedSearchTerm
  }
}

export default useDebouncedSearch