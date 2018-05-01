// 

import '../common/polyfills'

import * as sourcemaps from 'source-map-support'
sourcemaps.install()

global.WebSocket = require('uws')

import './adapters/process'
import './adapters/console'
import '../common/clock'


