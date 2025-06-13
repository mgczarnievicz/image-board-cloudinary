// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { data } from '@/lib/data';
import dbConnect from '@/db/connect';
import Post from '@/db/models/Post';

const CLOUDINARY_URL = process.env.CLOUDINARY_UR;

export default async function handler(req, res) {
	console.log(
		'------------------------------------------------------------------'
	);
	console.log('\t URL: ', req.url);
	console.log('\t Method: ', req.method);
	console.log(
		'------------------------------------------------------------------'
	);

	if (!['GET', 'POST'].includes(req.method)) {
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
				const posts = await Post.find().sort({ createdAt: 1 });
				return res.status(200).json(posts);
			} catch (error) {
				console.error('Data Base:', error);
				return res.status(500).json({
					error: 'Error Read DB',
					message: error.message,
				});
			}
		case 'POST':
			console.log('req.body: ', req.body);
			const { title, description, image } = req.body;

			try {
				await Post.create({ title, description, url: image });
				return res.status(200).json({ message: 'POST request' });
			} catch (error) {
				console.error('Data Base:', error);
				return res.status(500).json({
					error: 'Error Create DB',
					message: error.message,
				});
			}

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
