<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>分类参数</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<!-- 警告提示 -->
			<el-alert title="注意:只允许第三季设置相关参数!" type="warning" show-icon :closable="false"></el-alert>
			<!-- 级联选择器 -->
			<el-row class="cat_select">
				<el-col>
					<span>请选择商品分类:</span>
					<!--   v-model级联选择器选中的id数组  options数据来源对象    props级联选择器的配置属性  clearable可清除属性 -->
					<el-cascader v-model="selectedKeys" :options="cateList" :props="cascaderProps"
						@change="handleChange" clearable></el-cascader>
				</el-col>
			</el-row>
			<!-- tabos标签页 -->
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<!-- 动态参数列表页面 -->
				<el-tab-pane label="动态参数" name="many">
					<el-button type="primary" size="mini" :disabled="btnDissabled" @click="adddialogVisible = true">添加参数
					</el-button>
					<!-- 三级参数显示 -->
					<el-table :data="paramsData" border stripe>
						<el-table-column label="明细" type="expand">
							<!-- 自定义模板  使用作用域插槽-->
							<template slot-scope="paramsData">
								<!-- 循环渲染tag组件，参数明细 -->
								<!-- closable可以关闭的  @close关闭的一个处理 -->
								<el-tag :key="i" v-for="(item,i) in paramsData.row.attr_vals" closable
									@close="handleClose(paramsData.row,i)">
									{{ item }}
								</el-tag>
								<!-- 输入文本框 -->
								<!-- v-if控制文本框的显示与隐藏 -->
								<el-input class="input-new-tag" v-if="paramsData.row.inputVisible"
									v-model="paramsData.row.inputValue" ref="saveTagInput" size="small"
									@keyup.enter.native="handleInputConfirm(paramsData.row)"
									@blur="handleInputConfirm(paramsData.row)">
								</el-input>
								<!-- 添加的按钮 -->
								<el-button v-else class="button-new-tag" size="small"
									@click="showInput(paramsData.row)">添加明细
								</el-button>
							</template>
						</el-table-column>
						<el-table-column label="序号" type="index"></el-table-column>
						<el-table-column label="参数名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<!-- 自定义模板列 作用域插槽  -->
							<template slot-scope='paramsData'>
								<el-button type="primary" icon="el-icon-edit" size="mini"
									@click="showeditdialog(paramsData.row.attr_id)">
									编辑
								</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini"
									@click="removeParams(paramsData.row.attr_id)">
									删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 静态参数列表页面 -->
				<el-tab-pane label="静态参数" name="only">
					<el-button type="primary" size="mini" :disabled="btnDissabled" @click="adddialogVisible = true">添加属性
					</el-button>
					<el-table :data="paramsData" border stripe>
						<el-table-column label="明细" type="expand">
							<!-- 自定义模板  使用作用域插槽-->
							<template slot-scope="paramsData">
								<!-- 循环渲染tag组件，参数明细 -->
								<!-- closable可以关闭的  @close关闭的一个处理 -->
								<el-tag :key="i" v-for="(item,i) in paramsData.row.attr_vals" closable
									@close="handleClose(paramsData.row,i)">
									{{ item }}
								</el-tag>
								<!-- 输入文本框 -->
								<!-- v-if控制文本框的显示与隐藏 -->
								<el-input class="input-new-tag" v-if="paramsData.row.inputVisible"
									v-model="paramsData.row.inputValue" ref="saveTagInput" size="small"
									@keyup.enter.native="handleInputConfirm(paramsData.row)"
									@blur="handleInputConfirm(paramsData.row)">
								</el-input>
								<!-- 添加的按钮 -->
								<el-button v-else class="button-new-tag" size="small"
									@click="showInput(paramsData.row)">添加明细
								</el-button>
							</template>
						</el-table-column>
						<el-table-column label="序号" type="index"></el-table-column>
						<el-table-column label="属性名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<!-- 自定义模板列 作用域插槽  -->
							<template slot-scope='paramsData'>
								<el-button type="primary" icon="el-icon-edit" size="mini"
									@click="showeditdialog(paramsData.row.attr_id)">
									编辑
								</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini"
									@click="removeParams(paramsData.row.attr_id)">
									删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
			<!-- ***** -->
		</el-card>
		<!-- 添加对话框 -->
		<!-- title对话框的标题  visible.sync显示与隐藏 -->
		<el-dialog :title="'添加' + totle" :visible.sync="adddialogVisible" width="50%" @close='adddialogClosed'>
			<!-- model用户的数据存放 rules表单验证规则 ref方法调用验证表单 -->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
				<el-form-item :label="totle" prop="attr_name">
					<el-input v-model="addForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="adddialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addParams">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑对话框 -->
		<!-- title对话框的标题  visible.sync显示与隐藏 -->
		<el-dialog :title="'编辑' + totle" :visible.sync="editdialogVisible" width="50%" @close='editdialogClosed'>
			<!-- model用户的数据存放 rules表单验证规则 ref方法调用验证表单 -->
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
				<el-form-item :label="totle" prop="attr_name">
					<el-input v-model="editForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editdialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editParams">确 定</el-button>
			</span>
		</el-dialog>
		<!-- ******* -->
		<!-- ****** -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//分类列表数据
				cateList: [],
				//级联选择器的配置属性
				cascaderProps: {
					label: 'cat_name',
					value: 'cat_id',
					children: 'children',
					expandTrigger: 'hover', //鼠标经过时显示
				},
				//级联选择器选中的id数组
				selectedKeys: [],
				//激活的标签页
				activeName: 'many',
				//定义分类参数数据，用户选中的三级分类id
				paramsData: [],
				//控制添加对话框的显示与隐藏
				adddialogVisible: false,
				//添加对话框表单数据
				addForm: {},
				//添加对话框表单的效验规则
				addFormRules: {
					attr_name: [{
							required: true,
							message: '请输入参数名称',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 10,
							message: '长度在 1 到 10 个字符',
							trigger: 'blur'
						}
					],
				},
				//编辑对话框的显示与隐藏
				editdialogVisible: false,
				//编辑对话框的表单效验规则
				editFormRules: {
					attr_name: [{
							required: true,
							message: '请输入参数名称',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 10,
							message: '长度在 1 到 10 个字符',
							trigger: 'blur'
						}
					],
				},
				//编辑对话框表单数据存储对象
				editForm: {},
				//明细输入框的显示与隐藏
				//inputVisible:false,
				//*****
				//******
			}
		},
		//生命周期钩子函数,created函数中调用ajax获取页面初始化所需的数据
		created() {
			this.getCateList()
		},
		methods: {
			//获取分类列表数据
			async getCateList() {
				const {
					data: res
				} = await this.$http.get('categories')
				if (res.meta.status !== 200) {
					return this.$message.error('获取分类列表失败')
				}
				//console.log(res)
				this.cateList = res.data
			},
			//监听级联选择器的改变事件
			handleChange() {
				this.getParamsData()
			},
			//监听标签页的点击事件,动静参数页面切换
			handleClick() {
				//console.log(this.activeName)
				this.getParamsData()
			},
			//获取三级分类参数的数据
			async getParamsData() {
				//判断是否选中三级分类,如果选中 ，则要重新选择
				//如果selectedKeys数组的长度不是3，说明不是三级分类
				if (this.selectedKeys.length !== 3) {
					//不是三级分类就清空输入框数据---重置selectedKeys数组
					this.selectedKeys = []
					//如果没有三级分类参数，清空动静列表数据
					this.paramsData = []
					return
				}
				//根据所选分类 ，获取动态参数或静态参数属性
				const {
					data: res
				} = await this.$http.get(`categories/${this.catId}/attributes`, {
					params: {
						sel: this.activeName
					}
				})
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取参数列表失败')
				}
				//对参数明细进行处理,将空格拆分为数组
				//因为后台返回的data.attr_vals数据是用空格隔开的字符串，需要拆分成数组才能显示
				//forEach() 是前端开发中操作数组的一种方法，主要功能是遍历数组      split把一个数据拆分
				res.data.forEach(item => {
					item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [],
						//给每个明细增加变量，用于区分开每个明细的属性
						item.inputVisible = false //控制文本框的显示与隐藏
					item.inputValue = '' //文本框中输入的值
				})
				//赋值
				this.paramsData = res.data
				//console.log(res)

			},
			//监听添加对话框的关闭事件
			adddialogClosed() {
				//获取表单数据,调用resetFields函数销毁子组件的变量,下次进入就不会携带上次输入的信息,表单重置
				this.$refs.addFormRef.resetFields()
			},
			//定义点击对话框确定按钮
			addParams() {
				//调用validate方法在次效验用户输入表单数据是否有误
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) {
						return
					}
					//效验成功,向后台发送添加请求            携带三级分类id，已经在计算属性中定义。
					const {
						data: res
					} = await this.$http.post(`categories/${this.catId}/attributes`, {
						attr_name: this.addForm.attr_name, //参数名字
						attr_sel: this.activeName, //参数是静态还是动态
					})
					//判断是否添加成功
					if (res.meta.status !== 201) {
						//失败返回提示
						return this.$message.error('添加参数失败')
					}
					//成功关闭对话框
					this.adddialogVisible = false
					//调用getParamsData方法刷新三级分类下的数据列表
					this.getParamsData()
					//提示
					this.$message.success('添加参数成功')

				})
			},
			//参数删除
			removeParams(id) {
				this.$confirm('此操作将永久删除该参数吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					//点击确定，向后台发送删除请求，携带三级分类id跟 三级分类下的参数id
					const {
						data: res
					} = await this.$http.delete(`categories/${this.catId}/attributes/${id}`)
					if (res.meta.status !== 200) {
						return this.$message.error('删除参数失败')
					}
					//调用getParamsData方法刷新页面
					this.getParamsData()
					//提示
					this.$message.success('删除参数成功')
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//显示编辑对话框
			async showeditdialog(id) {
				//根据表单传过来的id获取相应参数信息    携带三级分类id 跟 当前要编辑的参数id    最后看是动态参数还是静态属性
				const {
					data: res
				} = await this.$http.get(`categories/${this.catId}/attributes/${id}`, {
					params: {
						attr_sel: this.activeName
					}
				})
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('查询参数信息失败')
				}
				this.editForm = res.data
				this.editdialogVisible = true
			},
			//监听编辑对话框的关闭事件
			editdialogClosed() {
				//获取表单数据,调用resetFields函数销毁子组件的变量,下次进入就不会携带上次输入的信息,表单重置
				this.$refs.editFormRef.resetFields()
			},
			//定义编辑对话框的确定按钮
			editParams() {
				//调用validate方法在次效验用户输入表单数据是否有误
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) {
						return
					}
					// 表单效验成功后，像后台发起修改请求， 携带三级分类id、当前参数id(已经在显示对话框时获取到并存储在editForm中)、
					const {
						data: res
					} = await this.$http.put(`categories/${this.catId}/attributes/${this.editForm.attr_id}`, {
						attr_name: this.editForm.attr_name, //要修改的参数名称
						attr_sel: this.activeName, //要传递的是静态还是动态
						attr_vals: this.editForm.attr_vals, //传递的参数明细
					})
					//console.log(res)
					if (res.meta.status !== 200) {
						return this.$message.error('修改参数名称失败')
					}
					//成功后，关闭编辑对话框
					this.editdialogVisible = false
					//调用getParamsData方法刷新获取最新列表
					this.getParamsData()
					//提示
					this.$message.success('修改成功')
				})
			},
			//监视tag标签的关闭,即删除这个参数明细
			handleClose(row, i) {
				row.attr_vals.splice(i, 1) //删除，当参数形式为splice(index,1)时表示删除下标为index的内容
				//更新参数明细
				this.updayteparamsdetail(row)
			},
			//显示文本输入框
			showInput(row) {
				row.inputVisible = true
				//点击后把鼠标焦点放在输入框   $nextTick执行延迟回调
				this.$nextTick(() => {
					//获取输入框    focus元素获取焦点时所触发的事件  
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			//当文本框失去焦点或者按下enter键触发
			handleInputConfirm(row) {

				//判断用户有没有输入内容    trim自动过滤输入内容最开始  和 最后的 空格，中间的会保留一个空格，多的会被过滤掉
				if (row.inputValue.trim()) {
					//把新增的输入数据，存储到attr_vals数组里面,然后再把数组转换成字符串发送给后台接口
					row.attr_vals.push(row.inputValue.trim())
					//更新参数明细
					this.updayteparamsdetail(row)
				}
				row.inputVisible = false
				row.inputValue = ''
			},
			//更新参数明细
			async updayteparamsdetail(row) {
				const {
					data: res
				} = await this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`, {
					attr_name: row.attr_name, //要修改的参数名称
					attr_sel: row.attr_sel, //要传递的是静态还是动态
					attr_vals: row.attr_vals.join(' '), //join重组的意思，把数组合成一个字符串。参数以空格隔开。变成字符串传到后台
				})
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('更新参数明细失败')
				}
				this.$message.success('更新参数明细成功')
			},
			//********
			//********
		},
		//vue的计算属性，是根据依赖关系进行缓存的计算，只有在它的相关依赖发生改变时才会进行更新
		computed: {
			//当前选中的三级分类id
			catId() {
				//判断selectedKeys数组长度是不是等于3，如果等于3  就取最后一个元素，否则返回一个空
				return this.selectedKeys.length === 3 ? this.selectedKeys[2] : null
			},
			//是否禁用按钮
			btnDissabled() {
				//如果selectedKeys数组长度等于三,说明选中了三级参数列表，添加参数按钮需要改成启用状态
				return this.selectedKeys.length === 3 ? false : true
			},
			//添加对话框的标题
			totle() {
				//判断sctiveName是否等于many，是的话就返回动态参数，不是就返回静态属性
				return this.activeName === 'many' ? '动态参数' : '静态属性'
			},
		},
	}
</script>

<style lang="less" scoped>
	//选择商品输入框
	.cat_select {
		margin: 15px 0;
	}

	//tag标签
	.el-tag {
		margin: 10px;
	}

	//明细输入框
	.input-new-tag {
		width: 120px;
	}
</style>
