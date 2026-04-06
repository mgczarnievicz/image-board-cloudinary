import formidable from 'formidable';
import cloudinary from '@/cloudinary';
import fs from 'fs';

export const config = {
	api: {
		bodyParser: false,
	},
};

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER;

const MAX_MB = parseInt(process.env.MAX_UPLOAD_SIZE_MB, 10) || 2;
const MAX_FILESIZE = MAX_MB * 1024 * 1024;

export default async function handler(request, response) {
	console.log(
		'------------------------------------------------------------------'
	);
	console.log('\t URL: ', request.url);
	console.log('\t Method: ', request.method);
	console.log(
		'------------------------------------------------------------------'
	);

	if (request.method !== 'POST') {
		return response.status(405).json({ message: 'Method Not Allowed' });
	}

	// we initialize formidable with maxFileSize
	const form = formidable({ maxFileSize: MAX_FILESIZE });

	console.log('form: ', form);

	// Wrap parse in a promise so Next.js waits until we send a response
	await new Promise((resolve) => {
		form.parse(request, async (err, fields, files) => {
			// File size too large
			if (err && err.code === 'LIMIT_FILE_SIZE') {
				response.status(413).json({
					message: `File too large. Max size is ${MAX_MB} MB.`,
				});
				return resolve();
			}

			if (err) {
				console.error('Form parse error:', err);
				response.status(500).json({ message: 'Upload failed' });
				return resolve();
			}

			//  refers to the first file in the array of files uploaded through the form input with the "name "attribute set to "image".
			let file = files.image;
			if (Array.isArray(file)) {
				file = file[0];
			}

			if (!file) {
				response.status(400).json({ message: 'No file provided' });
				return resolve();
			}

			const mimetype = file.mimetype || file.type || '';
			if (!mimetype.startsWith('image/')) {
				fs.unlink(file.filepath, () => {});
				response.status(415).json({
					message: 'Unsupported file type. Please upload an image.',
				});
				return resolve();
			}

			try {
				// now we have the information about the image, we can send it to Cloudinary
				const result = await cloudinary.uploader.upload(file.filepath, {
					upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
					folder: CLOUDINARY_FOLDER,
				});
				/*
                To upload a file, we call the upload method with the file's path. 
                Additionally, we can provide an optional configuration object:
                - 'public_id' allows us to specify a custom identifier for the uploaded file.
                - 'folder' lets us designate a specific folder within Cloudinary where the file should be stored.
                */
				response.status(200).json({ imageUrl: result.secure_url });
			} catch (uploadErr) {
				console.error('Cloudinary error:', uploadErr);
				response
					.status(500)
					.json({ message: 'Cloudinary upload failed' });
			} finally {
				fs.unlink(file.filepath, () => {});
				return resolve();
			}
		});
	});
}
