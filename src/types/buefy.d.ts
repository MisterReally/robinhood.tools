// 



declare module 'buefy' {

	import _Vue from 'vue'

	export type DialogConfig = {
		/**
		 * Dialog title
		 */
		title?: string;

		/**
		 * Message text
		 */
		message: string;

		/**
		 * Adds an icon on the left side depending on the <code>type</code> or <code>icon</code>
		 */
		hasIcon?: boolean;

		/**
		 * Icon name if <code>hasIcon</code>, optional
		 */
		icon?: string;

		/**
		 * Icon pack to use if <code>hasIcon</code>, optional
		 */
		iconPack?: string;

		/**
		 * Dialog\'s size, optional
		 */
		size?: 'is-small' | 'is-medium' | 'is-large';

		/**
		 * Custom animation (transition name)
		 */
		animation?: string;

		/**
		 * Text of the confirm button
		 */
		confirmText?: string;

		/**
		 * Text of the cancel button
		 */
		cancelText?: string;

		/**
		 * Can close dialog by clicking cancel button, pressing escape or clicking outside
		 */
		canCancel?: boolean | Array<any>;

		/**
		 * Callback function when the confirm button is clicked
		 */
		onConfirm?: (value: string) => any;

		/**
		 * Callback function when the dialog is canceled (cancel button is clicked / pressed escape / clicked outside)
		 */
		onCancel?: () => any;

		/**
		 * Type (color) of the confirm button (and the icon if <code>hasIcon</code>)
		 */
		type?: ColorModifiers;

		/**
		 * <code>clip</code> to remove the <code>&lt;body&gt;</code> scrollbar, <code>keep</code> to have a non scrollable scrollbar
		 * to avoid shifting background, but will set <code>&lt;body&gt;</code> to position fixed, might break some layouts
		 */
		scroll?: 'clip' | 'keep';
	}

	type PromptDialogConfig = DialogConfig & {
		/**
		 * Prompt only: input's attributes
		 */
		inputAttrs?: any;
	};

	export const Dialog: {
		alert: (params: DialogConfig | string) => any;
		confirm: (params: DialogConfig) => any;
		prompt: (params: PromptDialogConfig) => any;
	}

	export const LoadingProgrammatic: {
		open: () => { close: () => any };
	}

	type ModalConfig = {
		content?: string;
		component?: typeof _Vue;
		parent?: _Vue;
		props?: any;
		events?: {
			[index: string]: Function
		};
		width?: string | number;
		hasModalCard?: boolean;
		animation?: string;
		canCancel?: boolean | Array<any>;
		onCancel?: () => any;
		scroll?: 'clip' | 'keep';
	}

	export const ModalProgrammatic: {
		open: (params: ModalConfig | string) => any;
	}

	export type SnackbarConfig = {
		message: string;
		type?: ColorModifiers;
		position?: GlobalPositions;
		duration?: number;
		container?: string;
		actionText?: string | null;
		onAction?: () => any;
	}
	export const Snackbar: {
		open: (params: SnackbarConfig | string) => void;
	}

	export type ToastConfig = {
		/**
		 * Type (color) of the toast
		 */
		type?: ColorModifiers;

		/**
		 * Message text
		 */
		message: string;

		/**
		 * Which position the toast will appear
		 */
		position?: GlobalPositions;

		/**
		 * Visibility duration in milliseconds
		 */
		duration?: number;

		/**
		 * DOM element the toast will be created on.
		 * Note that this also changes the position of the toast from fixed
		 * to absolute. Meaning that the container should be fixed.
		 */
		container?: string;
	}

	export const Toast: {
		open: (params: ToastConfig | string) => any;
	}

	export type ColorModifiers = 'is-white' | 'is-black' | 'is-light' | 'is-dark' | 'is-primary' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger' | string;
	export type GlobalPositions = 'is-top-right' | 'is-top' | 'is-top-left' | 'is-bottom-right' | 'is-bottom' | 'is-bottom-left';

	module 'vue/types/vue' {
		interface Vue {
			$dialog: typeof Dialog
			$loading: typeof LoadingProgrammatic
			$modal: typeof ModalProgrammatic
			$snackbar: typeof Snackbar
			$toast: typeof Toast
		}
	}

	export interface BuefyConfig {
		defaultContainerElement?: string
		defaultIconPack: 'fa' | 'mdi' | string
		defaultDialogConfirmText?: string
		defaultDialogCancelText?: string
		defaultSnackbarDuration: number
		defaultToastDuration: number
		defaultTooltipType: ColorModifiers
		defaultTooltipAnimated: false
		defaultInputAutocomplete: 'on' | 'off'
		defaultDateFormatter?: string
		defaultDateParser?: string
		defaultDayNames?: string
		defaultMonthNames?: string
		defaultFirstDayOfWeek?: string
		defaultTimeFormatter?: string
		defaultTimeParser?: string
		defaultModalScroll?: string
		defaultDatepickerMobileNative: boolean
		defaultTimepickerMobileNative: boolean
		defaultNoticeQueue: boolean
	}

	const _default: {
		install(Vue: typeof _Vue, config: BuefyConfig): void
	}

	export default _default

}


