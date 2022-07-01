<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片区域 -->
		<el-card>
			<!-- 从data中的rightslist数组中获取数据   border边框 stripe=隔行变色  -->
			<el-table :data="rightslist" border stripe >
				<el-table-column label="序号" type="index"></el-table-column>
				<el-table-column label="权限名称" prop="authName"></el-table-column>
				<el-table-column label="路径" prop="path"></el-table-column>
				<el-table-column label="权限等级">
					<!-- 权限等级需要用作用域插槽来实现 -->
					<template slot-scope="rightslist">
						<!-- 需要对level属性进行判定，等于则显示 不等于则隐藏 -->
						<el-tag v-if="rightslist.row.level === '0'  ">一级</el-tag>
						<el-tag type="success" v-else-if="rightslist.row.level === '1'">二级</el-tag>
						<el-tag type="warning"  v-else>三级</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 分页区域 -->
		<!-- @size-change每一页大小的改变  @current-change页码改变跳转的页面 current-page=当前页码  page-sizes用户可以选择多少条一页 page-size当前显示多少条 layout分页布局样式-->
		<!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="queryInfo.pagenum" :page-sizes="[1, 5,10]" :page-size="queryInfo.pagesize"
			layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination> -->
		<!-- **** -->
	</div>
</template>

<script>
	export default {
		data(){
			return {
				//d定义一个变量用于储存getRightsList方法获取的后台用户列表 数据
				rightslist:[],
			}
		},
		//生命周期钩子函数,created函数中调用ajax获取页面初始化所需的数据
		created(){
			this.getRightsList()
		},
		// ***
		methods:{
			//定义获取用户权限列表
			async getRightsList(){
				//
				const {data:res} = await this.$http.get('rights/list')
				//console.log(res)
				if(res.meta.status !== 200) {
					return this.$message.error('获取用户权限列表失败')
				}
				this.rightslist = res.data
				//console.log(this.rightslist)
			},
			// ***
		},
		//***
	}
</script>

<style lang="less" scoped>
	
</style>
