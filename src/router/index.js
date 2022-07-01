import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/home',
		//定义一个懒加载
		component: () => import('../components/Home.vue'),
		//配置一个路由的跳转
		redirect: '/welcome',
		children: [
			//定义嵌套组件，路由
			{
				path: '/welcome',
				component:() => import('../components/index/welcome.vue')
			},
			//定义users页面   用户列表页面
			{
				path: '/users',
				component:() => import('../components/user/users.vue')
			},
			//定义Rights页面，用户权限列表页面
			{
				path: '/rights',
				component:() => import('../components/power/Rights.vue')
			},
			//定义Roles页面，用户角色列表页面
			{
				path: '/roles',
				component:() => import('../components/power/Roles.vue')
			},
			//定义categories页面，商品分类页面
			{
				path: '/categories',
				component:() => import('../components/goods/Cate.vue')
			},
			//定义categories页面，分类参数页面
			{
				path: '/params',
				component:() => import('../components/goods/Params.vue')
			},
			//定义categories页面，商品列表页面
			{
				path: '/goods',
				component:() => import('../components/goods/List.vue')
			},
			//定义categories页面，商品列表页面
			{
				path: '/goods/add',
				component:() => import('../components/goods/Add.vue')
			},
			//定义categories页面，商品列表页面
			{
				path: '/goods/edit',
				component:() => import('../components/goods/Edit.vue')
			},
			//定义categories页面，订单列表页面
			{
				path: '/orders',
				component:() => import('../components/orders/Orders.vue')
			},
		]
	}
]

const router = new VueRouter({
	routes
})

//配置路由守卫      第一个参数去往目标路由对象，第二个参数是来源的路由对象，第三个参数是接下来执行的操作
router.beforeEach((to, form, next) => {
	//如果访问登录页，则放行
	if (to.path === '/login') {
		return next()
	} //如果用户未登录，则跳转到/login
	const userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
	if (!userinfo) {
		return next('/login')
	}
	//如果用户已登录，则放行
	next()
})

export default router
