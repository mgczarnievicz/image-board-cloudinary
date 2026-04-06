import Image from 'next/image';
import Link from 'next/link';

export default function ImagePreview({ title, url, id }) {
	return (
		<Link
			href={`/${id}`}
			className='border border-primary rounded-md text-center hover:border-primary-dark transition-colors duration-200'>
			<div className='relative w-full h-48'>
				<Image
					src={url}
					fill
					alt={title}
					className='rounded-t-md object-cover'
				/>
			</div>
			<h2 className='text-primary-dark text-base font-medium py-2 px-3'>
				{title}
			</h2>
		</Link>
	);
}
