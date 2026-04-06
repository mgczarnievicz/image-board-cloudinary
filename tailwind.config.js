/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#F4E185',
				'primary-dark': '#F3950D',
				secondary: '#00cec9',
				'secondary-dark': '#016867',
				background: '#0F2C67',
				black: '#000000',
				white: '#ffffff',
			},
		},
	},
	plugins: [],
};
