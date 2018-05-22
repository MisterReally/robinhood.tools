// 

import * as _ from '../../common/lodash'
import * as core from '../../common/core'
import * as rkeys from '../../common/rkeys'
import * as redis from './redis'



export const DEV_STOCKS = {
	SPY: 913243251,
	NVDA: 913257561,
	// AMD: 913254235,
	// AAPL: 913256135,
	// FB: 913303928,
	// BABA: 913254558,
	// BAC: 913254999,
	// INTC: 913257268,
	// MSFT: 913323997,
	GE: 913255327,
	MU: 913324077,
	SQ: 913254798,
	// ROKU: 925376726,
	// XNET: 913255889,
	// DPW: 913303773,
	// LFIN: 925401791,
	// PXS: 913253601,
	// ASTC: 913254169,
	// CADC: 913254240,
	// CHFS: 913253381,
	// LEDS: 913253344,
	// CREG: 913254265,
	// ISZE: 913247275,
	// WEXP: 913246860,
	// GMFL: 925348033,
}
export const DEV_FOREX = {
	USDCAD: 913344262,
	USDCNY: 913344246,
	USDJPY: 913344317,
}
export const DEV_INDEXES = {
	DJI: 913353822,
	INX: 913354362,
	IXIC: 913354090,
}



export const matchSymbol = /[^A-Z-.]/

export async function getSymbols(type = 'STOCKS' as keyof typeof rkeys.SYMBOLS) {
	let resolved = await redis.main.get(rkeys.SYMBOLS[type])
	return (resolved ? JSON.parse(resolved) : []) as string[]
}
export async function getInstanceSymbols(type = 'STOCKS' as keyof typeof rkeys.SYMBOLS) {
	let resolved = await redis.main.get(`${rkeys.SYMBOLS[type]}:${process.env.CPUS}:${process.env.INSTANCE}`)
	return (resolved ? JSON.parse(resolved) : []) as string[]
}

export async function getFullSymbols(type = 'STOCKS' as keyof typeof rkeys.FSYMBOLS) {
	let resolved = await redis.main.get(rkeys.FSYMBOLS[type])
	return (resolved ? JSON.parse(resolved) : {}) as Dict<number>
}
export async function getInstanceFullSymbols(type = 'STOCKS' as keyof typeof rkeys.FSYMBOLS) {
	let resolved = await redis.main.get(`${rkeys.FSYMBOLS[type]}:${process.env.CPUS}:${process.env.INSTANCE}`)
	return (resolved ? JSON.parse(resolved) : {}) as Dict<number>
}



import * as fs from 'fs'
import * as path from 'path'
import * as sourcemaps from 'source-map-support'
/**▶ utils.requireDir(__dirname, __filename) */
export function requireDir(dirName: string, fileName: string, filter?: (file: string) => boolean) {
	fs.readdirSync(dirName).filter(v => {
		return v != fileName && !v.endsWith('.map')
	}).forEach(function(file) {
		let full = path.join(dirName, file)
		let src = sourcemaps.retrieveSourceMap(full).url
		if (src.endsWith('.map')) src = src.slice(0, -4);
		src = src.replace('/dist/', '/src/').replace('.js', '.ts')
		if (!fs.existsSync(src)) return;
		if (!filter || filter(path.basename(src))) require(full);
	})
}




