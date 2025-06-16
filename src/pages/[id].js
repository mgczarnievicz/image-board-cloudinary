import {
	ChevronRight,
	ChevronLeft,
	Pencil,
	Trash2,
	ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';

import Link from 'next/link';
import ImageCard from '@/Components/ImageCard/ImageCard';

import '../styles/DetailPage.css';

export default function DetailPage() {
	const router = useRouter();
	const { isReady } = router;
	const { id } = router.query;

	const { data, error, isLoading } = useSWR(`/api/images/${id}`);

	if (error || data?.error) return <div>Failed to load</div>;
	if (!isReady || isLoading) return <h2>Loading...</h2>;

	const { currentPost, nextPostId, previousPostId } = data;

	console.log('currentPost: ', currentPost);
	console.log('nextPostId: ', nextPostId);
	console.log('previousPostId: ', previousPostId);

	async function handleDelete() {
		const response = await fetch(`/api/images/${id}`, { method: 'DELETE' });

		if (!response.ok) {
			console.log(response.status);
			return;
		}

		router.push('/');
	}

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
			<section className='card-section'>
				<Link href={`/${previousPostId}`} className='navigation-button'>
					<ChevronLeft size={32} absoluteStrokeWidth={true} />
				</Link>
				<ImageCard
					url={currentPost.url}
					title={currentPost.title}
					description={currentPost.description}
				/>
				<Link href={`/${nextPostId}`} className='navigation-button'>
					<ChevronRight size={32} absoluteStrokeWidth={true} />
				</Link>
			</section>
			<section className='section-action-buttons'>
				<button className='action-button'>
					<Pencil />
				</button>
				<button className='action-button' onClick={handleDelete}>
					<Trash2 />
				</button>
			</section>
			<section>
				<h1>Comments</h1>
			</section>
		</main>
	);
}
