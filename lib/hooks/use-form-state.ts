import { useState, useCallback } from 'react'

export function useFormState() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const clearError = useCallback(() => setError(''), [])
  const setErrorMessage = useCallback((message: string) => setError(message), [])

  return {
    error,
    isLoading,
    setError: setErrorMessage,
    setIsLoading,
    clearError,
  }
}
