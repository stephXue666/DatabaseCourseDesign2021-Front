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
				<el-card class="box-card" body-style="background-color: #E3E3E3;width:1000px;height:500px;padding:0px">
					<!--这里写代码-->
					<el-row>
						<el-col :span="6">
							<div class="userBlockList">
								<div class="userBlock" @click="clickUser(item.userID)" v-for="(item) in userList"
									:key="item.userID">
									<div style="display: inline-block;padding: 12px;">
										<el-avatar shape="square" icon="el-icon-user"
											style="background-color: aliceblue;color: #2C3E50;"></el-avatar>
									</div>
									<div style="display: inline-block;">
										<el-col>
											<div class="chatUser">用户{{item.userID}}</div>
										</el-col>
									</div>
									<el-divider></el-divider>
								</div>
							</div>
						</el-col>
						<el-col :span="18">
							<div class="chatArea">
								<p style="font-size: medium;font-weight: 600;margin-top: 5px;margin-bottom: 5px;"
									align="middle">
									{{chatUserID}}
								</p>
								<div class="messageBoard">
									<div class="message" v-for="(item) in messageData" :key="item.day_time">
										<!--时间-->
										<div class="timeLabel">
											<el-tag type="info" size="mini">{{item.day_time}}</el-tag>
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
								</div>
								<el-input class="messageInput" type="textarea" v-model="inputMessage" resize="none"
									:autosize="{ minRows: 4, maxRows: 4}" :rows="2" placeholder="请输入内容">
								</el-input>
								<el-button class="sendButton" plain size="8px" style="margin-left: 0px;"
									@click="clickSendMessage">
									<p style="font-size: medium;font-weight: 500;">发</p>
									<p style="font-size: medium;font-weight: 500;">送</p>
								</el-button>
							</div>
						</el-col>
					</el-row>
				</el-card>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import SideNav from "../../components/SideNav"
	import BackNav from "../../components/BackNav"

	let adminID = 'a1354151648'
	let cuserID
	export default {
		components: {
			SideNav,
			BackNav,
		},
		data() {
			return {
				dialogVisible: false,
				isFirstChat: '',
				admin_id: '',
				inputMessage: '', //输入文本
				chatUserID: '回复用户',
				userList: [{
						userID: 'c1211342135',
					},
					{
						userID: 'c2121323123',
					}
				],
				tempMessageData: [{
					a_user_id: 'c1211342135',
					c_user_id: 'a1354151648',
					day_time: '2021/7/8 16:01',
					speaker: '1',
					details: '您好！这里是客服小A，很高兴为您服务！请问有什么可以帮到您？',
				}, {
					a_user_id: 'c1211342135',
					c_user_id: 'a1354151648',
					day_time: '2021/7/8 16:02',
					speaker: '0',
					details: '查询上海市同济大学嘉定校区附近的酒店,并返回它们的名称、地址、最低价。',
				}, ], //聊天信息
				messageData: [],
				chatTimer: '',
				chatListTimer: '',
			}
		},
		create() {
			this.chatListTimer = setInterval(this.getMessageData, 5000);
			this.chatTimer = setInterval(this.getMessageData, 5000);
			console.log('开启计时器');
		},
		beforeDestory() {
			clearInterval(this.chatListTimer);
			this.chatListTimer = null;
			clearInterval(this.chatTimer);
			this.chatTimer = null;
			console.log('关闭计时器');
		},
		methods: {
			getChatList() {
				//调用接口- 传入管理员ID，返回咨询列表
				console.log('获取聊天列表')
			},
			getMessage() {
				//调用接口- 传入userID和管理员ID，返回二者之间的聊天记录				
				console.log('获取聊天记录')
			},
			clickUser(userID) {
				this.$message({ //检索到结果，反馈成功消息提示
					message: '连接到用户 ' + userID + ' 的聊天',
					type: 'success'
				});
				this.chatUserID = '用户 ' + userID;
				cuserID = userID;
				this.getMessage();
				this.messageData = this.tempMessageData;
			},
			clickSendMessage() {
				if (this.chatUserID === '回复用户') {
					this.$message({ //检索到结果，反馈成功消息提示
						message: '在左侧列表选择一个用户以开始聊天',
						type: 'error'
					});
					this.inputMessage = '';
					return;
				}
				//调用接口- 传入userID、管理员ID和聊天内容，无返回
				this.messageData.push({
					a_user_id: cuserID,
					c_user_id: adminID,
					day_time: '2021/7/8 16:02',
					speaker: '1',
					details: this.inputMessage,
				})
				this.inputMessage = '';
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
		overflow: hidden;
		height: 374px;
		width: 100%;
		border: 1px solid #DCDCDC;
		background-color: #fff;
		display: block;
	}

	.chatUser {
		color: #2c2c2c;
		font-size: 16px;
		font-weight: 500;
		text-align: left;
		margin-left: -20px;
		margin-bottom: 13px;
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
		margin-left: -60px;
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
		border: 1px solid #DCDCDC;
		background-color: #fff;
		display: block;
	}
</style>
