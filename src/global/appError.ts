export default class AppError extends Error {
  public statusCode: number
  public status: string
  public isOperational: boolean
  public success: boolean

  constructor(message: string, statusCode: number) {
    super(message)

    this.statusCode = statusCode
    this.success = false
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}
