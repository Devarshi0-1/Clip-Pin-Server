import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { httpCode } from '../utils/httpCodes.js';
import { sendErrorResponse } from '../utils/response.js';
import { isEmpty } from '../utils/userValidation.js';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 *  @returns {import('express').Response}
 */

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (isEmpty(token))
			return sendErrorResponse(
				res,
				httpCode.notAuthorized,
				'Unauthorized! No Token Provided'
			);

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded)
			return sendErrorResponse(
				res,
				httpCode.notAuthorized,
				'Unauthorized! Invalid Token'
			);

		const user = await User.findById(decoded._id).select('-password');

		if (!user)
			return sendErrorResponse(
				res,
				httpCode.resourceNotFound,
				'User not found!'
            );
        
		req.user = user;
        
		next();
	} catch (error) {
		console.log('Error at function protectedRoute: ', error.message);
		return sendErrorResponse(
			res,
			httpCode.internalServerError,
			'Internal Server Error!\nTry Logging Out and Logging back in!'
		);
	}
};
