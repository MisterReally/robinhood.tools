// 

import * as Vts from 'vue-property-decorator'
import { mixins as Mixins } from 'vue-class-component'
import Vue from 'vue'
import socket, { WS } from '@/client/adapters/socket'



@Vts.Component
export default class extends Vue {

	get symbol() { return this.$route.params.symbol }

	mounted() {
		console.log('this.$route ->', this.$route)
		socket.on(`${WS.SYMBOL}:${this.symbol}:quote`, this.onquote, this)
	}

	beforeDestroy() {
		socket.offListener(this.onquote, this)
	}

	onquote(quote: Webull.Quote) {
		console.log('quote ->', quote)
	}

}


