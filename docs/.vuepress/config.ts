import {defineUserConfig} from 'vuepress'
import type {DefaultThemeOptions} from 'vuepress'
import {sidebar} from "./config/sidebar"
import {navbar} from "./config/navbar"
import {components} from "./config/components";
const {path} = require('@vuepress/utils')

export default defineUserConfig<DefaultThemeOptions>({
	// 站点配置
	lang: 'zh-CN',
	title: '一笔清泉字',
	description: 'A Spring Word',

	// 主题和它的配置
	theme: '@vuepress/theme-default',
	themeConfig: {
		logo: '/images/logo.png',
		logoDark: '/images/logo-dark-mode.png',
		//顶部导航栏
		navbar: navbar,
		//侧边栏配置
		sidebar: sidebar
	},
	alias: {
		//覆盖 footer
		'@theme/HomeFooter.vue': path.resolve(__dirname, '../components/Footer.vue'),
	},

	//插件配置
	plugins: [
		//组件注册插件
		components,
		//搜索插件
		[
			'@vuepress/plugin-search',
			{
				locales: {
					'/': {
						placeholder: 'Search',
					},
					'/zh/': {
						placeholder: '搜索',
					},
				},
			},
		]
	]
})
