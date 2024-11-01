import React from 'react';
import { Image } from 'next/image';

export default function ImageCard({ title, Description, url }) {
    return (
        <section>
            {/* <Image src={url} alt={title} /> */}
            <h1>{title}</h1>
            <p>{Description}</p>
        </section>
    );
}
