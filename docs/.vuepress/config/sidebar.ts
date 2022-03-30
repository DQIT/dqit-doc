import type {SidebarConfig} from '@vuepress/theme-default'

//侧边栏
export const sidebar: SidebarConfig = {
	'/start/': [
		{
			text: '开始',
			link: '/start/01_start.md'
		},
	],
	'/dqit-cloud-doc/': [
		{
			text: 'DQIT-Cloud',
			children: [
				'/dqit-cloud-doc/01_start.md',
				'/dqit-cloud-doc/02_xxx.md'
			],
		},
	],
	'/daily/': [
		{
			text: '日常',
			children: ['/other/daily/01_start.md'],
		},
	],
	'/k8s/': [
		{
			text: 'Kubernetes',
			children: ['/k8s/01_start.md', '/k8s/02_buildCluster.md'],
		}
	],
	'/other/': [
		{
			text: '其他',
			children: [
				'/other/01_start.md',
				{
					text: '日常',
					children: ['/other/daily/01_start.md'],
				},
			],
		},
	]

}
