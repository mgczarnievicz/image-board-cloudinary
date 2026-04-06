import { useState } from 'react';
import Image from 'next/image';

export default function ImageForm({ onSubmit, error, setError, initValue }) {
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const MAX_UPLOAD_SIZE_MB = 2;

	function handleImageChange(e) {
		setError('');
		setImageFile(null);
		setImagePreview(null);

		const file = e.target.files[0];
		if (!file) return;

		if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
			setError('Please select only JPG, PNG or WEBP images.');
			e.target.value = '';
			return;
		}

		if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
			setError(`File too large. Max size is ${MAX_UPLOAD_SIZE_MB} MB.`);
			e.target.value = '';
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => setImagePreview(reader.result);
		reader.onerror = () => {
			setError('Failed to preview image.');
			e.target.value = '';
		};

		setImageFile(file);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		let imageFormData;

		if (!imageFile && !initValue) {
			setError('Please select an image file to upload.');
			return;
		}

		if (initValue && !imageFile) {
			imageFormData = false;
		} else {
			imageFormData = new FormData();
			imageFormData.append('image', imageFile);
		}

		const formData = new FormData(event.target);
		let data = Object.fromEntries(formData);

		if (initValue) {
			data = { data, ...initValue };
		}

		onSubmit(data, imageFormData);
	}

	return (
		<form onSubmit={handleSubmit} className='flex flex-col gap-4 p-3'>
			<div className='flex flex-col gap-1'>
				<label htmlFor='title' className='text-primary/70 text-sm'>
					Title
				</label>
				<input
					type='text'
					name='title'
					id='title'
					defaultValue={initValue?.title}
					className='bg-transparent border border-primary/30 rounded-md px-3 py-2 text-primary placeholder:text-primary/40 focus:outline-none focus:border-primary transition-colors duration-200'
				/>
			</div>

			<div className='flex flex-col gap-1'>
				<label
					htmlFor='description'
					className='text-primary/70 text-sm'>
					Description
				</label>
				<textarea
					name='description'
					id='description'
					defaultValue={initValue?.description}
					rows={3}
					className='bg-transparent border border-primary/30 rounded-md px-3 py-2 text-primary placeholder:text-primary/40 focus:outline-none focus:border-primary transition-colors duration-200 resize-none'
				/>
			</div>

			<div className='flex flex-col gap-1'>
				<label className='text-primary/70 text-sm'>
					{initValue ? 'Update image' : 'Add image'}
				</label>
				<input
					type='file'
					name='image'
					accept='.jpg,.jpeg,.png,.webp'
					onChange={handleImageChange}
					className='text-sm text-primary/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-primary/30 file:bg-transparent file:text-primary/70 file:text-sm file:cursor-pointer hover:file:border-primary hover:file:text-primary file:transition-colors file:duration-200'
				/>
			</div>

			{error && <p className='text-red-400 text-sm'>{error}</p>}

			{imagePreview && (
				<div className='relative w-24 h-24 rounded-md overflow-hidden border border-primary/30'>
					<Image
						src={imagePreview}
						alt='Preview'
						fill
						className='object-cover'
					/>
				</div>
			)}

			<button
				type='submit'
				className='self-end bg-primary-dark text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors duration-200 cursor-pointer'>
				{initValue ? 'Update' : 'Add'}
			</button>
		</form>
	);
}
