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
		const { title, content, isArchived, isBookmarked } = req.body;

		if (isEmpty(id))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'No Note Id Provided!'
			);

		if (!isValidObjectId(id))
			return sendErrorResponse(res, httpCode.badRequest, 'Invalid Id!');

		if (
			isEmpty(title) &&
			isEmpty(content) &&
			isEmpty((!!isArchived).toString()) &&
			isEmpty((!!isBookmarked).toString())
		)
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'All fields cannot be empty!'
			);

		if (isArchived && isBookmarked)
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Cannot bookmark an archived note!'
			);

		const note = await Note.findByIdAndUpdate(
			{ _id: id },
			{ $set: { title, content, isArchived, isBookmarked } },
			{ new: true }
		).populate('tags');

		if (!note)
			return sendErrorResponse(
				res,
				httpCode.resourceNotFound,
				'Note Not Found!'
			);

		if (note.isArchived && note.isBookmarked)
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Cannot bookmark an archived note!'
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

		const ok = await Note.deleteOne({ _id: id });

		if (!ok)
			return sendErrorResponse(
				res,
				httpCode.internalServerError,
				null,
				'Some error occurred!'
			);

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

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *  @returns {import('express').Response}
 */

export const batchDeleteNote = async (req, res) => {
	try {
        const { selectedNotes } = req.body;
        
        console.log(selectedNotes)

		if (!Array.isArray(selectedNotes) || !selectedNotes.length)
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'No selected Notes provided!'
			);

		if (isEmpty(...selectedNotes))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Empty Note Id(s) provided!'
			);

		if (!isValidObjectId(...selectedNotes))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Invalid Note Id(s) provided!'
			);

		const ok = await Note.deleteMany({ _id: { $in: selectedNotes } });

		if (!ok)
			return sendErrorResponse(
				res,
				httpCode.internalServerError,
				null,
				'Some error occurred!'
			);

		return sendSuccessResponse(
			res,
			httpCode.successful,
			selectedNotes,
			'All notes deleted successfully!'
		);
	} catch (error) {
		console.error('Error in BatchDeleteNote Controller', error.message);

		return sendErrorResponse(
			res,
			httpCode.badRequest,
			'Internal Server Error!'
		);
	}
};
