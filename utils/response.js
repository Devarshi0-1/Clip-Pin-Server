/**
 *
 * @param {import('express').Response} res
 * @param {number} status
 * @param {any} data
 * @param {string} successMessage
 * @returns {import('express').Response}
 */

const sendSuccessResponse = (res, status, data, successMessage) => {
    return res.status(status).json({
        success: true,
        data,
        message: successMessage,
        isError: false,
        error: {
            message: '',
        },
    })
}

/**
 *
 * @param {import('express').Response} res
 * @param {number} status
 * @param {string} errorMessage
 * @returns {import('express').Response}
 */

const sendErrorResponse = (res, status, errorMessage) => {
    return res.status(status).json({
        success: false,
        data: null,
        message: '',
        isError: true,
        error: {
            message: errorMessage,
        },
    })
}

export { sendErrorResponse, sendSuccessResponse }
