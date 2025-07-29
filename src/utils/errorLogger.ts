import { ValidationError } from '@/types/validation'

export const errorLogger = {
  logValidationError(error: ValidationError, endpoint: string) {
    if (import.meta.env.DEV) {
      console.group(`🔴 Validation Error: ${endpoint}`)
      console.error('Message:', error.message)
      console.error('Field:', error.field)
      console.error('Expected:', error.expectedType)
      console.error('Received:', error.receivedValue)
      console.groupEnd()
    }
  },

  logNetworkError(message: string, endpoint?: string, details?: Record<string, unknown>) {
    if (import.meta.env.DEV) {
      console.error(`🌐 Network Error: ${endpoint || 'Unknown endpoint'}`, message, details)
    }
  },

  logServerError(message: string, endpoint?: string, status?: number) {
    if (import.meta.env.DEV) {
      console.error(`🔥 Server Error: ${endpoint || 'Unknown endpoint'}`, message, `Status: ${status}`)
    }
  }
}