import dbConnect from '@/db/connect';
import Post from '@/db/models/Post';

export default async function handler(req, res) {
	const { id } = req.query;

	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST']);
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { author, text } = req.body;

	if (!author || !text) {
		return res.status(400).json({ error: 'Author and text are required' });
	}

	try {
		await dbConnect();

		const post = await Post.findByIdAndUpdate(
			id,
			{ $push: { comments: { author, text } } },
			{ new: true },
		);

		if (!post) {
			return res.status(404).json({ error: 'Post not found' });
		}

		return res.status(201).json(post.comments[post.comments.length - 1]);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
