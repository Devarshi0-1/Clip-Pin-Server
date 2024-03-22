import { isValidObjectId } from 'mongoose';
import Note from '../models/note.model.js';
import { httpCode } from '../utils/httpCodes.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import { isEmpty } from '../utils/userValidation.js';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *  @returns {import('express').Response}
 */

export const getMyNotes = async (req, res) => {
	try {
		const userId = req.user._id.toString();

		if (isEmpty(userId))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'No User Id provided!'
			);

		const notes = await Note.find({ owner: userId }).populate('tags');

		return sendSuccessResponse(
			res,
			httpCode.successful,
			notes,
			'Notes fetched Successfully!'
		);
	} catch (error) {
		console.error('Error in GetAllNotes Controller', error.message);
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

export const createNote = async (req, res) => {
	try {
		const { title, content } = req.body;

		if (isEmpty(title) && isEmpty(content))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Both Title and Description cannot be empty!'
			);

		const note = await Note.create({
			owner: req.user._id,
			title,
			content,
		});

		return sendSuccessResponse(
			res,
			httpCode.resourceCreated,
			note,
			'Created Note Successfully!'
		);
	} catch (error) {
		console.error('Error in CreateNote Controller', error.message);
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

export const editNote = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, content } = req.body;

		if (isEmpty(id))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'No Note Id Provided!'
			);

		if (!isValidObjectId(id))
			return sendErrorResponse(res, httpCode.badRequest, 'Invalid Id!');

		if (isEmpty(title) && isEmpty(content))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Both Title and Content cannot be empty!'
			);

		const note = await Note.findByIdAndUpdate(
			{ _id: id },
			{
				$set: { title, content },
			},
			{ new: true }
		).populate('tags');

		if (!note)
			return sendErrorResponse(
				res,
				httpCode.resourceNotFound,
				'Note Not Found!'
			);

		return sendSuccessResponse(
			res,
			httpCode.successful,
			note,
			'Note Updated Successfully!'
		);
	} catch (error) {
		console.error('Error in EditNote Controller', error.message);
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

export const deleteNote = async (req, res) => {
	try {
		const { id } = req.params;

		if (isEmpty(id))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'No Note Id Provided!'
			);

		if (!isValidObjectId(id))
			return sendErrorResponse(res, httpCode.badRequest, 'Invalid Id!');

		await Note.deleteOne({ _id: id });

		return sendSuccessResponse(
			res,
			httpCode.successful,
			null,
			'Note Deleted Successfully!'
		);
	} catch (error) {
		console.error('Error in EditNote Controller', error.message);
		return sendErrorResponse(
			res,
			httpCode.badRequest,
			'Internal Server Error!'
		);
	}
};
