import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import ImageCard from '@/Components/ImageCard';
import CommentForm from '@/Components/CommentForm';
import CommentList from '@/Components/CommentList';

export default function DetailPage() {
	const router = useRouter();
	const { isReady } = router;
	const { id } = router.query;

	const { data, error, isLoading, mutate } = useSWR(
		isReady ? `/api/images/${id}` : null,
	);

	if (error || data?.error) return <div>Failed to load</div>;
	if (!isReady || isLoading) return <h2>Loading...</h2>;

	const { currentPost, nextPostId, previousPostId } = data;

	async function handleAddComment(commentData) {
		const response = await fetch(`/api/images/${id}/comments`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(commentData),
		});

		if (response.ok) mutate();
	}

	return (
		<main className='max-w-3xl mx-auto px-4 pb-16'>
			<button
				onClick={() => router.push('/')}
				className='flex items-center gap-1 text-primary hover:text-primary-dark transition-colors duration-200 my-4 bg-transparent border-none cursor-pointer'>
				<ArrowLeft size={18} />
				<span>Back</span>
			</button>

			<ImageCard
				previousPostId={previousPostId}
				nextPostId={nextPostId}
				currentPost={currentPost}
			/>

			<section className='mt-10 border-t border-primary/20 pt-8 flex flex-col gap-6'>
				<h2 className='text-primary text-xl font-medium'>Comments</h2>
				<CommentList comments={currentPost.comments} />
				<div className='border-t border-primary/20 pt-6'>
					<h3 className='text-primary/70 text-sm mb-3'>
						Leave a comment
					</h3>
					<CommentForm onSubmit={handleAddComment} />
				</div>
			</section>
		</main>
	);
}
