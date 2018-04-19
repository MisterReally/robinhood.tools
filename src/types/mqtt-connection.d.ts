// 

declare module 'mqtt-connection' {
	
	// import * as duplexify from 'duplexify'
	import * as Mqtt from 'mqtt'

	class MqttConnection {
		
		// connect(opts: Partial<Mqtt.IConnectPacket>, cb?: Function): void
		
		constructor(stream?: any)
		allowHalfOpen: boolean
		destroyed: boolean
		readable: boolean
		readableHighWaterMark: number
		writable: boolean
		writableHighWaterMark: number
		addListener(ev?: any, fn?: any): any
		connack(opts?: any, cb?: any): void
		connect(opts?: any, cb?: any): void
		cork(): void
		destroy(): void
		disconnect(opts?: any, cb?: any): void
		emit(type?: any, args?: any): any
		end(data?: any, enc?: any, cb?: any): any
		eventNames(): any
		getMaxListeners(): any
		isPaused(): any
		listenerCount(type?: any): any
		listeners(type?: any): any
		on(ev?: any, fn?: any): any
		once(type?: any, listener?: any): any
		pause(): any
		pingreq(opts?: any, cb?: any): void
		pingresp(opts?: any, cb?: any): void
		pipe(dest?: any, pipeOpts?: any): any
		prependListener(type?: any, listener?: any): any
		prependOnceListener(type?: any, listener?: any): any
		puback(opts?: any, cb?: any): void
		pubcomp(opts?: any, cb?: any): void
		publish(opts?: any, cb?: any): void
		pubrec(opts?: any, cb?: any): void
		pubrel(opts?: any, cb?: any): void
		push(chunk?: any, encoding?: any): any
		rawListeners(type?: any): any
		read(n?: any): any
		removeAllListeners(type?: any, ...args: any[]): any
		removeListener(type?: any, listener?: any): any
		resume(): any
		setDefaultEncoding(encoding?: any): any
		setEncoding(enc?: any): any
		setMaxListeners(n?: any): any
		setReadable(readable?: any): void
		setWritable(writable?: any): void
		suback(opts?: any, cb?: any): void
		subscribe(opts?: any, cb?: any): void
		uncork(): void
		unpipe(dest?: any): any
		unshift(chunk?: any): any
		unsuback(opts?: any, cb?: any): void
		unsubscribe(opts?: any, cb?: any): void
		wrap(stream?: any, ...args: any[]): any
		write(chunk?: any, encoding?: any, cb?: any): any
	}

	namespace MqttConnection {

	}

	export = MqttConnection

}