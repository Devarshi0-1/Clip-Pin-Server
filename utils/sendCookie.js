import jwt from 'jsonwebtoken';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const generateCookie = (res, userId) => {
	const maxAge = 15 * 24 * 60 * 60 * 1000; // 15 days in ms

	const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
		expiresIn: '15d',
	});

	res.cookie('jwt', token, {
		httpOnly: true,
		maxAge,
		sameSite: process.env.NODE_ENV === 'DEVELOPMENT' ? 'lax' : 'none',
		secure: process.env.NODE_ENV === 'DEVELOPMENT' ? false : true,
		origin: process.env.FRONTEND_URL,
	});
};
