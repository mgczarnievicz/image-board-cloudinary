import React from 'react';
import SunIcon from './Icons/SunIcon';

export default function Header() {
	return (
		<header className='bg-background border-b border-primary/15 px-8 py-5'>
			<div className='flex items-center gap-3.5'>
				<SunIcon />
				<div>
					<h1 className='text-primary text-2xl font-medium leading-tight m-0'>
						Sun Board
					</h1>
					<p className='text-primary/55 text-xs tracking-widest uppercase m-0'>
						sunset gallery
					</p>
				</div>
			</div>
			<div className='h-[3px] bg-gradient-to-r from-background via-primary-dark to-primary mt-5 -mx-8' />
		</header>
	);
}
