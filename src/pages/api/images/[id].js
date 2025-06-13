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
		return res
			.status(400)
			.json({ error: 'Error no Id', message: 'Post ID is required' });
	}

	if (!['GET', 'DELETE'].includes(req.method)) {
		res.setHeader('Allow', ['GET', 'POST']);
		return res.status(405).json({
			error: 'Method Error',
			message: `Method ${req.method} Not Allowed`,
		});
	}

	try {
		await dbConnect();
	} catch (error) {
		console.error('Data Base:', error);
		return res
			.status(500)
			.json({ error: 'Error Connect DB', message: error.message });
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
				let nextPost = await Post.findOne({
					createdAt: { $gt: currentPost.createdAt },
				})
					.sort({ createdAt: 1 }) // Sort ascending to get the very next one
					.select('_id');

				// 3. Find the previous post
				let previousPost = await Post.findOne({
					createdAt: { $lt: currentPost.createdAt },
				})
					.sort({ createdAt: -1 }) // Sort descending to get the very previous one
					.select('_id');

				// Edge-cases  for circular navigation
				if (!previousPost) {
					console.log(
						'Edge Case: No previous, fallback to most recent post'
					);
					previousPost = await Post.findOne()
						.sort({ createdAt: -1 })
						.select('_id');
				}

				if (!nextPost) {
					console.log('Edge Case: No next, fallback to oldest post');
					nextPost = await Post.findOne()
						.sort({ createdAt: 1 })
						.select('_id');
				}

				return res.status(200).json({
					currentPost,
					nextPostId: nextPost ? nextPost._id : null,
					previousPostId: previousPost ? previousPost._id : null,
				});
			} catch (error) {
				console.error('Error fetching post and its neighbors:', error);

				return res.status(500).json({
					error: 'Error Read DB',
					message: error.message,
				});
			}

		case 'POST':
			return res.status(200).json({
				error: 'Method Error',
				message: 'POST request Not Allowed',
			});
		case 'PUT':
			return res.status(200).json({
				error: 'Method Error',
				message: 'PUT request Not Allowed',
			});
		case 'DELETE':
			return res.status(200).json({
				error: 'Method Error',
				message: 'DELETE request Not Allowed',
			});
		default:
			return res.status(405).json({
				error: 'Method Error',
				message: 'Method not allowed Not Allowed',
			});
	}
}
