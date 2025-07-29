export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly expectedType: string,
    public readonly receivedValue: unknown
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}