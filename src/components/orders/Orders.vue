<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片区域 -->
		<el-card>
			<!-- 搜素与添加区域    gutter列之间的间隔 -->
			<el-row :gutter="30">
				<el-col :span="8">
					<!--  clearable给输入框加一个清空X @clear点击清空重新加载getOdrderList方法  有的订单是没有参数的 -->
					<el-input placeholder="请输入订单编号(完整的)" v-model="queryInfo.query" clearable @clear="getOdrderList">
						<el-button slot="append" icon="el-icon-search" @click="getOdrderList"></el-button>
					</el-input>
				</el-col>
			</el-row>
			<!-- 订单列表表格区域 -->
			<!-- data表单数据来源对象 border边框  stripe隔行变色 expand扩展列-->
			<el-table :data="ordersList" border stripe @expand-change="getOrderDetail">
				<el-table-column label="明细" type="expand">
					<!-- 订单下的商品列表展示  -->
					<!-- 自定义模板 使用作用域插槽 -->
					<template slot-scope="ordersList">
						<el-table :data="ordersList.row.detail" border stripe>
							<el-table-column label="封面" width="100px" header-align="center" align="center">
								<!-- 自定义模板 使用作用域插槽定义封面 -->
								<template slot-scope="sc">
									<!-- 实现图片经过点击放大效果 -->
									<!-- placement出现的位置  trigger触发时机 -->
									<el-popover placement="top-start" trigger="hover">
										<!-- <el-button slot="reference">hover 激活</el-button> -->
										<img :src="sc.row.url" style="width:150px;height: 150px;">
										<img :src="sc.row.url" slot="reference" style="width: 50px; height: 50px;">
									</el-popover>
								</template>
							</el-table-column>
							<!-- 商品名称 -->
							<el-table-column label="商品名称" prop="goods_name"></el-table-column>
							<el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
							<el-table-column label="商品数量" prop="goods_number" width="100px"></el-table-column>
							<el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
							<el-table-column label="总价(元)" prop="goods_total_price" width="100px"></el-table-column>
						</el-table>
					</template>
				</el-table-column>
				<el-table-column label="序号" type="index"></el-table-column>
				<el-table-column label="订单编号" prop="order_number"></el-table-column>
				<el-table-column label="订单价格(元)" prop="order_price"></el-table-column>
				<el-table-column label="是否付款">
					<!-- 自定义模板 使使用作用域插槽 -->
					<template slot-scope="ordersList">
						<el-tag effect="dark" size="mini" type="success" v-if="ordersList.row.pay_status === '1' ">
							已付款
						</el-tag>
						<el-tag effect="dark" size="mini" type="danger" v-else>
							未付款
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="是否发货" prop="is_send"></el-table-column>
				<el-table-column label="下单时间" prop="create_time"></el-table-column>
				<el-table-column label="操作">
					<!-- 自定义模板 使使用作用域插槽 -->
					<template slot-scope="ordersList">
						<el-tooltip effect="dark" content="修改收货地址" placement="top" :enterable="false">
							<el-button type="primary" size="mini" icon="el-icon-edit"
								@click="showAddressDialog(ordersList.row.order_id)">
							</el-button>
						</el-tooltip>
						<el-tooltip effect="dark" content="查看物流信息" placement="top" :enterable="false">
							<el-button type="warning" size="mini" icon="el-icon-location" @click="showProgressDialog">
							</el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<!-- @size-change分页大小的改变 current-change页码大小的改变  total总数-->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[5, 10,15]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
			<!-- ********* -->
		</el-card>
		<!-- 修改收货地址的对话框 -->
		<el-dialog title="修改收货地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
			<el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
				<!-- 表单 -->
				<el-form-item label="省市区/县" prop="address1">
					<!-- 级联选择器 -->
					<el-cascader v-model="addressForm.address1" :options="cityData"></el-cascader>
				</el-form-item>
				<el-form-item label="详细地址" prop="address2">
					<el-input v-model="addressForm.address2"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addressVisible = false">取 消</el-button>
				<el-button type="primary" @click="editAddress">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 物流进度的对话框 -->
		<el-dialog title="修改收货地址" :visible.sync="progressVisible" width="50%">
			<!-- 物流基地时间线 -->
			<el-timeline>
				<el-timeline-item v-for="(activity, index) in progressinfo" :key="index" :timestamp="activity.time">
					{{activity.context}}
				</el-timeline-item>
			</el-timeline>
		</el-dialog>


		<!-- ********** -->
	</div>
</template>

