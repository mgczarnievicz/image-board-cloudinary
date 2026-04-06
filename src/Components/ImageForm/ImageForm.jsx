import React from 'react';
import { useState } from 'react';
import Image from 'next/image';

import './ImageForm.css';
import localFont from 'next/font/local';

export default function ImageForm({ onAddImage, error, setError, initValue }) {
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const MAX_UPLOAD_SIZE_MB = 2; // Example: set this to your desired client-side max size

	function handleImageChange(e) {
		// Clear previous errors and previews
		setError('');
		setImageFile(null);
		setImagePreview(null);

		// Get the selected files from the input
		const file = e.target.files[0];

		// No files selected, or user cleared the input
		if (!file) {
			return;
		}

		// 1. Validate File Type
		if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
			setError('Please select only JPG, PNG or WEBP images.');
			// Clear the input value to prevent re-uploading invalid files
			e.target.value = '';
			return;
		}

		// 2. Validate File Size
		if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
			setError(`File too large. Max size is ${MAX_UPLOAD_SIZE_MB} MB.`);
			// Clear the input value to prevent re-uploading invalid files
			e.target.value = '';
			return;
		}

		// --- Preview Logic (from handleFile) ---
		const reader = new FileReader();
		reader.readAsDataURL(file); // Read the file as a Data URL
		reader.onload = () => setImagePreview(reader.result);
		reader.onerror = () => {
			console.error('FileReader error:', reader.error);
			setError('Failed to preview image.');
			e.target.value = '';
		};

		setImageFile(file);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		let imageFormData;

		// 1. Validate that an image file is actually selected before attempting upload
		if (!imageFile && !initValue) {
			setError('Please select an image file to upload.');
			return;
		}

		// 2. Create a FormData object for the image upload
		if (initValue && !imageFile) {
			// There is no new image to send
			imageFormData = false;
		} else {
			imageFormData = new FormData();
			imageFormData.append('image', imageFile);
		}

		// 3. Grab Data from the Form fields
		const formData = new FormData(event.target);
		let data = Object.fromEntries(formData);

		if (initValue) {
			data = { data, ...initValue };
		}

		onAddImage(data, imageFormData);
	}

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor='title'>Title</label>
			<input
				type='text'
				name='title'
				id='title'
				defaultValue={initValue && initValue.title}
			/>

			<label htmlFor='description'>Description</label>
			<textarea
				name='description'
				id='description'
				defaultValue={initValue && initValue.description}></textarea>

			<label>{initValue ? 'Update image' : 'Add image'}</label>
			<input
				type='file'
				name='image'
				accept='.jpg,.jpeg,.png,.webp'
				onChange={handleImageChange}
			/>
			{error && <p style={{ color: 'red' }}>{error}</p>}

			<button type='submit'>{initValue ? 'Update' : 'Add'}</button>

			{imagePreview && (
				<div
					style={{
						display: 'flex',
						gap: '10px',
						marginTop: '10px',
					}}>
					<Image
						src={imagePreview}
						alt={`Preview`}
						width={100}
						height={100}
						style={{
							maxWidth: '100px',
							maxHeight: '100px',
							border: '1px solid #ccc',
						}}
					/>
				</div>
			)}
		</form>
	);
}
