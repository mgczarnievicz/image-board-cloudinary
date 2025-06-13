// db/models/Joke.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema(
	{
		title: { type: String, required: true },
		url: { type: String, required: true },
		description: { type: String, required: true },
	},
	{ timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
