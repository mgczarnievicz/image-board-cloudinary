import Head from 'next/head';
import useSWR from 'swr';
import { useState } from 'react';
import { CirclePlus } from 'lucide-react';

import ImagePreview from '@/Components/ImagePreview/ImagePreview';
import AddImage from '@/Components/AddImage/AddImage';

export default function Home() {
	const [addImage, setAddImage] = useState(false);
	const { data, error, isLoading } = useSWR('/api/images');

	if (error || data?.error) return <div>Failed to load</div>;
	if (isLoading) return <div>Loading...</div>;

	return (
		<>
			<Head>
				<title>Sunset Board</title>
				<meta name='description' content='Image Board' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='pb-24'>
				<section
					className='grid gap-5 p-8'
					style={{
						gridTemplateColumns:
							'repeat(auto-fill, minmax(250px, 1fr))',
					}}>
					{data.map((image) => (
						<ImagePreview
							key={image._id}
							title={image.title}
							url={image.url}
							id={image._id}
						/>
					))}
				</section>
			</main>

			<footer className='fixed bottom-0 w-full flex justify-end px-6 py-3'>
				<CirclePlus
					size={64}
					absoluteStrokeWidth
					className='text-primary bg-white rounded-full cursor-pointer hover:text-primary-dark transition-colors duration-200'
					onClick={() => setAddImage(!addImage)}
				/>
			</footer>

			{addImage && <AddImage onCloseAdd={() => setAddImage(false)} />}
		</>
	);
}
