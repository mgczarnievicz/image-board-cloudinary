import dbConnect from '@/db/connect';
import Post from '@/db/models/Post';
import { deleteImage, uploadImage } from '@/utils/cloudinaryUtils';

export default async function handler(req, res) {
	const { id } = req.query;

	if (!id) {
		return res
			.status(400)
			.json({ error: 'Error no Id', message: 'Post ID is required' });
	}

	if (!['GET', 'DELETE', 'PUT'].includes(req.method)) {
		res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
		return res.status(405).json({
			error: 'Method Error',
			message: `Method ${req.method} Not Allowed`,
		});
	}

	try {
		await dbConnect();
	} catch (error) {
		return res
			.status(500)
			.json({ error: 'Error Connect DB', message: error.message });
	}

	switch (req.method) {
		case 'GET':
			try {
				const currentPost = await Post.findById(id);
				if (!currentPost)
					return res.status(404).json({ message: 'Post not found' });

				let nextPost = await Post.findOne({
					createdAt: { $gt: currentPost.createdAt },
				})
					.sort({ createdAt: 1 })
					.select('_id');

				let previousPost = await Post.findOne({
					createdAt: { $lt: currentPost.createdAt },
				})
					.sort({ createdAt: -1 })
					.select('_id');

				if (!previousPost) {
					previousPost = await Post.findOne()
						.sort({ createdAt: -1 })
						.select('_id');
				}
				if (!nextPost) {
					nextPost = await Post.findOne()
						.sort({ createdAt: 1 })
						.select('_id');
				}

				return res.status(200).json({
					currentPost,
					nextPostId: nextPost?._id ?? null,
					previousPostId: previousPost?._id ?? null,
				});
			} catch (error) {
				return res
					.status(500)
					.json({ error: 'Error Read DB', message: error.message });
			}

		case 'PUT':
			try {
				const { title, description, image } = req.body;

				const updateData = { title, description };

				// If a new image URL was already uploaded and passed in, use it
				if (image) {
					const existingPost = await Post.findById(id);
					// Delete old image from Cloudinary if it exists
					if (existingPost?.url?.includes('cloudinary')) {
						await deleteImage(existingPost.url);
					}
					updateData.url = image;
				}

				const updatedPost = await Post.findByIdAndUpdate(
					id,
					{ $set: updateData },
					{ new: true, runValidators: true },
				);

				if (!updatedPost) {
					return res.status(404).json({ error: 'Post not found' });
				}

				return res.status(200).json(updatedPost);
			} catch (error) {
				return res
					.status(500)
					.json({ error: 'Error Update DB', message: error.message });
			}

		case 'DELETE':
			try {
				const deletedPost = await Post.findByIdAndDelete(id);
				if (!deletedPost) {
					return res.status(404).json({
						error: 'Error Deleting DB',
						message: 'Post Not Found',
					});
				}
				if (deletedPost.url?.includes('cloudinary')) {
					await deleteImage(deletedPost.url);
				}
				return res.status(200).json({ status: 'Okay' });
			} catch (error) {
				return res.status(500).json({
					error: 'Error DELETING DB',
					message: error.message,
				});
			}

		default:
			return res
				.status(405)
				.json({ error: 'Method Error', message: 'Method not allowed' });
	}
}
