import React from 'react';
import { useState } from 'react';

import './ImageForm.css';

export default function ImageForm() {
	const [imageSrc, setImageSrc] = useState([]);

	/* 
    handleOnChange handles only the file selection and preview generation. Its job is to create a temporary preview of the selected image so the user can see what they are about to upload.
    */
	function handleFile(event) {
		//    Multiple files can be selected at once, so we need to loop through each file and create a preview for each one.
		for (const file of e.target.files) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				setImageSrc((imgs) => [...imgs, reader.result]);
			};
			reader.onerror = () => {
				console.log(reader.error);
			};
		}
	}

	/* 
    handleOnSubmit is responsible for the actual upload process. It packages the selected file(s) and sends them to Cloudinary when the user decides to upload.
    */

	async function uploadImages() {
		const completeImageArray = [];
		const firstThreeImages = imageSrc.slice(0, 3);
		for (const element of firstThreeImages) {
			const formData = new FormData();

			formData.append('file', element);
			formData.append('upload_preset', 'ml_default');

			const response = await fetch(
				'https://api.cloudinary.com/v1_1/ds38ne4yp/image/upload',
				{
					method: 'POST',
					body: formData,
				}
			);

			const data = await response.json();
			console.log('cloudydata', data);

			completeImageArray.push(data.secure_url);
		}
		return completeImageArray;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

		const data = Object.fromEntries(formData);
		console.log('data', data);

		// const title = formData.get('title');
		// const description = formData.get('description');
		// const file = formData.get('file');
		// console.log('title', title);
		// console.log('description', description);
		// console.log('file', file);

		// title: ,
		// url: ,
		// description: ,

		const response = await fetch('/api/images', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		const responseData = await response.json();
		console.log('responseData', responseData);
	}
	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor='title'>Title</label>
			<input type='text' name='title' id='title' />

			<label htmlFor='description'>Description</label>
			<textarea name='description' id='description'></textarea>

			<label>Select your file</label>
			<input type='file' name='file' onChange={handleFile} />
			<button type='submit'>Add</button>
		</form>
	);
}
