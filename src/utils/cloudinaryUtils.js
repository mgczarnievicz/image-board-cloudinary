import cloudinary from '@/cloudinary';

function extractPublicIdFromUrl(url) {
	try {
		const parts = url.split('/');
		// Find index of "upload" segment
		const uploadIndex = parts.findIndex((p) => p === 'upload');
		if (uploadIndex < 0 || uploadIndex + 2 >= parts.length) {
			throw new Error('Unexpected Cloudinary URL format');
		}
		// The version part is next (e.g. v123456), so skip it
		const publicPathParts = parts.slice(uploadIndex + 2);
		// Join back and remove extension
		const fileWithExt = publicPathParts.join('/');
		const publicId = fileWithExt.replace(/\.[^.]+$/, '');
		return publicId; // e.g. "remedies/abcdef123"
	} catch (err) {
		console.error('Error extracting public_id from URL:', err);
		return null;
	}
}

export async function deleteImage(url) {
	const publicId = extractPublicIdFromUrl(url);

	if (!publicId) {
		console.warn('No public_id provided, skipping deletion.');
		return;
	}
	try {
		const result = await cloudinary.uploader.destroy(publicId);
		if (result.result !== 'ok' && result.result !== 'not_found') {
			console.error(`Unexpected result deleting ${publicId}:`, result);
		}
	} catch (err) {
		console.error(`Failed to delete Cloudinary asset ${publicId}:`, err);
	}
}
