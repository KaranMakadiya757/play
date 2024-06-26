class apiError extends Error {
    constructor(
        statuscode,
        message = "Something went wrong",
        errors = [],
        stack = []
    ) {
        super(message)
        this.statuscode = statuscode
        this.message = message
        this.errors = errors
        this.data = null
        this.sucess = false

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}