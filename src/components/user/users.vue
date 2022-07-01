<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片区域 -->
		<el-card>  
			<!-- 搜素与添加区域    gutter列之间的间隔 -->
			<el-row :gutter="30">
				<el-col :span="8">
					<!--  clearable给输入框加一个清空X @clear点击清空重新加载getUserList方法-->
					<el-input placeholder="请输入搜素姓名" class="input-with-select" v-model="queryInfo.query" clearable
						@clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVusble=true">
						添加用户
					</el-button>
				</el-col>
			</el-row>
			<!-- 表格区域 -->
			<template>
				<!-- data里面是存储用户列表的数据  prop里面是用户的数据，用户名等 -->
				<el-table :data="userList" border="">
					<el-table-column type="index" label="索引"></el-table-column>
					<el-table-column prop="username" label="用户名"></el-table-column>
					<el-table-column prop="email" label="邮箱"></el-table-column>
					<el-table-column prop="mobile" label="电话"></el-table-column>
					<el-table-column prop="role_name" label="角色"></el-table-column>
					<el-table-column label="状态">
						<!-- 自定义模板  使用作用域插槽，通过scope.row获取当前行的数据-->
						<!-- 来取得作用域插槽:data绑定的数据，scope可以随便替换其他名称，只是定义对象来代表取得的data数据，用于使用而已。
						 不能使用scope作为函数名  需要用在data里面的定义的数据名
						 -->
						<template slot-scope="userList">
							<el-switch v-model="userList.row.mg_state" @change="userStateChange(userList.row)">
							</el-switch>
						</template>
					</el-table-column>
					<!-- 操作动作栏 -->
					<el-table-column label="操作">
						<!-- 通过作用域插槽来获取要修改用户的数据信息 -->
						<template slot-scope="userList">
							<el-button type="primary" icon="el-icon-edit" size="mini"
								@click="showEditDialog(userList.row.id)"> </el-button>
							<el-button type="danger" icon="el-icon-delete" size="mini"
								@click="removeUserByid(userList.row.id)"> </el-button>
							<el-tooltip effect="dark" content="分配角色" placement="top-end" :enterable="false">
								<el-button type="warning" icon="el-icon-setting" size="mini"
									@click="showRoleDialog(userList.row)"> </el-button>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<!-- 分页 -->
			<!-- @size-change每一页大小的改变  @current-change页码改变跳转的页面 current-page=当前页码  page-sizes用户可以选择多少条一页 page-size当前显示多少条 layout分页布局样式-->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[1, 5,10]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
			<!-- ************************** -->
		</el-card>
		<!-- 添加用户的对话框 -->
		<el-dialog title="添加用户" :visible.sync="addDialogVusble" width="50%" @close="addDialogClosed">
			<!-- model添加用户  -->
			<!-- model用户的数据存放 rules表单验证规则 addFormRef方法调用验证表单 -->
			<el-form :model="addform" :rules="addformrules" ref="addformref" label-width="70px" class="demo-ruleForm">
				<el-form-item label="用户名 " prop="username">
					<el-input v-model="addform.username" placeholder="请输入用户名,长度在 3 到 10 个字符"></el-input>
				</el-form-item>
				<el-form-item label="密码 " prop="password">
					<el-input v-model="addform.password" placeholder="请输入密码,长度在 6 到 30 个字符" show-password></el-input>
				</el-form-item>
				<el-form-item label="邮箱 " prop="email">
					<el-input v-model="addform.email" placeholder="请输入邮箱"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="addform.mobile" placeholder="请输入手机号码"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVusble = false">取 消</el-button>
				<el-button type="primary" @click="adduser">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 修改用户的对话框 -->
		<el-dialog title="修改用户" :visible.sync="editDialogVusble" width="50%" @close="editDialogClosed">
			<!-- model添加用户  -->
			<!-- model用户的数据存放 rules表单验证规则 addFormRef方法调用验证表单 -->
			<el-form :model="editform" :rules="editformrules" ref="editformref" label-width="70px"
				class="demo-ruleForm">
				<el-form-item label="用户名 " prop="username">
					<el-input v-model="editform.username" placeholder="请输入用户名,长度在 3 到 10 个字符" disabled></el-input>
				</el-form-item>
				<el-form-item label="邮箱 " prop="email">
					<el-input v-model="editform.email" placeholder="请输入邮箱"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="editform.mobile" placeholder="请输入手机号码"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVusble = false">取 消</el-button>
				<el-button type="primary" @click="edituser">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 更改用户级别的对话框 -->
		<el-dialog title="更改用户级别" :visible.sync="roleDialogVusble" width="50%" @close="roleDialogClosed">
			<!-- 展示要更改用户的信息 -->
			<div>
				<p>当前的用户名: {{ userinfo.username }}</p>
				<p>当前的用户级别: {{ userinfo.role_name }}</p>
				<p>分配新的用户级别:
					<el-select v-model="selectedroleid" placeholder="请选择">
						<el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
						</el-option>
					</el-select>
				</p>
			</div>
			<!-- model添加用户  -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="roleDialogVusble = false">取 消</el-button>
				<el-button type="primary" @click="allotrole">确 定</el-button>
			</span>
		</el-dialog>
		<!-- ******************************** -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//查询用户列表的参数对象
				queryInfo: {
					query: '',
					pagenum: 1, //页码
					pagesize: 5, //页大小	
				},
				//存储用户列表的数据
				userList: [],
				//定义总的记录数
				total: 0,
				//添加对话框的显示与隐藏
				addDialogVusble: false,
				//添加用户的一个绑定对象
				addform: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				},
				////添加用户的效验规则
				addformrules: {
					//添加用户引用
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '长度在 3 到 10 个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 20,
							message: '长度在 6 到 30 个字符',
							trigger: 'blur'
						}
					],
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},
						{
							pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
							message: '邮箱格式不对',
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '请输入手机号码',
							trigger: 'blur'
						},
						{
							pattern: /0?(13|14|15|17|18|19)[0-9]{9}/,
							message: '手机号码格式不正确',
							trigger: 'blur'
						}
					],
				},
				// 修改对话框的显示或隐藏
				editDialogVusble: false,
				//修改用户的一个绑定对象
				editform: {},
				//修改用户的效验规则
				editformrules: {
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},
						{
							pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
							message: '邮箱格式不对',
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '请输入手机号码',
							trigger: 'blur'
						},
						{
							pattern: /0?(13|14|15|17|18|19)[0-9]{9}/,
							message: '手机号码格式不正确',
							trigger: 'blur'
						}
					],
				},
				// 更改用户级别对话框的显示或隐藏
				roleDialogVusble: false,
				// 定义一个更改用户级别的对象信息
				userinfo: {},
				// 定义用户级别列表
				rolesList: [],
				// 定义分配用户级别列表
				selectedroleid: null,
				// **************
			};
		},
		//生命周期钩子函数,created函数中调用ajax获取页面初始化所需的数据
		created() {
			this.getUserList()
		},
		methods: {
			async getUserList() {
				const {
					data: res
				} = await this.$http.get('users', {
					params: this.queryInfo
				})
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取用户列表失败') //$message消息提示
				}
				this.userList = res.data.users
				this.total = res.data.total
			},
			// ****************************分页
			//监听page-sizes改变的事件 ,可以接收数据
			handleSizeChange(pagesize) {
				this.queryInfo.pagesize = pagesize
				//拿到数据之后，重新刷新赋予getUserListf方法
				this.getUserList()
			},
			//监听pageenum事件，接收跳转的页码，尔后重新加载getUserList
			handleCurrentChange(pagenum) {
				this.queryInfo.pagenum = pagenum
				this.getUserList()
			},
			//监听用户  switch 状态改变
			async userStateChange(userList) {
				//console.log(userList)
				const {
					data: res
				} = await this.$http.put(`users/${userList.id}/state/${userList.mg_state}`)
				//console.log(userinfo)
				//console.log(res)
				if (res.meta.status !== 200) {
					//当更新失败时需要恢复为原始状态
					userList.mg_state = !userList.mg_state
					return this.$message.error('更新用户状态失败')
				}
				this.$message.success('更新用户状态成功')
			},
			// 监听添加用户对话框关闭后清除数据,调用resetFields方法清除数据
			addDialogClosed() {
				this.$refs.addformref.resetFields()
			},
			//添加用户   1.先效验用户提交的扁担信息是否有误 2.效验成功后向后台发送添加数据请求
			adduser() {
				this.$refs.addformref.validate(async valid => {
					if (!valid) {
						return alert('请检查用户名与密码')
					}
					const {
						data: res
					} = await this.$http.post('users', this.addform)
					if (res.meta.status !== 201) {
						return this.$message.error('添加用户失败')
					}
					//关闭对话框
					this.addDialogVusble = false
					//刷新用户列表  重新调用getUserList方法
					this.getUserList()
					//提示添加成功
					this.$message.success('添加用户成功')
				})
			},
			//显示编辑用户的对话框
			async showEditDialog(id) {
				const {
					data: res
				} = await this.$http.get(`users/${id}`)
				if (res.meta.status !== 200) {
					return this.$message.error('查询用户失败')
				}
				this.editform = res.data
				this.editDialogVusble = true
			},
			//修改用户
			edituser() {
				//验证用户修改表单信息是否有误
				this.$refs.editformref.validate(async valid => {
					if (!valid) {
						return
					}
					//无误后向后台发送修改数据请求
					const {
						data: res
					} = await this.$http.put(`users/${this.editform.id}`, {
						email: this.editform.email,
						mobile: this.editform.mobile,
					})
					//判断是否成功
					if (res.meta.status !== 200) {
						return this.$message.error('修改用户失败')
					}
					this.$message.error('修改用户成功')
					//修改成功后关闭对话框
					this.editDialogVusble = false
					//最后调用getUserList方法刷新用户数据列表
					this.getUserList()
					this.$message.success('修改用户成功')
				})
			},
			//监听修改用户对话框关闭后清除数据,调用resetFields方法清除数据
			editDialogClosed() {
				this.$refs.editformref.resetFields()
			},
			//根据用户ID删除用户 
			removeUserByid(id) {
				this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					//点击确定按钮后，向后台发送删除用户数据请求
					const {
						data: res
					} = await this.$http.delete(`users/${id}`)
					//判断是否删除成功
					if (res.meta.status !== 200) {
						return this.$message.error('删除用户失败')
					}
					//删除成功后重新调用getUserList方法刷新用户数据列表
					this.getUserList()
					this.$message.success('删除用户成功')
					// this.$message({
					//   type: 'success',
					//   message: '删除成功!'
					// });
				}).catch(() => {
					this.$message.info(
						'已取消删除'
					);
				});
			},
			//显示更改用户级别的对话框
			async showRoleDialog(userinfo) {
				this.userinfo = userinfo
				//获取用户级别列表
				const {
					data: res
				} = await this.$http.get('roles')
				//判断获取是否成功
				if (res.meta.status !== 200) {
					return this.$message.error('获取用户列表失败')
				}
				this.rolesList = res.data
				//console.log(this.rolesList)
				this.roleDialogVusble = true
			},
			//监听更改用户级别对话框的关闭事件，并清除用户级别信息
			roleDialogClosed() {
				//把用户级别列表selectedroleid变成空
				this.selectedroleid = null
				//然后重新刷新用户对象信息userinfo
				this.userinfo = {}
			},
			//更改用户级别
			async allotrole() {
				//判断是否选择级别
				if (!this.selectedroleid) {
					return this.$message.error('请选择级别')
				}
				//成功之后向后台发送更改用户等级请求
				const {
					data: res
				} = await this.$http.put(`users/${this.userinfo.id}/role`, {
					rid: this.selectedroleid
				})
				//console.log(this.userinfo.id)
				//console.log(this.selectedroleid)
				if (res.meta.status !== 200) {
					console.log(res)
					return this.$message.error('更改用户级别失败')
				}
				//提示用户更改成功
				this.$message.success('更改用户级别成功')
				//调用getUserList方法刷新用户列表数据
				this.getUserList()
				//最后关闭更改用户级别对话框
				this.roleDialogVusble = false
			},
			//****
		},
	};
</script>

<style lang="less" scoped>

</style>
