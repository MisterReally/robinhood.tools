// 

export * from '../../common/yahoo'
import * as pAll from 'p-all'
import * as boom from 'boom'
import * as _ from '../../common/lodash'
import * as core from '../../common/core'
import * as rkeys from '../../common/rkeys'
import * as yahoo from '../../common/yahoo'
import * as redis from './redis'
import * as http from '../../common/http'



export async function getQuotes(symbols: string[]): Promise<Yahoo.Quote[]> {
	if (symbols.length == 0) return [];

	let iserror = symbols[0] == 'internal-error'
	if (iserror) {
		symbols.shift()
		if (symbols.length == 1) return [];
	}

	let response = await http.get('https://query1.finance.yahoo.com/v7/finance/quote', {
		query: { symbols: symbols.join(',') },
	}) as Yahoo.ApiQuote

	let error = _.get(response, 'quoteResponse.error') as Yahoo.ApiError
	if (error) {
		if (error.code == 'internal-error' && error.description == null) {
			let halfs = core.array.chunks(symbols, 2)
			return _.flatten(await pAll(halfs.map(half => () => getQuotes(['internal-error'].concat(half)))))
		}
		console.error(`getQuotes Error -> %O`, error, symbols)
		return []
	}

	response.quoteResponse.result.remove(v => !v)
	response.quoteResponse.result.forEach(v => {
		Object.keys(v).forEach(k => {
			let value = v[k]
			if (core.number.isFinite(value) && k.toLowerCase().includes('time')) {
				v[k] = value * 1000
			}
		})
		v.symbol = v.symbol.toUpperCase()
	})
	return response.quoteResponse.result

}

export async function syncQuotes(symbols: string[]) {
	let chunks = core.array.chunks(symbols, _.ceil(symbols.length / 256))
	await pAll(chunks.map(chunk => {
		return () => getQuotes(chunk).then(function(yhquotes) {
			return redis.main.coms(yhquotes.map(yhquote => {
				return ['hmset', `${rkeys.YH.QUOTES}:${yhquote.symbol}`, yhquote as any]
			}))
		})
	}), { concurrency: 2 })
}



export async function getSummary(symbol: string) {
	let response = await http.get('https://query1.finance.yahoo.com/v10/finance/quoteSummary/' + symbol, {
		query: { modules: yahoo.SUMMARY_MODULES.join(','), formatted: false },
	}) as Yahoo.ApiSummary
	let summary = response.quoteSummary.result[0]
	summary.symbol = symbol
	return summary
}


