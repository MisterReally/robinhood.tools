// 



export const WS = {
	SYMBOL: 'ws:symbol',
	DISCOVER: 'ws:discover',
}



declare global {
	namespace Socket {
		interface Event<Data = any> {
			name: string
			data: Data
			action: 'sync'
			subs: string[]
		}
	}
}





