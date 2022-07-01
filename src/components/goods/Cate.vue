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
			<el-row>
				<el-col>
					<el-button type="primary" @click="xianshitiajiafenlei">添加分类</el-button>
				</el-col>
			</el-row>
			<!-- 使用main定义的tree-table第三方组件  树形表格 -->
			<!-- data从后台取到的数据对象 columns定义列的数据 selection-type取消复选框 expand-type取消下拉 show-index索引 -->
			<tree-table class="tree-table" :data="catelist" :columns="columns" :selection-type="false"
				:expand-type="false" :show-index="true" :border="true">
				<!-- 是否有效  -->
				<!-- 定义作用域插槽模板 -->
				<template slot="isok" slot-scope="catelist">
					<!-- 判断cat_deleted是true还是fales从而显示状态 -->
					<i class="el-icon-error" style="color:red" v-if="catelist.row.cat_deleted"></i>
					<i class="el-icon-success" style="color:lightgreen" v-else></i>
				</template>
				<!-- 定义排序 -->
				<!-- 定义作用域插槽模板 -->
				<template slot="order" slot-scope="catelist">
					<!-- 判断cat_level从而显示一、二、三 -->
					<el-tag size="mini" v-if="catelist.row.cat_level === 0">一级</el-tag>
					<el-tag size="mini" type="success" v-else-if="catelist.row.cat_level === 1">二级</el-tag>
					<el-tag size="mini" type="warning" v-else>三级</el-tag>
				</template>
				<!-- 定义操作 -->
				<!-- 定义作用域插槽模板 -->
				<template slot="operate" slot-scope="catelist">
					<el-button size="mini" type="primary" class="el-icon-edit"
						@click="showeditdialog(catelist.row.cat_id)">编辑</el-button>
					<el-button size="mini" type="danger" class="el-icon-delete"
						@click="removecatebyid(catelist.row.cat_id)">删除</el-button>
				</template>
			</tree-table>
			<!-- 分页 -->
			<!-- @size-change每一页大小的改变  @current-change页码改变跳转的页面 current-page=当前页码 
			 page-sizes用户可以选择多少条一页 page-size当前显示多少条 layout分页布局样式-->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[2, 5, 10, 15]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
			<!-- ******* -->
		</el-card>
		<!-- 添加分类对话框 -->
		<el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDidlog">
			<!-- 表单 -->
			<el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="100px">
				<el-form-item label="分类名称" prop="cat_name">
					<el-input v-model="addForm.cat_name"></el-input>
				</el-form-item>
				<el-form-item label="父级分类">
					<!-- v-model数据绑定 options数据来源 props配置选项   级联选择器-->
					<el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderPros"
						@change="handleChange" clearable></el-cascader>
				</el-form-item>
				<!-- **** -->
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addCate">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑分类对话框 -->
		<el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%" @close="editDidlog">
			<!-- 表单 -->
			<el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="100px">
				<el-form-item label="分类名称" prop="cat_name">
					<el-input v-model="editForm.cat_name"></el-input>
				</el-form-item>

				<!-- **** -->
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editCate">确 定</el-button>
			</span>
		</el-dialog>
		<!-- ***** -->
	</div>
</template>

