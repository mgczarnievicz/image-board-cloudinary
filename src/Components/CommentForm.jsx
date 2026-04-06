import { useState } from 'react';

export default function CommentForm({ onSubmit }) {
	const [author, setAuthor] = useState('');
	const [text, setText] = useState('');

	function handleSubmit(e) {
		e.preventDefault();
		if (!author.trim() || !text.trim()) return;
		onSubmit({ author, text });
		setAuthor('');
		setText('');
	}

	return (
		<div className='flex flex-col gap-3'>
			<input
				type='text'
				placeholder='Your name'
				value={author}
				onChange={(e) => setAuthor(e.target.value)}
				className='w-full bg-transparent border border-primary/30 rounded-md px-3 py-2 text-primary placeholder:text-primary/40 focus:outline-none focus:border-primary'
			/>
			<textarea
				placeholder='Write a comment...'
				value={text}
				onChange={(e) => setText(e.target.value)}
				rows={3}
				className='w-full bg-transparent border border-primary/30 rounded-md px-3 py-2 text-primary placeholder:text-primary/40 focus:outline-none focus:border-primary resize-none'
			/>
			<button
				onClick={handleSubmit}
				className='self-end bg-primary-dark text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors duration-200'>
				Post comment
			</button>
		</div>
	);
}
