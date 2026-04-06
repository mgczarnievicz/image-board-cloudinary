import Head from 'next/head';
import useSWR from 'swr';
import { useState } from 'react';
import { CirclePlus } from 'lucide-react';

import ImagePreview from '@/Components/ImagePreview/ImagePreview';
import AddImage from '@/Components/AddImage/AddImage';

import '../styles/Home.css';

export default function Home() {
	const [addImage, setAddImage] = useState(false);
	const { data, error, isLoading } = useSWR('/api/images');

	if (error || data?.error) return <div>Failed to load</div>;
	if (isLoading) return <div>Loading...</div>;
	console.log('data', data);

	function onCloseAdd() {
		setAddImage(!addImage);
	}

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

			<main>
				<section className='preview-section'>
					{data.map((image) => (
						<ImagePreview
							key={image._id}
							title={image.title}
							url={image.url}
							id={image._id}
						/>
					))}
				</section>
				{addImage && <AddImage onCloseAdd={onCloseAdd} />}
			</main>

			<footer>
				<CirclePlus
					size={64}
					absoluteStrokeWidth={true}
					className='add-button'
					onClick={() => setAddImage(!addImage)}
				/>
			</footer>
		</>
	);
}
