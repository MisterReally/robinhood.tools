// 

import * as Vts from 'vue-property-decorator'
import Vue from 'vue'
import * as _ from '@/common/lodash'
import * as core from '@/common/core'
import * as pretty from '@/common/pretty'
import * as rkeys from '@/common/rkeys'
import * as robinhood from '@/client/adapters/robinhood'
import * as security from '@/client/adapters/security'
import * as http from '@/client/adapters/http'
import store from '@/client/store'
import socket from '@/client/adapters/socket'



@Vts.Component({
	beforeRouteEnter(to, from, next) {
		// if (process.env.DEVELOPMENT) return next();
		store.state.security.rhusername ? next() : next({ name: 'login' })
	},
})
export default class extends Vue {

	get routes() { return this.$router.options.routes.find(v => v.name == 'robinhood').children }

}


