<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>欢迎页</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 数据统计区域 -->
		<el-row :gutter="10">
			<!-- 用户统计 -->
			<el-col :span="6">
				<div class="statistics" style="background-color: #409eff;">
					<div class="totle">
						<p>用户统计</p>
						<el-tag size="mini" type="success">实时</el-tag>
					</div>
					<div class="num">{{totalUsers}}</div>
					<div class="tip">当前总用户数量</div>
				</div>
			</el-col>
			<!-- ***** -->
			<!-- 商品统计 -->
			<el-col :span="6">
				<div class="statistics" style="background-color: #E6A23C;">
					<div class="totle">
						<p>商品统计</p>
						<el-tag size="mini" type="info">实时</el-tag>
					</div>
					<div class="num">{{totalGoods}}</div>
					<div class="tip">当前总商品数量</div>
				</div>
			</el-col>
			<!-- ***** -->
			<!-- 订单统计 -->
			<el-col :span="6">
				<div class="statistics" style="background-color: #67C23a">
					<div class="totle">
						<p>订单统计</p>
						<el-tag size="mini" type="warning">实时</el-tag>
					</div>
					<div class="num">{{totalOrders}}</div>
					<div class="tip">当前总订单数量</div>
				</div>
			</el-col>
			<!-- ***** -->
			<!-- 销售统计 -->
			<el-col :span="6">
				<div class="statistics" style="background-color: #909399;">
					<div class="totle">
						<p>销售统计</p>
						<el-tag size="mini" type="success">实时</el-tag>
					</div>
					<div class="num">{{totalSales}}</div>
					<div class="tip">当前总销售额(元)</div>
				</div>
			</el-col>
			<!-- ***** -->
		</el-row>
		<!-- echarts可视化库图表 -->
		<div class="echarts-container">
			<el-card id="chart1"></el-card>
			<el-card id="chart2"></el-card>
		</div>
		<!-- ****** -->
	</div>
</template>

