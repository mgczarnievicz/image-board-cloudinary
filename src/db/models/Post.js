import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema(
	{
		author: { type: String, required: true },
		text: { type: String, required: true },
	},
	{ timestamps: true },
);

const postSchema = new Schema(
	{
		title: { type: String, required: true },
		url: { type: String, required: true },
		description: { type: String, required: true },
		comments: { type: [commentSchema], default: [] },
	},
	{ timestamps: true },
);

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
