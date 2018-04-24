// 



import * as util from 'util'
Object.assign(util.inspect.defaultOptions, { showHidden: false, showProxy: false, depth: 1, compact: false, breakLength: Infinity, maxArrayLength: Infinity, colors: true } as Partial<typeof util.inspect.defaultOptions>)
Object.assign(util.inspect.styles, { string: 'green', regexp: 'green', date: 'green', number: 'magenta', boolean: 'blue', undefined: 'red', null: 'red', symbol: 'cyan', special: 'cyan' })



import chalk from 'chalk'
import * as luxon from 'luxon'
import * as StackTracey from 'stacktracey'
const _console = {} as typeof console
let methods = ['log', 'info', 'warn', 'error']
let i: number, len = methods.length
for (i = 0; i < len; i++) {
	let method = methods[i]
	Object.assign(_console, { [method]: console[method] })
	Object.assign(console, {
		[method](...args: any[]) {
			let stack = new StackTracey()
			let site = stack[1]
			let stamp = luxon.DateTime.local().toFormat('hh:mm:ss:SSS')
			let colors = { log: 'blue', info: 'green', warn: 'yellow', error: 'red' }
			let color = (colors[method] || 'magenta') as string
			let square = chalk[color + 'Bright']('█') as string
			if (method == 'error') color = color + 'Bright';
			let file = chalk.bold(`${chalk[color](site.fileName)}:${site.line}`)
			let output = `${square}[${file}]${site.callee}[${chalk.grey(stamp)}]`
			process.stdout.write(`\r\n${chalk.underline(output)}\r\n`)
			_console[method].apply(console, args)
			process.stdout.write(`\r\n`)
		},
	})
}



import * as pandora from 'pandora'
import * as inspector from 'inspector'
if (process.env.DEBUGGER) {
	let offset = pandora.processContext.context.processRepresentation.offset
	inspector.open(process.debugPort + offset + +process.env.INSTANCE)
	process.once('beforeExit', function() {
		// if (process.env.PRIMARY) console.clear();
		inspector.close()
	})
}
declare global { namespace NodeJS { export interface Process { debugPort: number } } }



import * as _ from '../../common/lodash'
import dtsgen from '../../common/dtsgen'
Object.assign(console, { dtsgen: _.noop })
if (process.env.DEVELOPMENT) {
	Object.assign(console, { dtsgen(value: any) { return dtsgen(value) } })
}

