<template>
	<el-container style="height: 700px">
		<el-header style="background-color: #2c3e50; color: white">
			<back-nav />
		</el-header>
		<el-container style="height: 100%">
			<el-aside width="200px" style="background-color: #545c64">
				<SideNav />
			</el-aside>
			<el-main>
				<el-scrollbar>
					<el-row justify="center">
						<el-card class="box-card" style="width: 1000px;"
							body-style="background-color: #E3E3E3;height:500px;padding:0px">
							<el-row>
								<el-col :span="6">
									<div
										style="padding-top: 10px;padding-bottom:10px;background-color: #ffffff;border: 1px solid #E3E3E3;">
										<i class="el-icon-s-promotion"></i>用户列表
									</div>
									<div class="userBlockList">
										<div class="userBlock" style="padding-top: 5px;" @click="clickUser(item.userID)"
											v-for="(item) in userList" :key="item.userID">
											<el-row>
												<el-col :span="5">
													<div style="display: inline-block;">
														<el-avatar shape="square" icon="el-icon-user"
															style="background-color: aliceblue;color: #2C3E50;">
														</el-avatar>
													</div>
												</el-col>
												<el-col :span="16">
													<el-row justify="start">
														<div class="chatUser">
															用户{{item.userID}}-{{item.userName}}</div>
													</el-row>
												</el-col>
											</el-row>
											<el-divider></el-divider>
										</div>
									</div>
								</el-col>
								<el-col :span="18">
									<div class="chatArea">
										<p style="font-size: medium;font-weight: 100%;padding-top: 10px;padding-bottom: 10px;margin-top: 0px;margin-bottom: -1px;border: 1px solid #E3E3E3;"
											align="middle">
											<i class="el-icon-chat-dot-square"></i>
											{{chatUserID}}
										</p>
										<div ref="messageBoardInner" class="messageBoard">
											<!--el-scrollbar ref="messageBoardScrollbar" always-->
											<div class="message" v-for="(item) in messageData" :key="item.day_time">
												<!--时间-->
												<div class="timeLabel">
													<el-tag type="info" size="mini">
														{{item.day_time.slice(0,10)+' '+item.day_time.slice(11,19)}}
													</el-tag>
												</div>
												<!--将用户发送的消息固定在左边-->
												<div v-if="item.speaker==0">
													<el-row>
														<div class="contentCustomer">
															<span
																style="line-height: 23px;text-align: left;margin-left: 6px;">{{item.details}}</span>
														</div>
													</el-row>
												</div>
												<div v-else>
													<el-row>
														<el-col :span="12"></el-col>
														<el-col :span="12">
															<el-row justify="end">
																<div class="contentAdmin">
																	<span
																		style="line-height: 23px;text-align: left;margin-left: 60px;">{{item.details}}</span>
																</div>
															</el-row>
														</el-col>
													</el-row>
												</div>
											</div>
											<!--/el-scrollbar-->
										</div>
										<el-row>
											<el-input class="messageInput" type="textarea" v-model="inputMessage"
												resize="none" :autosize="{ minRows: 4, maxRows: 4}" :rows="2"
												placeholder="请输入内容">
											</el-input>
											<el-button class="sendButton" size="small" plain style="margin-left:0px;"
												@click="clickSendMessage">
												<p style="font-size: medium;font-weight: 500;">发</p>
												<p style="font-size: medium;font-weight: 500;">送</p>
											</el-button>
										</el-row>
									</div>
								</el-col>
							</el-row>
						</el-card>
					</el-row>
				</el-scrollbar>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import SideNav from "../../components/SideNav"
	import BackNav from "../../components/BackNav"
  import BaseUrl from "../../config"
	let cuserID // eslint-disable-line no-unused-vars
	let backupList = [] // eslint-disable-line no-unused-vars
	let backupMessage = [] // eslint-disable-line no-unused-vars

	export default {
		components: {
			SideNav,
			BackNav,
		},
		created() {
			this.getChatList()
			this.chatListTimer = setInterval(this.getChatList, 1000);
			this.chatTimer = setInterval(this.getMessage, 1000);
			console.log('开启计时器');

		},
		beforeRouteLeave() {
			clearInterval(this.chatListTimer);
			this.chatListTimer = null;
			clearInterval(this.chatTimer);
			this.chatTimer = null;
			console.log('关闭计时器');
		},
		data() {
			return {
				dialogVisible: false,
				isFirstChat: '',
				admin_id: '',
				inputMessage: '', //输入文本
				chatUserID: '回复用户',
				userList: [],
				tempMessageData: [],
				messageData: [],
				chatTimer: '',
				chatListTimer: '',
				max: 0,
				value: 0,
			}
		},
		methods: {
			//获取用户列表
			getChatList() {
				//调用接口 传入管理员ID，返回咨询列表
				this.axios.get(BaseUrl.ZHUNAR + '/api/chatrecord/a_user_id/' + window.sessionStorage.getItem('uid'))
					.then((Response) => {
						this.backupList = []
						for (let user of Response.data) {
							this.backupList.push({
								userID: user.c_user_id,
								userName: user.myname
							})
						}
						if (this.backupList != this.userList) {
							this.userList = this.backupList;
							/*console.log('获取聊天列表')
							console.log(this.userList)*/
						}
					})
			},
			
			//获取聊天记录
			getMessage() {
				//调用接口 传入userID和管理员ID，返回二者之间的聊天记录
				if (this.chatUserID != '回复用户') {
					let parameterList = {
						"a_user_id": parseInt(window.sessionStorage.getItem('uid'), 10),
						"c_user_id": this.cuserID
					}
					this.axios.post(BaseUrl.ZHUNAR + '/api/chatrecord/find', parameterList)
						.then((Response) => { // eslint-disable-line no-unused-vars
							console.log('获取聊天记录')
							console.log(this.messageData)
							if (Response.data.length != this.messageData.length) {
								this.messageData = Response.data
								console.log('聊天记录有更新')
							}
						})
				}
			},

			//点击某个用户
			clickUser(userID) {
				this.$message({ //检索到结果，反馈成功消息提示
					message: '连接到用户 ' + userID + ' 的聊天',
					type: 'success'
				});
				this.chatUserID = '用户 ' + userID + '-' + this.userList.find(item => item.userID == userID).userName;
				this.cuserID = userID;
				this.getMessage();
				this.messageData = this.tempMessageData;
			},
			
			//点击发送消息
			clickSendMessage() {
				this.getChatList()
				if (this.chatUserID === '回复用户') {
					this.$message({ //检索到结果，反馈成功消息提示
						message: '在左侧列表选择一个用户以开始聊天',
						type: 'error'
					});
					this.inputMessage = '';
					return;
				} else if (this.inputMessage != '') {
					//调用接口 传入userID、管理员ID和聊天内容，无返回
					let parameterList = {
						"a_user_id": parseInt(window.sessionStorage.getItem('uid'), 10),
						"c_user_id": this.cuserID,
						"speaker": 1,
						"details": this.inputMessage,
					}
					this.axios.post(BaseUrl.ZHUNAR + '/api/chatrecord/add', parameterList)
						.finally(() => {
							this.getMessage()
						})
					this.inputMessage = '';
				}
			},
		},
	}
