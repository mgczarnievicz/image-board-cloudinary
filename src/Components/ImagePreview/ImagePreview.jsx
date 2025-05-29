import React from 'react';
import Image from 'next/image';
import { Link } from 'next/link';

import './ImagePreview.css';

export default function ImagePreview({ title, url }) {
	return (
		<section className='card'>
			<Image src={url} width={200} height={200} alt={title} />
			<h1>{title}</h1>
		</section>
	);
}
