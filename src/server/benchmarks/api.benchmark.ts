// 

import '../main'
import * as clc from 'cli-color'
import * as execa from 'execa'
import * as url from 'url'
import * as http from 'http'
import * as turbo from 'turbo-http'
import * as Polka from 'polka'
import * as pAll from 'p-all'
import * as Table from 'cli-table2'
// import * as Pandora from 'pandora'
import * as core from '../../common/core'
import * as rkeys from '../../common/rkeys'
import * as pretty from '../../common/pretty'
import * as security from '../../common/security'
import * as wrk from './wrk'
import * as redis from '../adapters/redis'



async function run(url: string) {
	console.log('run ->', url)
	// let hub = Pandora.getHub()
	// await hub.hubClient.invoke({ processName: 'api' }, 'gc', 'clear')
	// await new Promise(r => _.delay(r, 300))
	// let proxy = await hub.getProxy({ name: 'memory' })
	// let fromheap = await (proxy as any).memoryUsage() as NodeJS.MemoryUsage
	let cli = await execa('wrk', [
		'-t1', '-c100', '-d1s',
		'-H', 'x-uuid: ' + security.randomBytes(32),
		'-H', 'x-finger: ' + security.randomBytes(32),
		'-H', 'user-agent: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)',
		url,
	])
	return wrk.parse(cli.stdout)
	// let toheap = await (proxy as any).memoryUsage() as NodeJS.MemoryUsage
	// console.log(cli.stdout)
	// let parsed = wrk.parse(cli.stdout)
	// return Object.assign(parsed, { fromheap, toheap })
}

async function start() {

	let urls = []
	// urls.push(`http://${process.env.HOST}:${+process.env.IPORT + 1}/turbo`)
	// urls.push(`http://${process.env.HOST}:${+process.env.IPORT + 2}/polka`)
	// urls.push(`http://${process.env.HOST}:${process.env.PORT}/api/blank`)
	// urls.push(`http://${process.env.HOST}:${process.env.PORT}/api/route`)
	// urls.push(`http://${process.env.HOST}:${process.env.PORT}/api/security/token`)
	urls.push(`http://${process.env.DOMAIN}/api/blank`)
	urls.push(`http://${process.env.DOMAIN}/api/promise`)
	urls.push(`http://${process.env.DOMAIN}/api/async`)

	let results = await pAll(urls.map(v => () => run(v)), { concurrency: 1 })

	let table = new Table({
		head: ['Address', 'Req/sec', 'Data/sec', 'Latency', 'Stdev', '+/- Stdev', 'Dropped'],
		colAligns: ['left', 'right', 'right', 'right', 'right', 'right', 'right'],
		style: { head: ['bold', 'blue'] },
	}) as string[][]

	results.forEach(function(v, i) {
		let parsed = url.parse(urls[i])
		let dropped = pretty.formatNumber(v.errors.non2xx3xx) + '/' + pretty.formatNumber(v.requests.total)
		table.push([
			parsed.host.concat(parsed.path),
			pretty.formatNumber(v.requests.rate),
			pretty.formatNumber(v.transfer.rate, 2),
			// pretty.formatNumber(pretty.bytes(v.toheap.heapUsed - v.fromheap.heapUsed)),
			pretty.formatNumber(v.latency.avg, 2),
			pretty.formatNumber(v.latency.stdev, 2),
			pretty.formatNumber(v.latency.pStdev, 2) + '%',
			v.errors.non2xx3xx ? clc.bold.red(dropped) : dropped,
		])
	})

	let previous = await redis.main.get(rkeys.BENCHMARKS.API.PREVIOUS)
	if (previous) process.stdout.write('\r\n' + previous + '\r\n\r\n');
	let output = table.toString()

	process.stdout.write('\r\n' + output + '\r\n\r\n')
	redis.main.set(rkeys.BENCHMARKS.API.PREVIOUS, output)

}

setImmediate(() => start().catch(error => console.error(`'${error.cmd}' ->`, error)))



// let server = turbo.createServer(function handler(req, res) { res.end() })
// if (+process.env.INSTANCE == 2) {
// 	const polka = Polka()
// 	polka.get('/polka', function get(req, res) { res.end() })
// 	server = turbo.createServer(polka.handler as any)
// }

// server.listen(+process.env.IPORT, process.env.HOST, function onlisten() {
// 	console.info('listening ->', process.env.HOST + ':' + process.env.IPORT)
// 	if (process.env.PRIMARY) {
// 		setImmediate(() => start().catch(error => console.error(`'${error.cmd}' ->`, error)))
// 	}
// })

// exithook(function onexit() {
// 	if (Array.isArray(server.connections)) server.connections.forEach(v => v.close());
// 	server.close()
// })





// if (process.env.PRIMARY) {
// 	_.delay(async function() {
// 		let proxy = await Pandora.getHub().getProxy({ name: 'memory' })
// 		console.log('proxy ->', proxy)
// 		let memory = await proxy.getProperty('memoryUsage')
// 		console.log('memory ->', memory)
// 	}, 1000)
// }





// const polka = Polka({ server: turbo.createServer() })
// polka.get('/', function get(req: any, res: any) { res.end() })

// polka.listen(+process.env.IPORT, process.env.HOST).then(function() {
// 	console.info('turbo listening ->', process.env.HOST + ':' + process.env.PORT)
// 	if (process.env.PRIMARY) start().catch(error => console.error(`'${error.cmd}' ->`, error));
// })
// exithook(function onexit() {
// 	polka.server.connections.forEach(v => v.close())
// 	polka.server.close()
// })