<script>
	export default {
		//数据仓库
		data() {
			return {
				//查询分类列表的参数对象
				queryInfo: {
					type: 3, //显示多少层分类列表
					pagenum: 1, //页码
					pagesize: 5 //每页多少条数据
				},
				//分类列表
				catelist: [],
				//分类等级
				total: 0,
				//tree-table列的定义
				columns: [{
						label: '分类名称',
						prop: 'cat_name',
					},
					{
						label: '是否有效',
						//将当前列定义为模板列
						type: 'template',
						//当前列使用的模板名称
						template: 'isok',
					},
					{
						label: '排序',
						//将当前列定义为模板列
						type: 'template',
						//当前列使用的模板名称
						template: 'order',
					},
					{
						label: '操作',
						//将当前列定义为模板列
						type: 'template',
						//当前列使用的模板名称
						template: 'operate',
					},

				],
				//控制添加分类的对话框显示与隐藏
				addDialogVisible: false,
				//添加分类对话框的表单数据存储对象
				addForm: {
					cat_name: '', //分类名称
					cat_pid: 0, //分类父ID
					cat_level: 0, //分类层级,默认一级分类
				},
				//添加分类对话框表单的效验规则
				addFormrules: {
					cat_name: [{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					}, ],
				},
				//定义存储从后台获取的添加分类对话框父级分类列表的数据
				parentCateList: [],
				//定义添加分类对话框父级分类列表的级联选择器的配置对象
				cascaderPros: {
					label: 'cat_name', //指定选项标签为选项对象的某个属性值	
					value: 'cat_id', //指定选项的值为选项对象的某个属性值	
					children: 'children', //子一级数据
					expandTrigger: 'hover', //次级菜单的展开方式	
					checkStrictly: true, //选择任意一个级别选项
				},
				//级联选择器用户所选中的id数组
				selectedKeys: [],
				//控制编辑分类对话框的显示与隐藏
				editDialogVisible: false,
				//定义编辑分类对话框的表单对象数据
				editForm: {},
				//定义编辑分类对话框的表单效验规则
				editFormrules: {
					cat_name: [{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					}, ],
				},
				//handleChange:[],
				//******

			}
		},
		//生命周期钩子函数,created函数中调用ajax获取页面初始化所需的数据
		created() {
			//获取分类的数据
			this.getCateList()
		},
		methods: {
			async getCateList() {
				const {
					data: res
				} = await this.$http.get('categories', {
					params: this.queryInfo
				})
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取商品分类列表失败')
				}
				//console.log(res)
				this.catelist = res.data.result
				this.total = res.data.total
				//console.log(this.catelist)
				//console.log(this.total)
			},
			//定义分页大小改变监听
			handleSizeChange(pagesize) {
				// 把用户点击的页码大小*多少条显示一页的数据传进来
				//然后赋予data里面的queryInfo.pagesize
				this.queryInfo.pagesize = pagesize
				//最后刷新列表
				this.getCateList()
			},
			//监听分页当前页码改变
			handleCurrentChange(pagenum) {
				this.queryInfo.pagenum = pagenum
				this.getCateList()
			},
			//获取父级分类的数据列表
			//向后台发送获取请求
			async huoqufujifneleideshuju() {
				const {
					data: res
				} = await this.$http.get('categories', {
					params: {
						type: 2
					}
				})
				// 判断
				if (res.meta.status !== 200) {
					return this.$message.error('获取父级分类列表数据失败')
				}
				//console.log(res)
				// 赋值给数据仓库data中的parentCateList
				this.parentCateList = res.data
			},
			//定义添加分类对话框的显示与隐藏
			xianshitiajiafenlei() {
				this.huoqufujifneleideshuju()
				// 把属性fales改成true  从而显示对话框
				this.addDialogVisible = true
			},
			//监听级联选择器的改变事件，用户选择的分类id
			handleChange() {
				//console.log(this.selectedKeys)
				//判断用户有没有选择父级分类,如果数组小于0
				if (this.selectedKeys.length > 0) {
					this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
					this.addForm.cat_level = this.selectedKeys.length
				} else {
					this.addForm.cat_pid = 0
					this.addForm.cat_level = 0
				}
			},
			//点击添加分类对话框确定按钮--调用validate插件判断验证
			addCate() {
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) {
						return
					}
					const {
						data: res
					} = await this.$http.post('categories', this.addForm)
					if (res.meta.status !== 201) {
						return this.$message.error('添加分类失败')
					}
					this.addDialogVisible = false
					this.getCateList()
					this.$message.success('添加分类成功')
				})
			},
			//监听添加对话框的关闭事件,调用resetFields方法清除数据
			addDidlog() {
				this.$refs.addFormRef.resetFields()
				//重置数据
				this.selectedKeys = []
				this.addForm.cat_pid = 0
				this.addForm.cta_level = 0
			},
			//点击编辑分类对话框关闭,调用resetFields方法清除数据
			editDidlog() {
				this.$refs.editFormRef.resetFields()
			},
			//显示编辑对话框
			async showeditdialog(cateId) {
				//向后台发送获取用户分类列表
				const {
					data: res
				} = await this.$http.get(`categories/${cateId}`)
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取用户分类名称数据失败')
				}
				this.editForm = res.data
				this.editDialogVisible = true
			},
			//点击编辑对话框确定按钮
			editCate() {
				//调用validate插件判断验证
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) {
						return
					}
					//效验成功向后台发送修改分类名称请求
					const {
						data: res
					} = await this.$http.put(`categories/${this.editForm.cat_id}`, {
						cat_name: this.editForm.cat_name
					})
					//console.log(res)
					//判断
					if (res.meta.status !== 200) {
						return this.$message.error('编辑分类名称失败')
					}
					//修改成功 关闭对话框
					this.editDialogVisible = false
					//刷新列表
					this.getCateList()
					//提示
					this.$message.success('编辑分类名称成功')
				})
			},
			//点击删除按钮
			removecatebyid(cateId) {
				//console.log(cateId)
				this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					const {
						data: res
					} = await this.$http.delete(`categories/${cateId}`)
					if (res.meta.status !== 200) {
						return this.$message.error('删除分类失败')
					}
					this.getCateList()
					this.$message.success('删除分类成功')
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//******

			//******
		},
		//------
	}
</script>

<style lang="less" scoped>
	.el-cascader {
		width: 100%;
	}

	.tree-table {
		margin-top: 15px;
	}
</style>
