<template>
	<el-container>
		<!-- 头部 -->
		<el-header>
			<div class="left">
				<img src="../assets/imgs/shop.png" >
				<span>
					电商后台管理系统-Z-C-M
				</span>
			</div>
			<div class="right">
				<span>欢迎您: {{ userinfo.data.username }} </span>
				<el-button type="danger" size="mini" @click="logout">退出</el-button>
			</div>
		</el-header>
		<el-container>
			<!-- 侧边栏       给宽度活起来，定义iscollapse如果等于ture 就是64px   否则就是200px            -->
			<el-aside :width="iscollapse ? '64px' : '200px'">
				<!-- 切换菜单的折叠显示 -->
				<div class="toggle-button"  @click="iscollapse=!iscollapse">
					<span class="el-icon-s-operation"></span>
				</div>
				<!-- 侧边栏菜单               vue-router 是 vue.js 官方的路由管理器   path是后台传输的数据         -->
				<el-menu :default-active=" $route.path " unique-opened router :collapse="iscollapse"  :collapse-transition="false">
					<!--              定义一个活动数值，这个属性规定要数值 类型       -->
					<el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id" id="a1">
						<!-- 一级菜单 -->
						<template slot="title">
							<i :class="iconobj[item.id]"></i>
							<span>&nbsp; {{ item.authName}}</span>
						</template>
						<!-- <el-submenu index="1-4"> -->
						<!-- 二级菜单 -->
						<!-- <template slot="title">选项4</template> -->
						<!-- 三级菜单               path是后台数据自带的数据名         -->
						<el-menu-item :index=" '/' + subitem.path" v-for="subitem in item.children" :key="subitem.id">
							<i class="el-icon-menu"></i>
							{{ subitem.authName }}
						</el-menu-item>
					</el-submenu>
					</el-submenu>
				</el-menu>
			</el-aside>
			<!-- 主体区域 -->
			<el-main>
				<!-- 定义首页-》欢迎页的地址组件 -->
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		data() {
			return {
				//存储用户信息对象
				userinfo: null,
				//左侧菜单列表
				menulist: [],
				//图标样式
				iconobj: {
					'201': 'iconfont icon-shouye',
					'125': 'iconfont icon-users',
					'103': 'iconfont icon-tijikongjian',
					'101': 'iconfont icon-shangpin',
					'102': 'iconfont icon-danju',
				},
				//定义折叠菜单,是否折叠
				iscollapse:false,
			}
		},
		//生命周期钩子函数,可以在created函数中调用ajax获取页面初始化所需的数据。”
		created() {
			this.userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
			this.getMenuList()
		},
		methods: {
			//退出
			logout() {
				this.$confirm('确定要退出登录吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// this.$message({
					// 	type: 'success',
					// 	message: '退出成功!')};
					//清除用户信息
					sessionStorage.clear()
					this.$router.push('/login')
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消退出'
					});
				});
			},
			//获取左侧边栏
			async getMenuList() {
				const {
					data: res
				} = await this.$http.get('menus')
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error(res.meta.msg)
				}
				this.menulist = res.data
				//console.log(this.menulist)
			}
		},
	};
</script>

<style lang="less" scoped>
	.el-container {
		height: 100%;
	}

	//头部
	.el-header {
		//background: url(../assets/imgs/header_bg.gif) repeat-x center; //为文档规定一幅背景图像水平或垂直平铺
		background-color: rgb(#182B3A);
		height: 50px !important; //更改默认的CSS样式优先级。
		display: flex;
		justify-content: space-between; //最左边的元素靠左对齐,最右边的元素靠右对齐,除了这两个头尾元素之外其他的元素保持等距的间隔
		align-items: center; //垂直方向上的对齐方式,居中
		color: white;

		.left {
			display: flex;
			align-items: center;

			img {
				width: 40px;
				margin-right: 20px;
			}

			span {
				font-size: 30px;
			}
		}

		.right {
			span {
				margin-right: 30px;
			}
		}
	}
	//侧边栏
	.el-aside{
		.el-menu{
			border: 0;//给侧边栏加一个0边框，因为它自带1px边框
		}
		.toggle-button{
			background-color: rgb(#ffaaff);
			cursor: pointer;//当鼠标移动到元素上，变成手掌
			border-radius: 20px;//圆角
			.el-icon-s-operation{
				line-height: 24px;
				margin-left: 40%;
				font-size: 25px;
			}
		}
	}
	//主体
	.el-main{
		background:rgb(#fde2ff);
	}
</style>
