import React from 'react';
import useSWR from 'swr';
import { useState } from 'react';
import { X } from 'lucide-react';

import ImageForm from '../ImageForm/ImageForm';

import './AddImage.css';

export default function AddImage({ onCloseAdd }) {
	const [error, setError] = useState('');

	const { mutate } = useSWR('/api/images');

	function handleModalClick(e) {
		e.stopPropagation();
		onCloseAdd();
	}

	async function handleAddImage(newData, newImage) {
		try {
			// Step 1: Upload Image
			const responseImage = await fetch('/api/upload', {
				method: 'POST',
				body: newImage, // Pass the FormData object here
			});
			const dataImage = await responseImage.json();

			if (!responseImage.ok) {
				console.error('Error uploading image:', dataImage.message);
				setError(dataImage.message || 'Image upload failed.'); // Display backend error to user
				return; // Stop execution if image upload fails
			}
			const { imageUrl } = dataImage; // Destructure imageUrl from the response
			console.log('Image uploaded successfully:', imageUrl);

			// Step 2: Append the received imageUrl to your form data
			const finalData = { ...newData, image: imageUrl }; // Changed 'file' to 'image' for clarity and consistency

			// Step 3: Send the final data (title, description, imageUrl) to your /api/images route
			const response = await fetch('/api/images', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(finalData),
			});

			const responseData = await response.json();

			if (!response.ok) {
				console.error('Error saving image data:', responseData.message);
				setError((prev) => ({
					...prev,
					form: responseData.message || 'Failed to save data.',
				}));
				return;
			}

			console.log('Final data saved:', responseData);
			// Handle success (e.g., clear form, show success message, redirect)
			mutate();
			onCloseAdd();
		} catch (error) {
			console.error('An unexpected error occurred:', error);
			setError(
				error.message || 'An unexpected error occurred during upload.'
			);
		}
	}

	return (
		<>
			<div className='modal-back' onClick={handleModalClick}></div>
			<section className='form-section'>
				<X className='from-close' onClick={onCloseAdd} />
				<ImageForm
					onAddImage={handleAddImage}
					error={error}
					setError={setError}
				/>
			</section>
		</>
	);
}
