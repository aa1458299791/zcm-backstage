import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入动画vue-particles实现背景粒子酷炫效果
import VueParticles from 'vue-particles'
Vue.use(VueParticles)

//导入第三方依赖nprogress进度条
import  NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//导入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入axios
import axios from 'axios'
//全局注册第三方表格组件商品分类树形表格
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)
//把utils.js工具库导入
import utils from './libs/utils.js'
//******导入富文本编辑器-先安装vue-qull-editor依赖
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor)
//挂载
Vue.prototype.$utils = utils
//给axios一个默认地址
axios.defaults.baseURL = 'http://www.tangxiaoyang.vip:8888/api/v2/'
//拦截所有请求，为请求头添加token认证,interceptors=拦截器
axios.interceptors.request.use(config => {
	//当发起请求是开启进度条
	NProgress.start()
	//console.log(config)
	const userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
	//                             源代码 =userinfo.data.token，因为第一次登陆没有userinfo得信息，所以需要做一个判断
	config.headers.Authorization = userinfo ? userinfo.data.token : ''
	return config
})
//什么时候停止进度条
axios.interceptors.response.use(config => {
	//响应时结束进度条
	NProgress.done()
	return config
})

Vue.prototype.$http = axios
// event Bus 用于无关系组件间的通信。
//Vue.prototype.$bus = new Vue()

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
