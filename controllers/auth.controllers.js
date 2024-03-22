import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { httpCode } from '../utils/httpCodes.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import { generateCookie } from '../utils/sendCookie.js';
import { isEmpty, isUserNameValid } from '../utils/userValidation.js';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *  @returns {import('express').Response}
 */

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (isEmpty(username, password))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Required Fields empty!'
			);

		if (!isUserNameValid(username))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Username can only contain Lowercase Letters Numbers Dots Underscores'
			);

		if (username.length >= 20 || password.length >= 20)
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Exceed character limit!'
			);

		const user = await User.findOne({ username });

		if (!user)
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'User not found, SignUp first!'
			);

		const isPasswordMatch = await bcrypt.compare(password, user.password);

		if (!isPasswordMatch)
			return sendErrorResponse(
				res,
				httpCode.notAuthorized,
				'Wrong Username or Password!'
			);

		generateCookie(res, user._id);

		return sendSuccessResponse(
			res,
			httpCode.successful,
			{
				_id: user._id,
				username: user.username,
				fullName: user.fullName,
				createdAt: user.createdAt,
			},
			`Welcome back, ${user.fullName.split(' ')[0]}`
		);
	} catch (error) {
		console.error('Error in Login Controller', error.message);
		return sendErrorResponse(
			res,
			httpCode.badRequest,
			'Internal Server Error!'
		);
	}
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *  @returns {import('express').Response}
 */

export const register = async (req, res) => {
	try {
		const { fullName, username, password } = req.body;

		if (isEmpty(fullName, username, password))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Required Fields empty!'
			);

		if (fullName.length >= 20 || username >= 20 || password.length >= 20)
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Exceed character limit!'
			);

		if (!isUserNameValid(username))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Username can only contain Lowercase Letters Numbers Dots Underscores'
			);

		let user = await User.findOne({ username });

		if (user)
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'User already exists!'
			);

		const hashedPassword = await bcrypt.hash(password, 12);

		user = await User.create({ fullName, username, password: hashedPassword });

		generateCookie(res, user._id);

		return sendSuccessResponse(
			res,
			httpCode.resourceCreated,
			{
				_id: user._id,
				username: user.username,
				fullName: user.fullName,
				createdAt: user.createdAt,
			},
			'User Signup Successful!'
		);
	} catch (error) {
		console.error('Error in Register Controller', error.message);
		return sendErrorResponse(
			res,
			httpCode.badRequest,
			'Internal Server Error!'
		);
	}
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *  @returns {import('express').Response}
 */

export const logout = async (req, res) => {
	try {
		res.cookie('jwt', '', { maxAge: 0 });
		req.user = null;
		return sendSuccessResponse(res, httpCode.successful, null, 'Logged Out!');
	} catch (error) {
		console.error('Error in Logout Controller', error.message);
		return sendErrorResponse(
			res,
			httpCode.internalServerError,
			'Internal Server Error!'
		);
	}
};
