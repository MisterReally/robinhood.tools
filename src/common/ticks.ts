// 

import * as _ from 'lodash'
import * as ci from 'correcting-interval'
import * as core from './core'
import Emitter from './emitter'



const TICKS = {
	t100ms: '100', t250ms: '250', t500ms: '500',
	t1s: '1000', t2s: '2000', t3s: '3000', t5s: '5000',
	t10s: '10000', t15s: '15000', t30s: '30000', t60s: '60000',
}
declare global { type Tick = keyof typeof TICKS }

const Ticks = {} as Dict<Tick>
const emitter = new Emitter<Tick, number>()

if (process.MASTER) {
	emitter.addListener(TICKS.t100ms as Tick, function(i) {

	})
	console.log('emitter ->', console.dump(emitter, { depth: 8 }))
}



const delays = {} as Dict<number>
const progs = {} as Dict<number>
function ee4start(event: Tick, ms: number) {
	if (process.SERVER) (delays[event] as any).unref();
	clearTimeout(delays[event]); delays[event] = null; _.unset(delays, event);
	progs[event] = 0
	emitter.emit(event, progs[event])
	ci.setCorrectingInterval(function() {
		progs[event]++
		emitter.emit(event, progs[event])
	}, ms)
}

setImmediate(function() {
	Object.keys(TICKS).forEach(function(event: Tick, i) {
		let ms = Number.parseInt(TICKS[event])
		Ticks[event] = event
		let now = Date.now()
		let start = now - (now % ms)
		let end = start + ms
		let ims = process.CLIENT ? 0 : core.math.dispersed(ms, process.INSTANCE, process.INSTANCES)
		let delay = (start + ims) - now
		if (delay <= 0) delay = (end + ims) - now;
		delays[event] = _.delay(ee4start, delay, event, ms)
	})
})

export default Object.assign(emitter, Ticks)




