import React from 'react';
import Image from 'next/image';
import { Link } from 'next/link';

export default function ImagePreview({ title, url }) {
    console.log('title', title);
    console.log('url', url);

    return (
        <>
            <Image src={url} width={200} height={200} alt={title} />
            <h1>{title}</h1>
        </>
    );
}
