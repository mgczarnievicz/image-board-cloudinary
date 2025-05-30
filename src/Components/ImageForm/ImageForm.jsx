import React from 'react';
import { useState } from 'react';
import Image from 'next/image';

import './ImageForm.css';
import localFont from 'next/font/local';

export default function ImageForm() {
	// Assume these state variables are defined in your component:
	const [imageFile, setImageFile] = useState(null);
	const [imageSrc, setImageSrc] = useState([]); // Use an array for multiple previews
	const [imageError, setImageError] = useState('');
	const [errors, setErrors] = useState({}); // For form-level errors
	const MAX_UPLOAD_SIZE_MB = 2; // Example: set this to your desired client-side max size

	function handleImageChange(e) {
		// Clear previous errors and previews
		setImageError('');
		setImageSrc([]); // Clear all previous image previews
		setImageFile(null); // Clear any previously selected file for single file input
		setErrors((prev) => ({ ...prev, image: undefined }));

		// Get the selected files from the input
		const files = e.target.files;

		// --- Validation Logic ---
		if (!files || files.length === 0) {
			// No files selected, or user cleared the input
			return;
		}

		const validFiles = [];
		const newImageSrcs = [];

		for (const file of files) {
			// 1. Validate File Type
			if (
				!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
			) {
				setImageError('Please select only JPG, PNG or WEBP images.');
				// Clear the input value to prevent re-uploading invalid files
				e.target.value = '';
				return; // Stop processing if any file is invalid type
			}

			// 2. Validate File Size
			if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
				setImageError(
					`File too large. Max size is ${MAX_UPLOAD_SIZE_MB} MB.`
				);
				// Clear the input value to prevent re-uploading invalid files
				e.target.value = '';
				return; // Stop processing if any file is too large
			}

			// If validation passes, add to validFiles for later processing
			validFiles.push(file);

			// --- Preview Logic (from handleFile) ---
			const reader = new FileReader();
			reader.readAsDataURL(file); // Read the file as a Data URL
			reader.onload = () => {
				newImageSrcs.push(reader.result);
				// Only update the state once all files are processed to avoid multiple re-renders
				if (newImageSrcs.length === validFiles.length) {
					setImageSrc(newImageSrcs);
				}
			};
			reader.onerror = () => {
				console.error('FileReader error:', reader.error);
				setImageError('Failed to read file for preview.');
				// Optionally, clear the input if preview fails
				e.target.value = '';
			};
		}

		// --- Store Validated File(s) for Upload ---
		// If you only expect a single file, you might do:
		if (validFiles.length > 0) {
			setImageFile(validFiles[0]); // Store the first valid file
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();

		// 1. Validate that an image file is actually selected before attempting upload
		if (!imageFile) {
			setImageError('Please select an image file to upload.');
			return;
		}

		// Create a FormData object for the image upload
		const imageFormData = new FormData();
		imageFormData.append('image', imageFile);

		try {
			const responseImage = await fetch('/api/upload', {
				method: 'POST',
				body: imageFormData, // Pass the FormData object here
			});
			const dataImage = await responseImage.json();

			if (!responseImage.ok) {
				console.error('Error uploading image:', dataImage.message);
				setImageError(dataImage.message || 'Image upload failed.'); // Display backend error to user
				return; // Stop execution if image upload fails
			}
			const { imageUrl } = dataImage; // Destructure imageUrl from the response
			console.log('Image uploaded successfully:', imageUrl);

			// Step 2: Prepare data for your /api/images route (title, description, and the new image URL)
			const formData = new FormData(event.target); // Get all form fields
			const data = Object.fromEntries(formData); // Convert FormData to a plain object

			// Append the received imageUrl to your form data
			const finalData = { ...data, image: imageUrl }; // Changed 'file' to 'image' for clarity and consistency

			// Step 3: Send the final data (title, description, imageUrl) to your /api/images route
			const response = await fetch('/api/images', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(finalData),
			});

			const responseData = await response.json();

			if (!response.ok) {
				console.error('Error saving image data:', responseData.message);
				setErrors((prev) => ({
					...prev,
					form: responseData.message || 'Failed to save data.',
				}));
				return;
			}

			console.log('Final data saved:', responseData);
			// Handle success (e.g., clear form, show success message, redirect)
		} catch (error) {
			console.error('An unexpected error occurred:', error);
			setImageError(
				error.message || 'An unexpected error occurred during upload.'
			);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor='title'>Title</label>
			<input type='text' name='title' id='title' />

			<label htmlFor='description'>Description</label>
			<textarea name='description' id='description'></textarea>

			<label>Select your file</label>
			<input
				type='file'
				name='image'
				accept='.jpg,.jpeg,.png,.webp'
				onChange={handleImageChange}
			/>
			{imageError && <p style={{ color: 'red' }}>{imageError}</p>}

			<button type='submit'>Add</button>

			{imageSrc.length > 0 && (
				<div
					style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
					{imageSrc.map((src, index) => (
						<Image
							key={index}
							src={src}
							alt={`Preview ${index + 1}`}
							width={100} // Add width and height for Next.js Image component
							height={100}
							style={{
								maxWidth: '100px',
								maxHeight: '100px',
								border: '1px solid #ccc',
							}}
						/>
					))}
				</div>
			)}
		</form>
	);
}
