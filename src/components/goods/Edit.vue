<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>修改商品</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<!-- 提示信息 -->
			<el-alert title="修改商品信息" type="info" show-icon :closable="false" center=""></el-alert>
			<!-- 步骤条 -->
			<!-- activeindex - 0把字符串转化为数值 -->
			<el-steps :active="activeindex - 0" finish-status="success" align-center="" :space="200">
				<el-step title="基本信息"></el-step>
				<el-step title="商品参数"></el-step>
				<el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>
			<!-- 标签页 -->
			<el-form :model="editForm" :rules="editrules" ref="editruleFormref" label-width="100px" label-position="top">
				<!-- before-leave监tag标签页的改变    @tab-click tab 被选中时触发 -->
				<el-tabs v-model="activeindex" tab-position="left" :before-leave="befpreTableave"
					@tab-click="tabCliked">
					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="editForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
							<!-- .number只能输入数字 -->
							<el-input v-model="editForm.goods_price"></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
							<el-input v-model="editForm.goods_weight"></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
							<el-input v-model.numbe="editForm.goods_number"></el-input>
						</el-form-item>
						<el-form-item label="商品分类" prop="goods_cat">
							<!-- options数据来源对象  props配置对象-->
							<el-cascader v-model="editForm.goods_cat" :options="cateList" :props="csaacderprops"
								@change="handleChange"></el-cascader>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name="1">
						<el-form-item v-for="item in manyData" :label="item.attr_name" :key="item.attr_id">
							<el-checkbox-group v-model="item.attr_vals">
								<el-checkbox label="复选框 A" v-for="(value,i) in item.attr_vals" :key="i" :label="value"
									border></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品属性" name="2">
						<el-form-item v-for="item  in onlyData" :key="item.attr_id" :label="item.attr_name">
							<el-input v-model="item.attr_vals"></el-input>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品图片" name="3">
						<!-- 图片上传 -->
						<!--  action指定图片上传服务器的API地址 on-preview指定预览图片时执行的回调
						 on-remove指定移除图片时触发  file-list可选择额的文件列表   list-type上传的样式
						 headers设置上传的请求头部	on-success文件上传时的钩子方法-->
						<el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
							list-type="picture" :headers="headerObj" :on-success="handlesuccess" :file-list="fileList">
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-tab-pane>
					<el-tab-pane label="商品内容" name="4">
						<!-- 第三方依赖富文本编辑器vue-qull-editor依赖 -->
						<quill-editor v-model="editForm.goods_introduce" />
						<!-- 添加按钮 -->
						<el-button type="primary" class="btn-edit" @click="editGoods()">修改商品</el-button>
						<!-- ***** -->

					</el-tab-pane>
				</el-tabs>
			</el-form>
			<!-- ***** -->
		</el-card>
		<!-- 图片预览对话框 -->
		<el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
			<img :src="previewPath" class="preview-img">
		</el-dialog>

		<!-- *********** -->
		</el-breadcrumb>
	</div>
</template>

