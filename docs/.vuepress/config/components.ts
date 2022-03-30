import {PluginConfig, PluginOptions} from "vuepress";
import {path} from "@vuepress/utils";

//组件注册
export const components: PluginConfig = () => [
	'@vuepress/register-components',
	{
		componentsDir: path.resolve(__dirname, '../components'),
	},
]