<script>
	//导入第三方依赖echarts，用于显示图形 
	//import echarts from 'echarts'   这样写会报错，官网中更新的写法
	import * as echarts from 'echarts'

	export default {
		//数据仓库
		data() {
			return {
				//总的用户数量
				totalUsers: 0,
				//总的商品数量
				totalGoods: 0,
				//总的订单数量
				totalOrders: 0,
				//订单所有的列表
				orderList: [],
				//总的销售额
				totalSales: 0,
				//****
			}
		},
		//生命周期钩子函数,created函数中调用ajax获取页面初始化所需的数据
		created() {
			this.getUserList() //用户列表
			this.getGoodsList() //商品列表
			this.getOrderList() //订单列表
		},
		//******
		methods: {
			//获取用户总数量
			async getUserList() {
				const {
					data: res
				} = await this.$http.get('users', {
					params: {
						pagenum: 1,
						pagesize: 1,
					}
				})
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取用户数据失败')
				}
				this.totalUsers = res.data.total
			},
			//获取商品总数量
			async getGoodsList() {
				const {
					data: res
				} = await this.$http.get('goods', {
					params: {
						pagenum: 1,
						pagesize: 1,
					}
				})
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取商品数据失败')
				}
				this.totalGoods = res.data.total
			},
			//获取订单总数量
			async getOrderList() {
				const {
					data: res
				} = await this.$http.get('orders')
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取商品数据失败')
				}
				//console.log(res)
				this.totalOrders = res.data.total
				//计算总销售额   把用户列表赋值给数据仓库数组
				this.orderList = res.data.goods
				//循环数组
				this.orderList.forEach(item => {
					//判断pay_status是否等于1    1=已支付  0=未支付
					if (item.pay_status === '1') {
						//totalSales商品总销售额   等于order_price销售额加起来 
						this.totalSales += item.order_price
					}
				})
				//展示图表
				this.initChart1()
				this.initChart2()
			},
			//初始化图表1
			initChart1() {
				//创建echarts图表实例  图表要显示在哪里
				var chart1 = echarts.init(document.getElementById('chart1'))
				//echarts配置项   option配置对象
				var option = {
					//title图表标题
					title: {
						text: '订单趋势',
					},
					//提示
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'line',
						},
					},
					//X轴
					xAxis: {
						type: 'category',
						data: [],
					},
					//y轴
					yAxis: {
						type: 'value', //value
						// axisLine: {show:false},
						// axisTick: {show:false},
						data: [200, 400, 600, 800],
					},
					series: [{
						type: 'line',
						smooth: true,
						data: [],
					}, ],
				}
				//console.log(this.orderList)
				//对数据进行处理
				//升序排列   sort排序功能
				this.orderList.sort(function(a, b) {
					return a.create_time - b.create_time
				})
				//定义 一个数组存储需要展示的时间以及金额   获取日期及订单总额
				let data = []
				//循环
				this.orderList.forEach(item => {
					//判断是否支付
					if (item.pay_status === '1') {
						//调用libs/utils下的formatToDate方法 转换成年月日，并传入要转换的时间
						let key = this.$utils.formatToDate(item.create_time)
						//判断当前日期的订单是否在数组中以及存在   如果存在就加起来
						if (!data[key]) {
							data[key] = item.order_price
							//else表示 当前订单已经存在   将金额加起来
						} else {
							data[key] += item.order_price
						}

					}
				})
				//console.log(data)
				//将 数据添加到option中
				for (var key in data) {
					option.xAxis.data.push(key)
					option.series[0].data.push(data[key])
				}
				//调用图表   setOption异步加载数据
				chart1.setOption(option)
			},
			//初始化图表2
			initChart2() {
				//创建echarts图表实例  图表要显示在哪里
				var chart2 = echarts.init(document.getElementById('chart2'))

				// 订单状态
				var option = {
					//标题
					title: {
						text: '订单状态',
					},
					//提示
					tooltip: {
						trigger: 'item',
						formatter: '{b} : {c} ({d}%)',
					},
					legend: {
						orient: 'vertical',
						left: 'right',
						data: [],
					},
					series: [{
						name: '订单状态',
						type: 'pie',
						radius: '55%',
						center: ['50%', '60%'],
						// data: [
						//     {value: 335, name: '直接访问'},
						//     {value: 310, name: '邮件营销'},
						//     {value: 234, name: '联盟广告'},
						//     {value: 135, name: '视频广告'},
						//     {value: 1548, name: '搜索引擎'}
						// ],
						data: [],
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)',
							},
						},
					}, ],
				}
				// 对数据 进行处理
				var data = [{
						name: '已付款',
						value: 0,
					},
					{
						name: '未付款',
						value: 0,
					},
				]
				//获取已付款的有多少  未付款的有多少
				this.orderList.forEach(item => {
					//判断订单状态
					if (item.pay_status === '1') {
						//如果等于1   则data里的第一个数据里面的已付款value自增 
						data[0].value++
					} else {
						//如果等于0   则data里的第一个数据里面的未付款value自增
						data[1].value++
					}
				})
				//console.log(data)
				//循环赋值
				for (var item of data) {
					option.legend.data.push(item.name)
					option.series[0].data.push(item)
				}
				//*****
				chart2.setOption(option)
			},
			//****
			//****
		},
		//*****
	}
</script>

<style lang="less" scoped>
	.el-row {
		padding: 0 9px;

		.statistics {
			color: white;
			height: 100px;
			border-radius: 5px;
			padding: 0 10px;

			.totle {
				display: flex; //浮动布局
				justify-content: space-between; //水平对齐方式，两边对齐
				align-items: center; //灵活容器内的各项的默认对齐方式，位于容器的中心。

				p {
					font-size: 15px;
					font-weight: bold; //加粗
				}
			}

			.num {
				font-size: 20px;
				font-weight: bold; //加粗
				text-align: center; //文字居中
			}

			.tip {
				font-size: 12px;
			}

		}
	}

	.echarts-container {
		display: flex;
		justify-content: space-between; //水平对齐方式，两边对齐
		margin-top: 10px;

		.el-card {
			height: 400px;
			width: 50%;
			margin: 0 10px;
			padding: 20px;
		}
	}
</style>
