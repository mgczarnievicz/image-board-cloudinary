import Head from 'next/head';
import Image from 'next/image';
import localFont from 'next/font/local';
import styles from '@/styles/Home.module.css';
import useSWR from 'swr';
import { useState } from 'react';

import ImagePreview from '@/Components/ImagePreview/ImagePreview';
import ImageForm from '@/Components/ImageForm/ImageForm';
import Header from '@/Components/Header/Header';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
	const [addImage, setAddImage] = useState(false);
	const { data, error, isLoading } = useSWR('/api/images', fetcher);
	if (error) return <div>failed to load</div>;
	if (isLoading) return <div>loading...</div>;
	console.log('data', data);
	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta name='description' content='Image Board' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Header />
			<main>
				<button onClick={() => setAddImage(!addImage)}>
					Add New Image
				</button>
				{addImage && <ImageForm />}
				<section className='preview-section'>
					{data.map((image) => (
						<ImagePreview
							key={image._id}
							title={image.title}
							url={image.url}
						/>
					))}
				</section>
			</main>
		</>
	);
}
