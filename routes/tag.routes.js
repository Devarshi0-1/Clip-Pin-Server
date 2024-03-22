import express from 'express'
import {
    addTagToNote,
    createTag,
    deleteTag,
    editTag,
    getMyTags,
    removeTagToNote,
} from '../controllers/tag.controllers.js'
import { protectRoute } from '../middlewares/protectRoute.middleware.js'

const router = express.Router()

router.get('/my', protectRoute, getMyTags)

router.post('/new', protectRoute, createTag)

router
    .route('/:noteId/:tagId')
    .post(protectRoute, addTagToNote)
    .delete(protectRoute, removeTagToNote)

router.route('/:id').put(protectRoute, editTag).delete(protectRoute, deleteTag)

export default router
