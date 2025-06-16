import Image from 'next/image';
import React, { useState } from 'react';

import {
	ChevronRight,
	ChevronLeft,
	Pencil,
	Trash2,
	ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import Link from 'next/link';

import ImageForm from '@/Components/ImageForm/ImageForm';

import './ImageCard.css';

export default function ImageCard({ previousPostId, nextPostId, currentPost }) {
	const router = useRouter();

	const { title, description, url, _id: id } = currentPost;

	const { mutate } = useSWR(`/api/images/${id}`);

	const [editMode, setEditMode] = useState(false);
	const [updateError, setUpdateError] = useState('');

	async function handleDelete() {
		const response = await fetch(`/api/images/${id}`, { method: 'DELETE' });

		if (!response.ok) {
			console.log(response.status);
			return;
		}

		router.push('/');
	}

	async function handleUpdate(){

	}

	return (
		<>
			<section className='card-section'>
				<Link href={`/${previousPostId}`} className='navigation-button'>
					<ChevronLeft size={32} absoluteStrokeWidth={true} />
				</Link>

				<Image src={url} width={250} height={250} alt={title} />

				<div className='info-section'>
					{!editMode && (
						<>
							<h1>{title}</h1>
							<p>{description}</p>
						</>
					)}
					{editMode && (
						<ImageForm
							error={updateError}
							setError={setUpdateError}
							
						/>
					)}
				</div>
				<Link href={`/${nextPostId}`} className='navigation-button'>
					<ChevronRight size={32} absoluteStrokeWidth={true} />
				</Link>
			</section>
			<section className='section-action-buttons'>
				<button
					className='action-button'
					onClick={() => setEditMode(!editMode)}>
					<Pencil />
				</button>
				<button
					disabled={editMode}
					className='action-button'
					onClick={handleDelete}>
					<Trash2 />
				</button>
			</section>
		</>
	);
}
