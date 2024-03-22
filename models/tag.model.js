import { Schema, model } from 'mongoose';

const tagSchema = new Schema(
	{
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		name: {
			type: String,
			default: null,
			required: true,
		},
	},
	{ timestamps: true }
);

const Tag = model('Tag', tagSchema);

export default Tag;
