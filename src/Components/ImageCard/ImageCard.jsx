import React from 'react';
import Image from 'next/image';

export default function ImageCard({ title, description, url }) {
	return (
		<>
			<Image src={url} width={250} height={250} alt={title} />

			<div className='info-section'>
				<h1>{title}</h1>
				<p>{description}</p>
			</div>
		</>
	);
}
