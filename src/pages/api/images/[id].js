// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { data } from '@/lib/data';
import dbConnect from '@/db/connect';
import Post from '@/db/models/Post';

export default async function handler(req, res) {
	const { id } = req.query;

	console.log(
		'------------------------------------------------------------------'
	);
	console.log('\t URL: ', req.url);
	console.log('\t Method: ', req.method);
	console.log('\t Id: ', id);

	console.log(
		'------------------------------------------------------------------'
	);

	if (!id) {
		return res.status(400).json({ message: 'Post ID is required' });
	}

	if (!['GET', 'DELETE'].includes(req.method)) {
		res.setHeader('Allow', ['GET', 'POST']);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}

	try {
		await dbConnect();
	} catch (error) {
		console.error('Data Base:', error);
		return res.status(500).json({ error: error.message });
	}

	switch (req.method) {
		case 'GET':
			try {
				// 1. Get the current post
				const currentPost = await Post.findById(id);

				if (!currentPost) {
					return res.status(404).json({ message: 'Post not found' });
				}

				// 2. Find the next post
				const nextPost = await Post.findOne({
					_id: { $gt: currentPost._id },
				})
					.sort({ _id: 1 }) // Sort ascending to get the very next one
					.select('_id')
					.limit(1);

				// 3. Find the previous post
				const previousPost = await Post.findOne({
					_id: { $lt: currentPost._id },
				})
					.sort({ _id: -1 }) // Sort descending to get the very previous one
					.select('_id')
					.limit(1);

				return res.status(200).json({
					currentPost,
					nextPostId: nextPost ? nextPost._id : null,
					previousPostId: previousPost ? previousPost._id : null,
				});
			} catch (error) {
				console.error('Error fetching post and its neighbors:', error);
				return res
					.status(500)
					.json({ message: 'Internal server error' });
			}

		case 'POST':
			return res.status(200).json({ message: 'POST request' });
		case 'PUT':
			return res.status(200).json({ message: 'PUT request' });
		case 'DELETE':
			return res.status(200).json({ message: 'DELETE request' });
		default:
			return res.status(405).json({ message: 'Method not allowed' });
	}
}
