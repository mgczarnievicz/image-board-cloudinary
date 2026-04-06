export default function CommentList({ comments }) {
	if (!comments?.length) {
		return (
			<p className='text-primary/40 text-sm'>
				No comments yet. Be the first!
			</p>
		);
	}

	return (
		<ul className='flex flex-col gap-4'>
			{comments.map((comment) => (
				<li
					key={comment._id}
					className='border border-primary/20 rounded-md px-4 py-3'>
					<div className='flex items-center justify-between mb-1'>
						<span className='text-primary font-medium text-sm'>
							{comment.author}
						</span>
						<span className='text-primary/40 text-xs'>
							{new Date(comment.createdAt).toLocaleDateString()}
						</span>
					</div>
					<p className='text-primary/80 text-sm'>{comment.text}</p>
				</li>
			))}
		</ul>
	);
}
