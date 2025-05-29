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
			const posts = await Post.find();
			return res.status(200).json(posts);
		case 'POST':
			console.log('req.body: ', req.body);
			const { title, description, file } = req.body;
			console.log('title: ', title);
			console.log('description: ', description);
			console.log('file: ', file);

			return res.status(200).json({ message: 'POST request' });
		case 'PUT':
			return res.status(200).json({ message: 'PUT request' });
		case 'DELETE':
			return res.status(200).json({ message: 'DELETE request' });
		default:
			return res.status(405).json({ message: 'Method not allowed' });
	}
}
