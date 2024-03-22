import { isValidObjectId } from 'mongoose';
import Note from '../models/note.model.js';
import Tag from '../models/tag.model.js';
import { httpCode } from '../utils/httpCodes.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import { isEmpty } from '../utils/userValidation.js';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *  @returns {import('express').Response}
 */

export const getMyTags = async (req, res) => {
	try {
		const tags = await Tag.find({ owner: req.user._id });

		return sendSuccessResponse(
			res,
			httpCode.successful,
			tags,
			'Tags Fetched Successfully!'
		);
	} catch (error) {
		console.error('Error in GetMyTags Controller', error.message);
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

export const createTag = async (req, res) => {
	try {
		const { name } = req.body;

		if (isEmpty(name))
			return sendErrorResponse(
				res,
				httpCode.notAuthorized,
				'Required Fields Empty!'
			);

		const tag = await Tag.create({
			owner: req.user._id,
			name,
		});

		return sendSuccessResponse(
			res,
			httpCode.resourceCreated,
			tag,
			'Tag Created Successfully!'
		);
	} catch (error) {
		console.error('Error in CreateTag Controller', error.message);
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

export const editTag = async (req, res) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		if (isEmpty(name, id))
			return sendErrorResponse(
				res,
				httpCode.notAuthorized,
				'Required Fields Empty!'
			);

		if (!isValidObjectId(id))
			return sendErrorResponse(res, httpCode.badRequest, 'Invalid Id!');

		const tag = await Tag.findByIdAndUpdate(
			id,
			{ $set: { name } },
			{ new: true }
		);

		if (!tag)
			return sendErrorResponse(res, httpCode.resourceNotFound, 'No Tag Found!');

		return sendSuccessResponse(
			res,
			httpCode.successful,
			tag,
			'Updated Tag Successfully!'
		);
	} catch (error) {
		console.error('Error in EditTag Controller', error.message);
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

export const deleteTag = async (req, res) => {
	try {
		const { id } = req.params;

		if (isEmpty(id))
			return sendErrorResponse(res, httpCode.notAuthorized, 'No ID provided!');

		if (!isValidObjectId(id))
			return sendErrorResponse(res, httpCode.badRequest, 'Invalid Id!');

		const tag = await Tag.findByIdAndDelete(id);

		if (!tag)
			return sendErrorResponse(
				res,
				httpCode.resourceNotFound,
				'Tag Not Found!'
			);

		return sendSuccessResponse(
			res,
			httpCode.successful,
			null,
			'Tag Deleted Successfully!'
		);
	} catch (error) {
		console.error('Error in DeleteTag Controller', error.message);
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

export const addTagToNote = async (req, res) => {
	try {
		const { noteId, tagId } = req.params;

		if (isEmpty(noteId, tagId))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'No Note Id or Tag Id provided!'
			);

		if (!isValidObjectId(noteId) || !isValidObjectId(tagId))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Invalid Note or Tag Id!'
			);

		const note = await Note.findById(noteId);

		if (!note)
			return sendErrorResponse(
				res,
				httpCode.resourceNotFound,
				'No Note found!'
			);

		if (note.tags.includes(tagId))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Tag already Added To the Note!'
			);

		const tag = await Tag.findById(tagId);

		if (!tag)
			return sendErrorResponse(res, httpCode.resourceNotFound, 'No Tag found!');

		note.tags.push(tag);
		await note.save();

		return sendSuccessResponse(
			res,
			httpCode.successful,
			tag,
			'Tag added successfully!'
		);
	} catch (error) {
		console.error('Error in AddTagToNote Controller', error.message);
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

export const removeTagToNote = async (req, res) => {
	try {
		const { noteId, tagId } = req.params;

		if (isEmpty(noteId, tagId))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'No Note Id or Tag Id provided!'
			);

		if (!isValidObjectId(noteId) || !isValidObjectId(tagId))
			return sendErrorResponse(
				res,
				httpCode.badRequest,
				'Invalid Note or Tag Id!'
			);

		const note = await Note.findById(noteId);

		if (!note)
			return sendErrorResponse(
				res,
				httpCode.resourceNotFound,
				'No Note found!'
			);

		const tagIndex = note.tags.indexOf(tagId);

		if (tagIndex < 0)
			return sendErrorResponse(
				res,
				httpCode.resourceNotFound,
				'Tag is not associated with the Note!'
			);

		note.tags.splice(tagIndex, 1);

		await note.save();

		return sendSuccessResponse(
			res,
			httpCode.successful,
			null,
			'Tag Removed From Note Successfully!'
		);
	} catch (error) {
		console.error('Error in AddTagToNote Controller', error.message);
		return sendErrorResponse(
			res,
			httpCode.badRequest,
			'Internal Server Error!'
		);
	}
};
