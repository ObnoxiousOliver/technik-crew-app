export class AppError extends Error {
  code: string

  constructor (code: string, message?: string, cause?: string) {
    super(message, {
      cause
    })

    this.code = code
  }

  toString (): string {
    return `${this.code}: ${this.message} ${this.cause}`
  }
}
