import { SWRConfig } from 'swr';
import Header from '@/Components/Header/Header';

import '@/styles/globals.css';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function App({ Component, pageProps }) {
	return (
		<>
			<SWRConfig
				value={{
					fetcher,
				}}>
				<Header />
				<Component {...pageProps} />
			</SWRConfig>
		</>
	);
}
