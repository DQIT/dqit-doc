import type { NavbarConfig } from '@vuepress/theme-default'

//顶部导航栏
export const navbar: NavbarConfig = [

	{
		text: 'Home',
		link: '/',
	},
	{
		text: '开源',
		children: [{
			text: 'DQIT-Cloud',
			link: '/dqit-cloud-doc/01_start'
		}],
	},
	{
		text: '学习',
		children: [{
			text: 'kubernetes',
			link: '/k8s/01_start'
		}],
	},
	{
		text: '其他',
		children: [{
			text: '日常',
			link: '/other/daily/01_start'
		}],
	},
	{
		text: 'GitHub',
		link: 'https://github.com/DQIT'
	}
]