<script>
	import cityData from './citydata'
	export default {
		//数据仓库
		data() {
			return {
				//查询用户列表的参数对象
				queryInfo: {
					query: '',
					pagenum: 1, //页码
					pagesize: 5, //页大小
				},
				//获取到的订单列表数据
				ordersList: [],
				//订单的总数量
				total: 0,
				//定义修改地址的对话框显示与隐藏
				addressVisible: false,
				//收货地址的省市区
				cityData,
				//修改收货地址的表单对象
				addressForm: {
					address1: [],
					address2: '',
				},
				//修改收货地址的表单效验规则
				addressFormRules: {
					address1: [{
						required: true,
						message: '请选择省市区/县',
						trigger: 'blur'
					}, ],
					address2: [{
						required: true,
						message: '请输入详细地址',
						trigger: 'blur'
					}, ],
				},
				//订单编号
				order_id: null,
				//定义物流进度对话框的显示于隐藏
				progressVisible: false,
				//存储物流进度信息
				progressinfo: [],
				//****
			}
		},
		//生命周期钩子函数,created函数中调用ajax获取页面初始化所需的数据
		created() {
			this.getOdrderList()
		},
		//*****
		methods: {
			async getOdrderList() {
				const {
					data: res
				} = await this.$http.get('orders', {
					params: this.queryInfo,
				})
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取订单列表失败')
				}
				//要从取到的数据中的create_time时间从秒转换成年月日时分秒  forEach循环
				res.data.goods.forEach(item => {
					item.create_time = this.$utils.formatToTime(item
						.create_time) //$utils前面定义的libs/utils ,formatToTime格式化时间
					//为订单明细对象添加detail字段属性
					item.detail = []
				})

				this.ordersList = res.data.goods
				this.total = res.data.total
				//console.log(this.ordersList)
				//console.log(this.total)
			},
			//监听分页大小的改变
			handleSizeChange(pagesize) {
				this.queryInfo.pagesize = pagesize
				this.getOdrderList()
			},
			//监听当前页码大小的改变
			handleCurrentChange(pagenum) {
				this.queryInfo.pagenum = pagenum
				this.getOdrderList()
			},
			//获取明细订单详情
			async getOrderDetail(row) {
				//console.log(111)
				//console.log(row)
				const {
					data: res
				} = await this.$http.get(`orders/${row.order_id}`)
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取订单明细失败')
				}
				//detail已经在获取订单列表循环的时候定义detail数组
				row.detail = res.data.goods
				//console.log(row.detail)
				//获取d订单明细下的商品详情
				row.detail.forEach(async item => {
					const {
						data: res
					} = await this.$http.get(`goods/${item.goods_id}`)
					if (res.meta.status !== 200) {
						return this.$message.error('获取商品详情失败')
					}
					//console.log(res.data)
					//当数据没有被双向绑定的时候，我们就需要使用set了.既可以新增属性,又可以触发视图更新。
					this.$set(item, 'goods_name', res.data.goods_name) //为商品对象响应式的添加属性(商品名字)
					this.$set(item, 'goods_weight', res.data.goods_weight) //为商品对象响应式的添加属性(重量)
					this.$set(item, 'url', res.data.pics[0].pics_big_url) //为商品对象响应式的添加属性(图片)
				})
				//console.log(row)
			},
			// 监听修改地址对话框的关闭事件
			addressDialogClosed() {
				this.$refs.addressFormRef.resetFields() //resetFields退出弹窗时会销毁子组件的变量
			},
			//监听修改地址对话框的显示事件
			showAddressDialog(order_id) {
				this.order_id = order_id
				this.addressVisible = true
			},
			//点击修改收货地址对话框确定按钮
			editAddress() {
				this.$refs.addressFormRef.validate(async valid => {
					if (!valid) {
						return
					}
					const {
						data: res
					} = await this.$http.put(`orders/${this.order_id}/address`, {
						//要变成字符串，通过以逗号进行分割,再加上详细地址
						consignee_addr: this.addressForm.address1.join(',') + ',' + this.addressForm
							.address2
					})
					//console.log(res)
					if (res.meta.status !== 200) {
						return this.$message.error('修改收货地址失败')
					}
					this.addressVisible = false
					this.getOdrderList()
					this.$message.success('修改收货地址成功')
				})
			},
			//显示物流进度对话框
			async showProgressDialog() {
				//物流信息是固定的
				const {
					data: res
				} = await this.$http.get('/kuaidi/815294206237577')
				if (res.meta.status !== 200) {
					return this.$message.error('获取物流进度失败')
				}
				//console.log(res.data)
				this.progressinfo = res.data
				this.progressVisible = true
			},
			//****
			//****
		},
		//*****
	}
</script>

<style lang="less" scoped>
	.el-cascader {
		width: 100%;
	}
</style>
