// 

import chalk from 'chalk'
import * as eyes from 'eyes'
import * as util from 'util'
import * as fs from 'fs'
import * as _ from '../../common/lodash'
import * as Fastify from 'fastify'
import * as Pino from 'pino'
import * as core from '../../common/core'
import fastify from './fastify'



const reqs = [] as Pino.LogRequest[]
const recycle = _.throttle(function(reqId: number) {
	reqs.splice(0, reqId)
}, 1000, { leading: false, trailing: true })

const logger = Object.assign(fs.createWriteStream('/dev/null'), {

	toLevel(label: Pino.Level) { return fastify.log.levels.values[label] },
	toLabel(level: number) { return fastify.log.levels.labels[level] as Pino.Level },

	write(log: Pino.LogDescriptor) {
		if (!core.json.is(log)) {
			return console.error('log not parsable ->', log)
		}
		log = JSON.parse(log as any)
		log.label = Pino.levels.labels[log.level]

		if (DEVELOPMENT) {
			if (log.req) reqs[log.reqId] = log.req;
			else if (reqs[log.reqId]) {
				log.req = reqs[log.reqId]
				recycle(log.reqId)
			}
		}

		let message = _.omit(log, ['level', 'time', 'pid', 'hostname', 'v', 'label', 'reqId', 'responseTime'])
		if (message.req) message.req = _.omit(message.req, ['id', 'remoteAddress', 'remotePort']) as any;

		if (log.err && log.err.stack) {
			if (log.err.isGot) {
				return console.error('ERROR ->', _.omit(message, ['err.stack']))
			}
			return console.error(
				'ERROR ->', message.err.stack, '\n',
				_.omit(message, ['err.stack'])
			)
		}

		let fn = console[log.label] ? log.label : 'error'
		console[fn](log.label.toUpperCase(), '->', message)

	},

})

export default logger





import { Writable, Duplex, Transform } from 'stream'
declare module 'pino' {
	interface BaseLogger {
		stream: typeof logger
	}
	interface LogRequest {
		id: number,
		method: string
		url: string
		remoteAddress: string
		remotePort: number
	}
	interface LogResponse {
		statusCode: number
	}
	interface LogError extends Fastify.FastifyError {

	}
	interface LogDescriptor {
		label?: string
		reqId?: number
		responseTime?: number
		req?: LogRequest
		res?: LogResponse
		err?: LogError
	}
	interface LoggerOptions {
		stream?: Writable | Duplex | Transform
	}
}


