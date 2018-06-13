// 

import * as dayjs from 'dayjs'
import * as echarts from 'echarts'
import * as ecstat from 'echarts-stat'
import * as _ from '../../common/lodash'
import * as core from '../../common/core'
import * as http from '../../common/http'
import * as webull from '../../common/webull'
import * as yahoo from '../../common/yahoo'
import * as utils from './utils'
import * as pretty from './pretty'



const XLABEL_FRAMES = [
	{ id: 'millisecond', ms: 0, format: 'hh:mm:ssa', ago: true },
	{ id: 'hour', ms: 0, format: 'hh:mm:ssa', ago: true },
	{ id: 'day', ms: 0, format: 'dddd, MMM DD, hh:mma', ago: true },
	{ id: 'week', ms: 0, format: 'MMM DD, hh:mma', ago: true },
	{ id: 'month', ms: 0, format: 'MMM DD YYYY, hh:mma' },
	{ id: 'year', ms: 0, format: 'MMM DD YYYY' },
]
XLABEL_FRAMES.forEach(v => v.ms = dayjs(0).add(1, v.id as any).valueOf())
export function xlabel(stamp: number) {
	if (!Number.isFinite(stamp)) return '';
	let now = Date.now()
	let i: number, len = XLABEL_FRAMES.length
	for (i = 0; i < len; i++) {
		if (stamp > (now - XLABEL_FRAMES[i].ms)) {
			let frame = XLABEL_FRAMES[Math.max(i - 1, 0)]
			let label = dayjs(stamp).format(frame.format)
			if (frame.format.endsWith('ssa')) {
				if (label.includes(':00')) label = label.replace(':00', '');
			}
			if (frame.format.endsWith('mma')) {
				if (label.includes(', 12:00am')) label = label.replace(', 12:00am', '');
			}
			if (frame.format.startsWith('dddd')) {
				let day = label.split(' ')[0]
				label = label.replace(day, `${day.substring(0, 3)},`)
			}
			if (frame.ago) label += ` (${pretty.time(stamp)})`
			return label
		}
	}
	return dayjs(stamp).format(XLABEL_FRAMES[XLABEL_FRAMES.length - 1].format)
}

const RANGE_UNITS = { m: 'minute', h: 'hour', d: 'day', wk: 'week', mo: 'month', y: 'year', ytd: 'YTD' }
export function range(range: string, opts = { plural: true }) {
	if (!range) return range;
	let s = range.replace(/[0-9]/g, '')
	s = RANGE_UNITS[s] || s
	s = s.charAt(0).toUpperCase() + s.substr(1)
	let n = Number.parseInt(range)
	if (!Number.isFinite(n)) return s;
	if (opts.plural && n > 1) s = s + 's';
	return n + ' ' + s
}



export function getChart(symbol: string, tid: number, range: string) {
	return Promise.resolve().then(function() {
		if (range != yahoo.RANGES[0]) {
			return yahoo.getChart(symbol, { range, interval: yahoo.FRAMES[range] })
		}
		return Promise.all([
			http.get(`https://quoteapi.webull.com/api/quote/v3/tickerMinutes/${tid}/F`, { query: { minuteType: 'm1' } }),
			http.get(`https://quoteapi.webull.com/api/quote/v3/tickerMinutes/${tid}/A`, { query: { minuteType: 'm1' } }),
		]).then(function(resolved: Webull.MinuteChart[]) {
			resolved.forEach(v => { core.fix(v, true); core.fix(v.data[0], true) })
			let mlquotes = resolved.map(v => webull.toMinutesLives(v)).flatten()

			let range = {
				min: dayjs(Math.min(...resolved.map(v => v.data[0].dates[0].start * 1000))).valueOf(),
				max: dayjs(Math.max(...resolved.map(v => v.data[0].dates[0].end * 1000).concat(Date.now()))).valueOf(),
			}
			// console.log(`range ->`, _.mapValues(range, v => pretty.stamp(v)))

			return yahoo.getChart(symbol, {
				interval: '1m', includePrePost: true,
				period1: dayjs(range.min).startOf('day').unix(),
				period2: dayjs(range.max).endOf('day').unix(),
			}).then(function(ylquotes) {

				ylquotes.remove(v => v.timestamp < range.min)
				let ystamps = ylquotes.map(v => v.timestamp)
				mlquotes.forEach(mlquote => {
					let ylquote = ylquotes.find(v => v.timestamp == mlquote.timestamp)
					if (ylquote) return ylquote.size += mlquote.size;
					let index = core.array.nearest(ystamps, mlquote.timestamp)
					if (index >= 0) ylquotes[index].size += mlquote.size;
				})

				return ylquotes.sort((a, b) => a.timestamp - b.timestamp)
			})
		})

	}).then(function(lquotes) {
		lquotes.forEach((lquote, i) => {
			lquote.price = lquote.close
			let prev = lquotes[i - 1] ? lquotes[i - 1].volume : lquote.size
			lquote.volume = prev + lquote.size
		})
		return lquotes
	})
}





// export function getMinutes(tid: number, range: string) {
// 	return Promise.resolve().then(function() {
// 		let proms = []
// 		if (range == '1d') {
// 			let query = { minuteType: 'm1' }
// 			proms.push(http.get(`https://quoteapi.webull.com/api/quote/v3/tickerMinutes/${tid}/F`, { query }))
// 			proms.push(http.get(`https://quoteapi.webull.com/api/quote/v2/tickerMinutes/${tid}`, { query }))
// 			proms.push(http.get(`https://quoteapi.webull.com/api/quote/v3/tickerMinutes/${tid}/A`, { query }))
// 		}
// 		if (range == '5d') {
// 			let query = { minuteType: 'm5' }
// 			proms.push(http.get(`https://quoteapi.webull.com/api/quote/v2/tickerMinutes/${tid}`, { query }))
// 		}
// 		return Promise.all(proms)
// 	}).then(function(resolved: Webull.MinuteChart[]) {
// 		let lquotes = [] as Quotes.Live[]
// 		resolved.forEach(response => {
// 			response.data.forEach(data => {
// 				data.tickerMinutes.forEach(minute => {
// 					let msplit = minute.split(',').map(Number.parseFloat)
// 					lquotes.push({
// 						price: msplit[1], size: msplit[2],
// 						timestamp: msplit[0] * 1000,
// 					} as Quotes.Live)
// 				})
// 			})
// 		})
// 		lquotes.sort((a, b) => a.timestamp - b.timestamp)
// 		// lquotes.forEach((lquote, i) => {
// 		// 	lquote.price = lquote.close
// 		// 	let prev = lquotes[i - 1] ? lquotes[i - 1].volume : lquote.size
// 		// 	lquote.volume = prev + lquote.size
// 		// })
// 		return lquotes
// 	})
// }



// import * as benchmark from '../../common/benchmark'
// benchmark.simple('formats', [
// 	function formattime() {
// 		prettyms(Date.now() - (Math.round(Math.random() * 1000000)))
// 	},
// 	function fromnowdayjs() {
// 		dayjs(Date.now() - (Math.round(Math.random() * 1000000))).fromNow()
// 	},
// 	function formatdayjs() {
// 		dayjs(Date.now() - (Math.round(Math.random() * 1000000))).format('dddd, MMM DD YYYY, hh:mm:ssa')
// 	},
// 	function xlabel() {
// 		format.xlabel(Date.now() - (Math.round(Math.random() * 1000000)))
// 	},
// ])


