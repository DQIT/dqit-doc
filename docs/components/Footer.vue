<template>
	<div class="footer" :style="location">
		<div></div>
		<div class="footer-row">
			<div>
				MIT Licensed | Copyright © 2022 一笔清泉字
			</div>
		</div>
		<div class="footer-row">
			<div>
				<a href="https://beian.miit.gov.cn/" target="_blank">
					皖ICP备2022004461号-1
				</a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Footer",
	data() {
		return{
			location: ""
		}
	},
	methods: {
		initLocation(){
			let windowHeight = document.documentElement.clientHeight
			let pageHeight = document.body.scrollHeight
			if (pageHeight <= windowHeight) {
				const offset = windowHeight - pageHeight
				this.location = "margin-top: " + offset + "px"
			}
		}
	},
	mounted() {
		setTimeout(this.initLocation, 0)
	}
}
</script>

<style scoped>
.footer{
	width: 100%;
	padding: 5px;
	bottom: 0
}
.footer-row{
	display: flex;
	justify-content: center;
	line-height: 25px;
	margin-top: 10px;
}
</style>
