import { Schema, model } from 'mongoose'

const noteSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            default: null,
        },
        tags: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Tag',
                default: [],
            },
        ],
        content: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
)

const Note = model('Note', noteSchema)

export default Note