</script>

<!--聊天框的样式-->
<style scoped>
	.timeLabel {
		padding: 15px 0px;
	}

	.contentCustomer :hover {
		background-color: #FAFAFA;
	}

	.contentCustomer span {
		background-color: #ecf5ff;
		padding: 5px 8px;
		display: inline-block;
		border-radius: 10px;
		margin: 0px 0px 0px 5px;
		position: relative;
		border: 1px solid #E3E3E3;
		max-width: 290px;
	}

	.contentAdmin {
		float: right;
	}

	.contentAdmin :hover {
		background-color: #0a61cc;
	}

	.contentAdmin span {
		background-color: #2683f5;
		padding: 5px 8px;
		display: inline-block;
		border-radius: 10px;
		margin: 0px 5px 0px 0px;
		position: relative;
		border: 1px solid #E3E3E3;
		max-width: 290px;
		color: #fff;
	}

	.messageBoard {
		overflow-x: hidden;
		overflow-y: auto;
		height: 364px;
		width: 100%;
		border: 1px solid #DCDCDC;
		background-color: #fff;
		display: flex;
		flex-direction: column-reverse;
	}

	/*.messageBoardScrollbar {
		overflow-x: hidden;
		overflow-y: auto;
		display: flex;
		flex-direction: column-reverse;
	}*/

	.chatUser {
		color: #2c2c2c;
		font-size: 16px;
		font-weight: 500;
		text-align: left;
		display: inline-block;
		text-align: left;
		margin: 10px 5px 10px 5px;
	}

	.el-divider {
		background-color: #E3E3E3;
		position: relative;
		margin-left: 10px;
	}

	.userBlockList :hover {
		background-color: #eeebe9;
	}

	.userBlock span {
		background-color: #eeebe9;
		display: inline-block;
		float: left;
		margin-left: 0px;
		margin-top: 0px;
		margin-bottom: -10px;
	}

	.el-divider--horizontal {
		display: block;
		height: 1px;
		width: 80%;
		margin: 5px 0;
	}

	.userBlockList {
		width: 93%;
		padding: 10px;
	}

	.messageInput {
		width: 700px;
		margin-left: 0px;
		border: #2C3E50;
	}

	.sendButton {
		width: 50px;
		height: 92px;
		padding: 0px;
	}

	.chatArea {
		overflow: hidden;
		height: 500px;
		width: 100%;
		background-color: #fff;
		display: block;
	}
</style>
