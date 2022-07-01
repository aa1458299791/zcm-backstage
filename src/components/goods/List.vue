<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<!-- 搜素与添加区域    gutter列之间的间隔 -->
			<el-row :gutter="30">
				<el-col :span="8">
					<!--  clearable给输入框加一个清空X @clear点击清空重新加载getUserList方法-->
					<el-input placeholder="请输入商品的名称" class="input-with-select" v-model="queryInfo.query" clearable @clear="getGoodsList">
						<el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="goAddpage">
						添加商品
					</el-button>
				</el-col>
			</el-row>
			<!-- 商品展示列表 -->
			<el-table :data="goodsList" border stripe>
				<el-table-column label="序号" type="index"></el-table-column>
				<el-table-column label="商品名称" prop="goods_name"></el-table-column>
				<el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
				<el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
				<el-table-column label="创建时间" prop="add_time" width="150px"></el-table-column>
				<el-table-column label="操作" width="130px">
					<!-- 自定义模板  作用域插槽 -->
					<template slot-scope="goodsList">
						<el-button size="mini" type="primary" icon="el-icon-edit" @click="goEditpage(goodsList.row.goods_id)"> </el-button>
						<el-button size="mini" type="danger" icon="el-icon-delete" @click="removeByid(goodsList.row.goods_id)"> </el-button>
					</template>
				</el-table-column>

			</el-table>
			<!-- 底部分页 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[10, 20, 30]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 10,
				},
				//定义获取到的商品列表数据
				goodsList: [],
				//总记录数
				total: 0,
			}
		},
		//生命周期钩子函数,created函数中调用ajax获取页面初始化所需的数据
		created() {
			this.getGoodsList()
		},
		methods: {
			//页面初始化，获取商品列表
			async getGoodsList() {
				//向后台发送获取数据请求
				const {
					data: res
				} = await this.$http.get('goods', {
					params: this.queryInfo
				})
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取商品列表失败')
				}
				//取出获得的商品创建时间
				for (let item of res.data.goods) {
					//调用$utils组件下的formatToTime方发并且 传入当前要转换的时间
					item.add_time = this.$utils.formatToTime(item.add_time)
				}
				//console.log(res.data)
				//赋值
				this.goodsList = res.data.goods
				this.total = res.data.total
				//console.log(this.goodsList)
				//console.log(this.total)
			},
			//监听页面大小的改变
			handleSizeChange(pagesize){
				//把用户改变的页面大小跟后台给的数据绑定
				this.queryInfo.pagesize = pagesize
				this.getGoodsList()
			},
			//监听当前页码的改变
			handleCurrentChange(pagenum){
				//把用户改变的页码大小跟后台给的数据绑定
				this.queryInfo.pagenum = pagenum
				this.getGoodsList()
			},
			//根据id删除商品
			removeByid(id){
				this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(async() => {
							//向后台发送删除商品请求
				          const {data:res} = await this.$http.delete(`goods/${id}`)
						  //console.log(res)
						  //判断
						  if(res.meta.status !==200){
							  return this.$message.error('删除商品失败')
						  }
						  //成功后刷新商品列表
						  this.getGoodsList()
						  //提示
						  this.$message.success('删除商品成功')
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			},
			//点击添加商品，跳转页面
			goAddpage(){
				//路由跳转
				this.$router.push('/goods/add')
			},
			//点击编辑按钮，使用编程式导航跳转到商品修改页面
			goEditpage(id){
				this.$router.push('/goods/edit?id='+id)
			},
			//****
			//*****
		},
		//*****
	}
</script>

<style>

</style>
