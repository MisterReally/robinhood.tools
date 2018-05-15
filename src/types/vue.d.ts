// 

import Vue, { ComponentOptions } from 'vue'

declare module 'vue/types/vue' {
	export interface Vue {
		_uid?: string
	}
}

declare module "*.vue" {
	import Vue from 'vue'
	export default Vue
}
