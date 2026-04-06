import { useState } from 'react';
import useSWR from 'swr';
import { X } from 'lucide-react';

import ImageForm from '@/Components/ImageForm';

export default function AddImage({ onCloseAdd }) {
	const [error, setError] = useState('');
	const { mutate } = useSWR('/api/images');

	function handleModalClick(e) {
		e.stopPropagation();
		onCloseAdd();
	}

	async function handleAddImage(newData, newImage) {
		try {
			const responseImage = await fetch('/api/upload', {
				method: 'POST',
				body: newImage,
			});
			const dataImage = await responseImage.json();

			if (!responseImage.ok) {
				setError(dataImage.message || 'Image upload failed.');
				return;
			}

			const { imageUrl } = dataImage;
			const finalData = { ...newData, image: imageUrl };

			const response = await fetch('/api/images', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(finalData),
			});

			const responseData = await response.json();

			if (!response.ok) {
				setError(responseData.message || 'Failed to save data.');
				return;
			}

			mutate();
			onCloseAdd();
		} catch (error) {
			setError(
				error.message || 'An unexpected error occurred during upload.',
			);
		}
	}

	return (
		<>
			<div
				className='fixed inset-0 bg-black/50 z-10'
				onClick={handleModalClick}
			/>
			<section className='fixed z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90dvw] md:w-[480px] bg-background border border-primary/20 rounded-xl flex flex-col'>
				<div className='flex justify-end px-3 pt-3'>
					<button
						onClick={onCloseAdd}
						className='text-primary/50 hover:text-primary transition-colors duration-200 bg-transparent border-none cursor-pointer'>
						<X size={20} />
					</button>
				</div>
				<ImageForm
					onSubmit={handleAddImage}
					error={error}
					setError={setError}
				/>
			</section>
		</>
	);
}
