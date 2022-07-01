<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片区域 -->
		<el-card>
			<!-- 添加按钮 -->
			<el-row>
				<el-col>
					<el-button type="primary" @click="addDialogVisible = true">
						添加角色
					</el-button>
				</el-col>
			</el-row>
			<!-- 表格区域 -->
			<!-- 从data中的rightslist数组中获取数据   border边框 stripe=隔行变色  -->
			<el-table :data="roleslist" border stripe>
				<!-- 展开用户角色列表权限 -->
				<el-table-column label="明细" type="expand">
					<!-- 通过自定义模板,使用作用域插槽 -->
					<template slot-scope="roleslist">
						<div>
							<!-- 先渲染一级权限菜单 -->
							<el-row v-for="(item1,i1) in roleslist.row.children"
								:class="{bdbottom:true,bdtop:i1==0,vcenter:true}">
								<!-- 指定占的网格数 -->
								<el-col :span="5">
									<el-tag closable="" @close="removeRightByid(roleslist.row,item1.id)">
										{{item1.authName}}
									</el-tag>
									<i class="el-icon-caret-right"></i>
								</el-col>
								<el-col :span="19">
									<!-- 渲染二级权限菜单 -->
									<!-- 对一级权限下的菜单数据进行渲染展示  :key="item1.id"加这个会报错   bdtop:i2 !=0除了一级权限都加上边框-->
									<el-row v-for="(item2,i2) in item1.children " :class="{bdtop:i2 !=0,vcenter:true}">
										<el-col :span="6">
											<el-tag closable="" type="success"
												@close="removeRightByid(roleslist.row,item2.id)"> {{item2.authName}}
											</el-tag>
											<i class="el-icon-caret-right"></i>
										</el-col>
										<el-col :span="18">
											<!-- 渲染三级权限菜单 -->
											<el-tag closable="" type="warning" v-for="item3 in item2.children"
												@close="removeRightByid(roleslist.row,item3.id)"> {{item3.authName}}
											</el-tag>
										</el-col>
									</el-row>
								</el-col>
							</el-row>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="序号" type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作">
					<!-- 操作权限需要用作用域插槽来实现 -->
					<template slot-scope="roleslist">
						<!-- 需要对level属性进行判定，等于则显示 不等于则隐藏 -->
						<el-button size="min" type="primary" class="el-icon-edit"
							@click="showEditDialog(roleslist.row.id)">编辑</el-button>
						<el-button size="min" type="danger" class="el-icon-delete"
							@click="removeRoleByid(roleslist.row.id)">删除</el-button>
						<el-button size="min" type="warning" class="el-icon-s-tools"
							@click="showRightDialg(roleslist.row)">分配权限
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 添加角色按钮对话框 -->
		<!-- visible.sync控制对话框的显示与隐藏 -->
		<el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addRoleClosed">
			<!-- model用户的数据存放 rules表单验证规则 addFormRef方法调用验证表单 -->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="addForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="addForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addRole">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑角色按钮对话框 -->
		<!-- visible.sync控制对话框的显示与隐藏 -->
		<el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" @close="editRoleClosed">
			<!-- model用户的数据存放 rules表单验证规则 ref方法调用验证表单 -->
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="editForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="editForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editRole">确 定</el-button>
			</span>
		</el-dialog>
		<!-- ***** -->
		<!-- 分配权限按钮对话框 -->
		<!-- visible.sync控制对话框的显示与隐藏 -->
		<el-dialog title="分配权限" :visible.sync="rightDialogVisible" width="50%" @close="rightRoleClosed">
			<!-- 定义权限树形控件 -->
			<!-- data要展示的数据，取值是数组  node-key每个树节点用来作为唯一标识的属性， -->
			<el-tree :data="rightsList" :props="treeProps" node-key="id" show-checkbox default-expand-all=""
				:default-checked-keys="defaultkeys" ref="treeRef"></el-tree>
			<span slot="footer" class="dialog-footer">
				<el-button @click="rightDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="allorights">确 定</el-button>
			</span>
		</el-dialog>
		<!-- **** -->
		<!-- ********* -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//存储角色列表数据
				roleslist: [],
				//定义添加角色按钮的显示与隐藏
				addDialogVisible: false,
				//定义表单的数据对象，里面存储有两个数据，角色名称跟角色描述
				addForm: {
					roleName: '',
					roleDesc: '',
				},
				//定义添加角色对话框表单的验证规则
				addFormRules: {
					//角色名称
					roleName: [{
							required: true,
							message: '请输入角色名称',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '长度在 3 到 10 个字符',
							trigger: 'blur'
						}
					],
					//角色描述
					roleDesc: [{
							required: true,
							message: '请输入角色描述',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 50,
							message: '长度在 1 到 50 个字符',
							trigger: 'blur'
						}
					],
					//*****

					//****
				},
				//定义编辑角色对话框的显示与隐藏
				editDialogVisible: false,
				//定义编辑角色对话框存储的数据
				editForm: {},
				//定义编辑角色对话框表单的验证规则
				editFormRules: {
					//角色名称
					roleName: [{
							required: true,
							message: '请输入角色名称',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '长度在 3 到 10 个字符',
							trigger: 'blur'
						}
					],
					//角色描述
					roleDesc: [{
							required: true,
							message: '请输入角色描述',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 50,
							message: '长度在 1 到 50 个字符',
							trigger: 'blur'
						}
					],
				},
				//显示与隐藏分配权限对话框
				rightDialogVisible: false,
				//定义分配权限按钮，从后台获取的数据对象
				rightsList: [],
				//配置属性绑定对象，树形控件要展示的数据
				treeProps: {
					label: 'authName', //要展示的权限名字
					children: 'children', //下一级存储数据的数组
				},
				//定义树形控件展示的默认选中权限id
				defaultkeys: [],
				//当前即将分配的角色id
				roleId: '',
				//*****
				//******
			}
		},
		//生命周期钩子函数,created函数中调用ajax获取页面初始化所需的数据
		created() {
			this.getRolesList()
		},
		//**   
		methods: {
			//定义向后台发送请求，获取角色列表的数据
			async getRolesList() {
				const {
					data: res
				} = await this.$http.get('roles')
				//console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取用户角色列表失败')
				}
				this.roleslist = res.data
				//console.log(this.roleslist)
			},
			//定义添加角色对话框确定按钮，点击确定之后
			addRole() {
				//验证用户输入的表单数据是否有误---调用validate插件判断验证
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) {
						return
					}
					//验证通过之后向后台发送添加用户数据请求
					const {
						data: res
					} = await this.$http.post('roles', this.addForm)
					//发送请求之后，判断是否成功
					if (res.meta.status !== 201) {
						//判断不成功，终止程序，返回提示
						return this.$message.error('添加用户失败')
					}
					//添加成功后关闭对话框
					this.addDialogVisible = false
					//调用getRolesList刷新用户角色列表数据
					this.getRolesList()
					//提示添加成功
					this.$message.success('添加用户成功')
				})
			},
			//监听添加对话框关闭后重置表单,调用resetFields方法清除数据
			addRoleClosed() {
				this.$refs.addFormRef.resetFields()
			},
			//显示编辑角色对话框,点击编辑之后向后台发送查询用户角色信息
			async showEditDialog(id) {
				const {
					data: res
				} = await this.$http.get(`roles/${id}`)
				//console.log(res)
				//判断是否成功
				if (res.meta.status !== 200) {
					return this.$message.error('获取角色信息失败')
				}
				//成功之后把获取到的数据绑定到编辑角色对话框对象
				this.editForm = res.data
				//把editDialogVisible的fales改成true  从而显示编辑角色对话框
				this.editDialogVisible = true
			},
			//点击编辑角色对话框确定按钮，
			editRole() {
				//验证用户输入的表单数据是否有误---调用validate插件判断验证
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) {
						return
					}
					//验证成功后，向后台发送修改角色信息请求
					const {
						data: res
					} = await this.$http.put(`roles/${this.editForm.roleId}`, {
						roleName: this.editForm.roleName,
						roleDesc: this.editForm.roleDesc
					})
					if (res.meta.status !== 200) {
						//判断不成功，终止程序，返回提示
						return this.$message.error('修改角色信息失败')
					}
					//console.log(res)
					//成功后关闭对话框
					this.editDialogVisible = false
					//调用getRolesList方法刷新角色列表信息
					this.getRolesList()
					//提示
					this.$message.success('修改角色信息成功')
				})
			},
			//监听关闭编辑角色对话框,调用resetFields方法清除数据
			editRoleClosed() {
				this.$refs.editFormRef.resetFields()
			},
			//根据角色id来删除角色
			removeRoleByid(id) {
				//弹窗提示
				this.$confirm('此操作将永久删除角色, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					//点击确定按钮后，向后台发送删除角色信息请求
					const {
						data: res
					} = await this.$http.delete(`roles/${id}`)
					if (res.meta.status !== 200) {
						//判断不成功，终止程序，返回提示
						return this.$message.error('删除角色信息失败')
					}
					//成功后，调用getRolesList刷新角色列表
					this.getRolesList()
					//提示
					this.$message.success('删除角色信息成功')
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//******
			//根据角色id删除角色权限列表菜单信息,传入两个参数role是角色 ID、rightId是权限 ID 列表
			removeRightByid(role, rightId) {
				//console.log(role)
				//console.log(rightId)
				//点击X按钮后，询问是否删除
				this.$confirm('此操作将永久删除该角色权限, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					//点击确定后，向后台发送删除角色权限请求
					const {
						data: res
					} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
					// console.log(res)
					//判断是否请求成功
					if (res.meta.status !== 200) {
						return this.$message.error('删除角色权限失败')
					}
					// console.log(res)
					//请求成功后调用getRolesList方法刷新列表
					// this.getRolesList()
					//把后台返回最新的data数据，赋予当前角色信息，重新设置当前角色下最新的权限数据，ps：用getRolesList方法会刷新整个网页
					role.children = res.data
					//提示
					this.$message.success('删除角色权限成功')
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//定义分配权限确定按钮
			async allorights() {
				//定义一个数组，为拿到待选中和已选中权限id   ...扩展语法。对数组和对象而言，就是将运算符后面的变量里东西每一项拆下来
				const keys = [
					...this.$refs.treeRef.getCheckedKeys(),
					...this.$refs.treeRef.getHalfCheckedKeys()
				]
				//console.log(keys)
				//join()重组的意思，把数组合成一个字符串
				const idstr = keys.join(',')
				const {
					data: res
				} = await this.$http.post(`roles/${this.roleId}/rights`, {
					rids: idstr
				})
				if (res.meta.status !== 200) {
					return this.$message.error('分配角色权限失败')
				}
				this.$message.success('分配角色权限成功')
				this.getRolesList()
				this.rightDialogVisible = false
			},
			//定义分配权限对话框显示与隐藏，
			async showRightDialg(role) {
				this.roleId = role.id
				//获取所以权限列表数据，向后台发送请求
				const {
					data: res
				} = await this.$http.get(`rights/tree`)
				//console.log(res)
				//判断请求是否成功
				if (res.meta.status !== 200) {
					return this.$message.error('获取用户权限数据失败')
				}
				this.rightsList = res.data
				//console.log(this.rightsList)
				//获取角色下所有的三级权限id
				//console.log(role)
				//console.log(this.defaultkeys)
				this.getleafKeys(role)
				// 点击权限分配按钮后，对话框显示
				this.rightDialogVisible = true

			},
			//获取角色所有三级权限,最底层数据
			getleafKeys(node) {
				//判断为三级权限节点
				if (!node.children) {
					return this.defaultkeys.push(node.id)
				}
				//如果不是三级权限,则进行递归操作   forEach遍历数组
				node.children.forEach(item => {
					this.getleafKeys(item)
				})

			},
			//监听分配权限对话框关闭
			rightRoleClosed() {
				//因为每次点击分配权限，角色id都会保留并相加在一起，造成权限相加显示，所以需要关闭对话框的时候，就清空数组
				this.defaultkeys = []
			},
			//***
			//****
		},
		//***
	}
</script>

<style lang="less" scoped="">
	//定义角色一级权限菜单展示边距
	.el-tag {
		margin: 6px;
	}

	//定义角色权限菜单展示下边框
	.bdbottom {
		border-bottom: 1px solid #eeeeee;
	}

	//定义定义角色权限菜单展示上边框
	.bdtop {
		border-top: 1px solid #eeeeee;
	}

	// 定义角色权限菜单展示浮动居中
	.vcenter {
		display: flex; //浮动
		align-items: center; //居中
	}
</style>
