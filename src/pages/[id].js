import {
	ChevronRight,
	ChevronLeft,
	Pencil,
	Trash2,
	ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useSWR from 'swr';

import Link from 'next/link';
import ImageCard from '@/Components/ImageCard';

import '../styles/DetailPage.css';
import ImageForm from '@/Components/ImageForm/ImageForm';

export default function DetailPage() {
	const router = useRouter();
	const { isReady } = router;
	const { id } = router.query;

	const { data, error, isLoading } = useSWR(`/api/images/${id}`);

	if (error || data?.error) return <div>Failed to load</div>;
	if (!isReady || isLoading) return <h2>Loading...</h2>;

	const { currentPost, nextPostId, previousPostId } = data;

	function handleBackButton() {
		router.push('/');
	}

	return (
		<main>
			<button
				className='action-button back-button'
				onClick={handleBackButton}>
				<ArrowLeft />
				Back
			</button>
			<ImageCard
				previousPostId={previousPostId}
				nextPostId={nextPostId}
				currentPost={currentPost}
			/>
			<section>
				<h1>Comments</h1>
			</section>
		</main>
	);
}
