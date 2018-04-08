// 



import * as os from 'os'
import * as cluster from 'cluster'
process.INSTANCES = !Number.isFinite(process.INSTANCES) ? os.cpus().length : process.INSTANCES
process.INSTANCE = cluster.isWorker ? Number.parseInt(process.env.NODE_APP_INSTANCE) : -1
process.PRIMARY = process.INSTANCE == 0
process.MASTER = cluster.isMaster
process.WORKER = cluster.isWorker



import * as path from 'path'
import * as dotenv from 'dotenv'
dotenv.config({ path: path.resolve(process.cwd(), 'config/server.' + NODE_ENV + '.env') })
dotenv.config({ path: path.resolve(process.cwd(), 'config/server.env') })
process.NAME = process.env.npm_package_name
process.VERSION = process.env.npm_package_version
process.DOMAIN = (DEVELOPMENT ? 'dev.' : '') + process.env.npm_package_domain
process.HOST = process.env.HOST || 'localhost'
process.PORT = Number.parseInt(process.env.PORT) || 12300
process.SERVER = true



import chalk from 'chalk'
process.on('uncaughtException', function(error) {
	console.error(chalk.bold.redBright('UNCAUGHT EXCEPTION'), '->', error)
})
process.on('unhandledRejection', function(error) {
	console.error(chalk.bold.redBright('UNHANDLED REJECTION'), '->', error)
	console.error('https://github.com/mcollina/make-promises-safe')
	process.exit(1)
})



if (process.MASTER) {
	if (DEVELOPMENT) setInterval(function() { process.stdout.write('\x1b[K') }, 1000); // keeps terminal focused
	console.log('\n\n')
	console.log(`${chalk.magentaBright('█')} ${chalk.underline.bold(process.NAME)}`)
	console.log(`${chalk.magentaBright('█')} ${chalk(NODE_ENV)}`)
}