<script>
	//导入第三方依赖lodash  用于深拷贝
	import _ from 'lodash'
	export default {
		data() {
			return {
				//定义当前激活的步骤条
				activeindex: '0',
				//添加商品的表单对象
				editForm: {
					goods_name: '', //商品名称
					goods_price: null, //价格
					goods_weight: null, //重量
					goods_number: null, //数量
					//商品所属分类的数组
					goods_cat: [],
					//图片的数组
					pics: [],
					//商品内容（用户输入的数据）
					goods_introduce: '',
					//商品的分类数据，静态还是动态
					attrs: [],
				},
				//添加商品的表单效验规则
				editrules: {
					goods_name: [{
							required: true,
							message: '请输入商品名称',
							trigger: 'blur'
						},
						{
							min: 0,
							max: 30,
							message: '长度在 0 到 30 个字符',
							trigger: 'blur'
						}
					],
					goods_price: [{
							required: true,
							message: '请输入商品价格',
							trigger: 'blur'
						},
						{
							min: 0,
							max: 10,
							message: '长度在 0 到 10 个字符',
							trigger: 'blur'
						}
					],
					goods_weight: [{
							required: true,
							message: '请输入商品重量',
							trigger: 'blur'
						},
						{
							min: 0,
							max: 10,
							message: '长度在 0 到 10 个字符',
							trigger: 'blur'
						}
					],
					goods_number: [{
							required: true,
							message: '请输入商品数量',
							trigger: 'blur'
						},
						{
							min: 0,
							max: 30,
							message: '长度在 0 到 30 个字符',
							trigger: 'blur'
						}
					],
				},
				//获取到的商品分类列表
				cateList: [],
				//级联选择器的配置
				csaacderprops: {
					label: 'cat_name', //当前名字
					value: 'cat_id', //当前id
					children: 'children', //下一级目录
					expandTrigger: 'hover', //什么时候触发
				},
				//存储三级分类下的动态参数
				manyData: [],
				//存储三级分类下的静态属性
				onlyData: [],
				//上传图片的URL地址
				uploadURL: 'http://www.tangxiaoyang.vip:8888/api/v2/upload',
				//文件上传时的请求头   --token存在userinfo.data.token里面的
				headerObj: {
					Authorization: JSON.parse(sessionStorage.getItem('userinfo')).data.token //获取token作为唯一标识
				},
				//定义预览图片的对话框显示与隐藏
				previewVisible: false,
				//预览图片的url地址
				previewPath: '',
				//定义商品图片的显示
				fileList:[],
				//*****
			}
		},
		//生命周期钩子函数,created函数中调用ajax获取页面初始化所需的数据
		created() {
			this.getGoodsByid()
			this.getCateList()
		},
		methods: {
			//根据用户所点击修改的商品id获取商品信息 
			async getGoodsByid(){
				//发送获取商品信息请求，携带从上一个页面所传过来的参数id
				 const {data:res} = await this.$http.get(`goods/${this.$route.query.id}`)
				 //console.log(res)
				 if(res.meta.status !==200){
					 return this.$message.error('获取商品信息失败')
				 }
				 //对获取到的商品分类数据进行处理，把获取到的以逗号隔开的字符串转换为数组   
				  //split字符串以逗号为界限切割为数组
				 res.data.goods_cat = res.data.goods_cat.split(',').map(item => {
					 return item * 1 //对获取到以逗号分隔的字符串数组在进行循环处理，把每个字符串X1就转化成数值了
				 })
				 //对商品图片显示数据进行处理，转化为数组    forEach遍历数组,需要有一个回调函数作为参数
				 res.data.pics.forEach(item => {
					 this.fileList.push({
						 name:item.pics_id,
						 url:item.pics_big_url.replace('127.0.0.1','www.tangxiaoyang.vip'),//replace用于匹配指定的字符串并替换，或者替换跳转时的记录
					     tmp_path:item.pics_big,//把临时路径放进来，这样删除的时候就不会报错
					 })
					 //要想对图片进行修改删除，先把pics_big转换成后台接口所需要的pic，然后给这个数组加上去
					 item.pic = item.pics_big
				 })
				 this.editForm = res.data
				 //console.log(this.editForm)
			},
			//获取分类列表
			async getCateList() {
				const {
					data: res
				} = await this.$http.get('categories')
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取商品分类失败')
				}
				this.cateList = res.data
				//console.log(res)
			},
			//监听级联选择器改变回调
			handleChange() {
				//判断用户是否选择了三级分类
				if (this.editForm.goods_cat.length !== 3) {
					//当数组不等3时，重置选择器
					this.editForm.goods_cat = []
				}
			},
			//tabs切换之I前触发
			//接收去往的标签页和当前标签页
			befpreTableave(activeName, oldActiveName) {
				//判断用户是否选择了商品三级分类，没有选择就提示,并强制不能跳转
				if (this.editForm.goods_cat.length !== 3) {
					this.$message.error('请先选择商品的三级分类')
					return false
				}
			},
			//当标签页切换选中的时候执行
			async tabCliked() {
				//需要判断 是不是选择了动态参数还是静态属性
				//activeindex=1 说明选择了商品参数页面
				if (this.activeindex === '1') {
					//获取分类的id        携带三级分类id  和静态属性还是动态参数
					const {
						data: res
					} = await this.$http.get(`categories/${this.catId}/attributes`, {
						params: {
							sel: 'many'
						} //动态
					})
					//console.log(res)
					if (res.meta.status !== 200) {
						return this.$message.error('获取动态参数失败')
					}
					//forEach用于调用数组的每个元素，并将元素传递给回调函数     split 把一个数据拆分
					//把获取到的数据里面的attr_vals参数明细进行拆分，把空格去掉
					res.data.forEach(item => {
						//判断有没有这个明细，有的话，通过split进行拆分成数组  ，没有就返回空
						item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
					})
					console.log(res)
					this.manyData = res.data
				} else if (this.activeindex === '2') {
					//获取分类的id        携带三级分类id  和静态属性还是动态参数
					const {
						data: res
					} = await this.$http.get(`categories/${this.catId}/attributes`, {
						params: {
							sel: 'only'
						} //静态
					})
					//console.log(res)
					if (res.meta.status !== 200) {
						return this.$message.error('获取静态属性失败')
					}

					//console.log(res)
					this.onlyData = res.data
				}
			},
			//图片的预览
			handlePreview(file) {
				//console.log(file)
				//点击图片预览的时候控制对话框显示
				this.previewPath = file.url
				this.previewVisible = true
			},
			//移除图片
			handleRemove(file) {
				console.log(file)
				//console.log(this.editForm)
				//console.log(file.response.data.tmp_path)
				//获取将要删除的图片的临时地址
				const filePath =   file.tmp_path ||   file.response.data.tmp_path
				//从pics数组中，找到这个图片对应的索引值  findIndex为数组中的每个元素都调用一次函数的执行
				const i = this.editForm.pics.findIndex(item => {
					//如果等于则表示拿到这个数组的索引值
					item.pic === filePath
				})
				//从pics数组中移除 splice删除  （从i开始移除，移除一个）
				this.editForm.pics.splice(i, 1)
				console.log(this.editForm)
			},
			//图片上传成功
			handlesuccess(response) {
				//要往表单数据editForm.pics添加图片的临时地址  用于绑定
				this.editForm.pics.push({
					pic: response.data.tmp_path
				})
				console.log(this.editForm)
			},
			//修改商品按钮
			 async editGoods() {
				//验证用户输入的表单数据是否有误---调用validate插件判断验证
				// this.$refs.editruleFormref.validate(async valid => {
				// 	if (!valid) {
				// 		return
				// 	}
					//准备请求前的数据要符合后端接口要求
					//处理所选商品分类数组---将数组转换成以逗号分隔的字符串       join重组的意思，把数组合成一个字符串
					//this.editForm.goods_cat = this.editForm.goods_cat.join(',') //导致级联选择器关联的goos_cat发生异常
					//需要重新定义一个新的表单对象
					//const form = editForm  //浅拷贝 - 有关联
					//可以使用lodash工具 进行深拷贝
					const form = _.cloneDeep(this.editForm) //使用cloneDeep进行深拷贝
					form.goods_cat = form.goods_cat.join(',')
					//处理动态参数    forEach调用数组的每个元素， 并将元素传递给回调函数
					//console.log(this.manyData)
					this.manyData.forEach(item => {
						form.attrs.push({
							attr_id: item.attr_id,
							attr_value: item.attr_vals.join(' ') //取到的的数据是一个数组，要转化成以空格隔开的字符串
						})
					})
					//处理静态属性
					this.onlyData.forEach(item => {
						form.attrs.push({
							attr_id: item.attr_id,
							attr_value: item.attr_vals,
						})
					})
					//所有数据转化成后台接口规定的数据 ,发送请求,修改商品
					const {
						data: res
					} = await this.$http.put(`goods/${this.editForm.goods_id}`, form)
					//console.log(res)
					if(res.meta.status !==200) {
						return  this.$message.error('修改商品失败')
					}
					this.$message.success('修改商品成功')
					this.$router.push('/goods')
				// })
			}
			//*****
			//*****
		},
		//计算属性
		computed: {
			//判断三级分类
			catId() {
				//判断从后台获取的分类列表editForm里面的数组长度是不是等于3，如果是就返回数组的第三个元素 id，不是就返回空
				return this.editForm.goods_cat.length === 3 ? this.editForm.goods_cat[2] : null
			},
			//****
		},
		//*****
	}
</script>

<style lang="less" scoped>
	//复选框
	.el-checkbox {
		margin-right: 10px;
	}

	//预览图片显示的样式
	.preview-img {
		width: 100%;
	}

	//添加商品按钮
	.btn-edit {
		margin-top: 15px;
	}
</style>
