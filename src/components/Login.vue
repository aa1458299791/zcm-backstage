<template>
	<div class="login-container ">
		<!-- 粒子动画效果 -->
		<vue-particles color="#fff" :particleOpacity="0.7" :particlesNumber="100" shapeType="circle" :particleSize="4"
			linesColor="#fff" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="4"
			:hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push" class="lizi">
		</vue-particles>
		<div class="login-left animate__animated animate__zoomInLeft">
			<img src="../assets/imgs/login_img.png">
		</div>
		<div class="login-box animate__animated animate__zoomInRight">
			<!-- 头像 -->
			<div class="avatar-box">
				<img src="../assets/imgs/水电学院1.jpg" width="95%">
			</div>
			<!-- 标题 -->
			<div class="title">
				电商后台管理系统
			</div>
			<!-- 登录表单 -->
			<el-form ref="loginformref" class="login-form" :model="loginform" :rules="loginformrules">
				<!-- 要想与表单效验规则相连必须添加 prop属性 -->
				<el-form-item prop="username">
					<el-input placeholder="请输入用户名" prefix-icon="iconfont icon-user" v-model="loginform.username">
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<!-- show-password密码显示与隐藏 -->
					<el-input placeholder="请输入密码" prefix-icon="iconfont icon-lock_fill" v-model="loginform.password"
						show-password>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="login-button" @click="login" >登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	//导入Animate.css动画库
	import 'animate.css';
	export default {
		data() {
			return {
				//表单的数据绑定对象
				loginform: {
					username: 'admin', //用户名
					password: '123456', //密码
				},
				//表单的效验规则
				loginformrules: {
					username: [{
							required: true, //是否为空
							message: '请输入用户名', //提示
							trigger: 'blur' //什么时候触发，鼠标移动开就触发
						},
						{
							min: 3,
							max: 10,
							message: '长度在 3 到 10 个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true, //是否为空
							message: '请输入密码 ', //提示
							trigger: 'blur' //什么时候触发，鼠标移动开就触发
						},
						{
							min: 6,
							max: 15,
							message: '长度在 6 到 15 个字符',
							trigger: 'blur'
						}
					],
				},
				// **********
			}
		},
		//定义方法
		methods: {
			login() {
				//判断是否效验成功        对整个表单进行校验的方法validate   async 是异步的意思
				this.$refs.loginformref.validate(async valid => {
					if (!valid) {
						//return //return结束
						alert('请检查用户名与密码')
						return
					}
					//发送请求成功判断是否登录成功
					//await 是等待的意思，await 用于等待一个异步任务执行完成的结果。
					//{data:res}
					const res = await this.$http.post('login', this.loginform) //已经在main.js定义默认地址
					//判断
					if (res.data.meta.status !== 200) {
						return this.$message.error('登录失败'); //Element 组件
					}
					this.$message.success('登录成功'); //Element 组件
					//将用户信息保存到sessionStorage中         setItem中只能存对象，需要用JSON.stringify转换为字符串
					sessionStorage.setItem('userinfo', JSON.stringify(res.data))
					//$router是在index.js定义的    push 添加
					this.$router.push('/home')
				})

			}
		},
		// ********

	}
</script>

<style lang="less" scoped>
	// -------------
	.login-container {
		//background-color: rgb(#8DD9FF);
		height: 100%;
		display: flex; //浮动
		justify-content: center; //水平居中
		align-items: center;
		// ********
		position: relative;
		background: radial-gradient(260% 67% at bottom center,
				#32cbc6 10%,
				#63baaa 40%,
				#00838f 65%,
				#263238 130%);
		overflow: hidden;

		// *****  定义动态粒子居于下层，加一个 position: absolute;，有新的盒子看设置为position:relative
		#particles-js {
			width: 100%;
			height: calc(100% - 100px);
			position: absolute;
		}

		// *********
		.login-left {
			margin-right: 100px;
			position: relative;
		}

		.login-box {

			width: 400px;
			height: 350px;
			background-color: #fff;
			padding: 50px;
			border-radius: 6px;
			box-sizing: border-box; //防止盒子的内容撑开盒子
			position: relative; //相对定位
			background: rgba(255, 255, 255, .3);
			border-radius: 10px;
			box-shadow: 5px 5px 20px 5px rgba(0, 0, 0, .3);
			backdrop-filter: blur(10px);


			.avatar-box {
				width: 120px;
				height: 120px;
				position: absolute; //绝对定位
				border: 5px solid rgb(#8DD9FF);
				border-radius: 100px; //圆角
				text-align: center;
				line-height: 110px;
				top: -60px;
				right: 140px;
				background-color: #fff;
			}

			//定义学院图标自动旋转动画
			img {
				border-radius: 100px;
				margin-top: 3px;
				margin-left: 4.5px;
				//动画持续时间---使用速记属性改变 <div> 元素的动画：
				animation: rotateImg 5s;
				//动画播放次数 infinite:无数次；---设置或返回动画的播放次数
				animation-iteration-count: infinite;
				//-webkit-animation: rotateImg 5s;
				//-webkit-animation-iteration-count: infinite;

				@keyframes rotateImg {
					0% {
						transform: rotate(0deg);
					}

					100% {
						transform: rotate(360deg);
					}
				}

				@-webkit-keyframes rotateImg {
					0% {
						-webkit-transform: rotate(0deg);
					}

					100% {
						-webkit-transform: rotate(360deg);
					}
				}


			}

			.title {
				position: absolute;
				top: 100px;
				left: 50%;
				transform: translate(-50%); //水平移动，第一个参数x,第二个参数y
				font-size: 18px;
				color: #444;
			}

			.login-form {
				position: absolute; //绝对定位
				bottom: 0;
				left: 50%;
				transform: translate(-50%); //水平移动，第一个参数x,第二个参数y
				padding: 20px;
				box-sizing: border-box; //防止盒子的内容撑开盒子
				width: 80%;

				.login-button {
					width: 100%;
				}
			}

		}

	}
</style>
