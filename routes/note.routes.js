import { Router } from 'express'
import { createNote, deleteNote, editNote, getMyNotes } from '../controllers/note.controllers.js'
import { protectRoute } from '../middlewares/protectRoute.middleware.js'

const router = Router()

router.get('/my', protectRoute, getMyNotes)

router.post('/new', protectRoute, createNote)

router.route('/:id').put(protectRoute, editNote).delete(protectRoute, deleteNote)

export default router
