import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import { ChevronRight, ChevronLeft, Pencil, Trash2 } from 'lucide-react';
import ImageForm from '@/Components/ImageForm';

export default function ImageCard({ previousPostId, nextPostId, currentPost }) {
	const router = useRouter();
	const { title, description, url, _id: id } = currentPost;
	const { mutate } = useSWR(`/api/images/${id}`);

	const [editMode, setEditMode] = useState(false);
	const [updateError, setUpdateError] = useState('');

	async function handleDelete() {
		const response = await fetch(`/api/images/${id}`, { method: 'DELETE' });
		if (!response.ok) return;
		router.push('/');
	}

	async function handleUpdate(data, imageFormData) {
		try {
			let imageUrl = null;

			// Step 1: upload new image to Cloudinary if one was selected
			if (imageFormData) {
				const uploadResponse = await fetch('/api/upload', {
					method: 'POST',
					body: imageFormData,
				});
				const uploadData = await uploadResponse.json();

				if (!uploadResponse.ok) {
					setUpdateError(
						uploadData.message || 'Image upload failed.',
					);
					return;
				}
				imageUrl = uploadData.imageUrl;
			}

			// Step 2: send updated fields to the API
			const body = {
				title: data.data?.title ?? data.title,
				description: data.data?.description ?? data.description,
				...(imageUrl && { image: imageUrl }),
			};

			const response = await fetch(`/api/images/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				const err = await response.json();
				setUpdateError(err.message || 'Update failed.');
				return;
			}

			mutate();
			setEditMode(false);
		} catch (error) {
			setUpdateError(error.message || 'An unexpected error occurred.');
		}
	}

	const editForm = (
		<div>
			<ImageForm
				onSubmit={handleUpdate}
				error={updateError}
				setError={setUpdateError}
				initValue={currentPost}
			/>
			<button
				onClick={() => setEditMode(false)}
				className='w-full mt-2 border border-red-500 text-red-500 bg-transparent rounded-md py-1.5 hover:bg-red-500 hover:text-white transition-colors duration-200'>
				Cancel
			</button>
		</div>
	);

	const infoDisplay = (collapsed) => (
		<div>
			<h1
				className={`text-primary font-medium mb-2 ${collapsed ? 'text-xl' : 'text-2xl'}`}>
				{title}
			</h1>
			<p className='text-primary/70 text-sm leading-relaxed'>
				{description}
			</p>
		</div>
	);

	return (
		<>
			<div className='grid grid-cols-[40px_1fr_40px] md:grid-cols-[40px_1fr_1fr_40px] gap-4 items-center'>
				<Link
					href={`/${previousPostId}`}
					className='flex items-center justify-center h-full rounded-md text-primary hover:text-secondary transition-colors duration-200'>
					<ChevronLeft size={32} />
				</Link>

				<div className='relative w-full h-64 md:h-80'>
					<Image
						src={url}
						fill
						alt={title}
						className='object-cover rounded-xl'
					/>
				</div>

				<div className='hidden md:block'>
					{editMode ? editForm : infoDisplay(false)}
				</div>

				<Link
					href={`/${nextPostId}`}
					className='flex items-center justify-center h-full rounded-md text-primary hover:text-secondary transition-colors duration-200'>
					<ChevronRight size={32} />
				</Link>
			</div>

			<div className='md:hidden mt-4'>
				{editMode ? editForm : infoDisplay(true)}
			</div>

			<div className='flex justify-center md:justify-end gap-3 mt-4'>
				<button
					onClick={() => setEditMode(!editMode)}
					className='border border-primary/30 text-primary rounded-md p-2 hover:border-primary transition-colors duration-200 bg-transparent cursor-pointer'>
					<Pencil size={18} />
				</button>
				<button
					disabled={editMode}
					onClick={handleDelete}
					className='border border-primary/30 text-primary rounded-md p-2 hover:border-red-500 hover:text-red-500 transition-colors duration-200 bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'>
					<Trash2 size={18} />
				</button>
			</div>
		</>
	);
}
