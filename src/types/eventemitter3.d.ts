// 

declare module 'eventemitter3' {

	namespace EventEmitter {
		type Listener<Data = any> = (...args: Data[]) => void
		interface Event<Data = any> {
			fn: Listener<Data>
			context: any
			once: boolean
		}
	}

	class EventEmitter<Names extends string = string, Data = any> {
		static prefixed: string | boolean
		protected _events: { [name: string]: EventEmitter.Event<Data> | EventEmitter.Event<Data>[] }
		eventNames<Name extends Names>(): Name[]
		listeners<Name extends Names>(name?: Name): EventEmitter.Listener<Data>[]
		listenerCount<Name extends Names>(name?: Name): number
		emit<Name extends Names>(name: Name, ...args: Data[]): boolean
		on<Name extends Names>(name: Name, listener: EventEmitter.Listener<Data>, context?: any): this
		addListener<Name extends Names>(name: Name, listener: EventEmitter.Listener<Data>, context?: any): this
		once<Name extends Names>(name: Name, listener: EventEmitter.Listener<Data>, context?: any): this
		removeListener<Name extends Names>(name: Name, listener?: EventEmitter.Listener<Data>, context?: any, once?: boolean): this
		off<Name extends Names>(name: Name, listener?: EventEmitter.Listener<Data>, context?: any, once?: boolean): this
		removeAllListeners<Name extends Names>(name?: Name): this
	}

	export = EventEmitter

}


