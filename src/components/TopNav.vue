<template>
  <div style="background-color: #409EFF; height: 60px">
    <el-row>
      <el-col :span="8">
        <el-space>
          <el-image :src="logoURL" style="width: 50px"></el-image>
          <h2 style="color: white; margin-top: 10px">住哪儿-酒店预定平台</h2>
        </el-space>
      </el-col>
      <!--未登录状态的导航栏-->
      <el-col :offset="11" :span="5">
        <el-menu v-if="!loginStatus" default-active='/home' mode="horizontal" background-color="#409EFF"
                 text-color="#fff" active-text-color="#ffd04b" style="border-bottom: 0" router>
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/login">登录/注册</el-menu-item>
      </el-menu>
      <!--已登录状态的导航栏-->
        <el-menu v-else :default-active="$route.path" mode="horizontal" background-color="#409EFF"
                 text-color="#fff" active-text-color="#ffd04b" style="border-bottom: 0" router>
        <el-menu-item index="/home">首页</el-menu-item>
        <el-submenu>
          <template #title>个人中心</template>
          <el-menu-item index="/info">个人信息管理</el-menu-item>
          <el-menu-item index="/history">浏览记录</el-menu-item>
          <el-menu-item index="/favorite">酒店收藏</el-menu-item>
          <el-menu-item index="/order">订单管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="/logout" @click="logOut">注销</el-menu-item>
        

      </el-menu>
      </el-col>
    </el-row>
  </div>
  <!--"联系客服"按钮固定在住户页面右下角，住户未登录时，禁用该按钮-->
  <div style="position: fixed;bottom: 10px;right: 50px; z-index: 100;">
    <el-affix position="bottom" :offset="20">
      <el-tooltip effect="dark" content="客服" placement="left">
          <el-button style="padding:17px;font-size:large;" type="plain" icon="el-icon-phone-outline" circle :disabled="!loginStatus"
          @click="openDialog"></el-button>
      </el-tooltip>
    </el-affix>
  </div>
  <!--聊天使用的对话框-->
  <el-dialog title="聊天窗口" v-model="dialogVisible" width="40%" @close="closeDialog">
    <!--用表格显示聊天信息-->
    <div class="messageBoard">
    <div v-for="(item) in messageData" :key="item.day_time">
						<div class="timeLabel">
							<el-tag type="info" size="mini">{{item.day_time.replace('T', ' ')}}</el-tag>
						</div>
						<div v-if="item.speaker===1">
							<el-row>
								<div class="contentAdmin">
									<span style="line-height: 23px;text-align: left;">{{item.details}}</span>
								</div>
							</el-row>
						</div>
						<div v-else>
							<el-row>
								<el-col :span="12"></el-col>
								<el-col :span="12">
									<el-row justify="end">
										<div class="contentCustomer">
											<span style="line-height: 23px;text-align: left;">{{item.details}}</span>
										</div>
									</el-row>
								</el-col>
							</el-row>
						</div>
					</div>
    </div>
    <div style="margin-bottom: 20px;"></div>
    <!--输入区,按enter键或点击“发送”发出消息-->
    <el-input
      type="textarea"
      placeholder="请输入内容"
      v-model="textarea"
      :autosize="{minRows: 4, maxRows: 6}"
      maxlength="200"
      show-word-limit
      @keydown.enter="handleSendMessage">
    </el-input>
  <!--按钮操作区-->
    <template #footer>
    <!--按钮置于一行内-->
      <span class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="handleSendMessage">发送</el-button>
      </span>
    </template>
  </el-dialog>
</template>


<script>
import {ElMessage} from "element-plus";
import BaseUrl from "../config"
export default {
  data() {
    return {
      logoURL: require('../assets/logo.png'),
      activeIndex: '',
      loginStatus: false,
      dialogVisible: false,
      isFirstChat:'',
      admin_id:'',
      textarea:'',     //输入文本
      messageData: [], //聊天信息
      timer:'',        //计时器
    }
  },
  created() {
    this.getLoginStatus();
  },

  methods: {
    logOut() {
      //设置session中的id值为用户ID
      window.sessionStorage.setItem('uid', '0')
      ElMessage.success('注销成功！')
      this.loginStatus = false
    },
    getLoginStatus() {
      let status = window.sessionStorage.getItem('uid')
      switch (status) {
        case null:
          window.sessionStorage.setItem('uid', '0')
          break
        case '0':
          break
        //若用户id不为0，则设定登录状态为true
        default:
          this.loginStatus = true
          break
      }
    },
    openDialog(){
      //打开客服交流对话框
      this.dialogVisible = true;
      console.log(window.sessionStorage.getItem('uid'));

      //调用接口-判断用户是否是第一次查询：传入用户id -返回管理员id（存储到admin_id中）
      //改
        this.axios.get(BaseUrl.ZHUNAR+'/api/chatrecord/judgefirst/'+window.sessionStorage.getItem('uid')).then((response)=>{
        this.admin_id = response.data;
      })

      //打开时获取一次聊天信息，然后每五秒获取一次 
      this.getMessageData();
      this.timer = setInterval(this.getMessageData, 1000);
    },
    closeDialog(){
      //关闭对话框，清除计时器
      this.dialogVisible = false;
      clearInterval(this.timer);
      this.timer = null;
    },
    getMessageData(){
      //调用接口-查询聊天记录：请求参数：用户id（window.sessionStorage.getItem'uid'） -返回：两者的聊天记录ChatRecord（list
      //改
      this.axios.get(BaseUrl.ZHUNAR+'/api/chatrecord/c_user_id/'+window.sessionStorage.getItem('uid')).then((chatResponse)=>{
      console.log(chatResponse);
      this.messageData=[];
      for(let item of chatResponse.data){
          this.messageData.push(item);
        }
      })
      console.log("获取聊天信息");
    },

    handleSendMessage(){
      //点击“发送”按钮或按回车，发送textarea中的文本，同时清空输入栏并刷新一次聊天信息。
      //调用接口-增加聊天记录：请求参数：ChatRecord除了时间以外的所有参数{admin_id,window.sessionStorage.getItem('uid'),'0',textarea,} - 返回：success
      if(this.textarea !== ''){
      let message={
        a_user_id:this.admin_id,
        c_user_id:parseInt(window.sessionStorage.getItem('uid')),//改
        speaker:0,
        details:this.textarea,
      }
      console.log(window.sessionStorage.getItem('uid'));
      this.axios.post(BaseUrl.ZHUNAR+'/api/chatrecord/add',message);
      console.log(this.textarea);
      this.textarea = '';
      this.getMessageData();
      }
    },
  },
}
</script>

<!--聊天框的样式-->
<style scoped>
 .timeLabel{
   padding: 10px 0px;
 }

 .contentAdmin :hover {
    background-color: #FAFAFA;
  }

  .contentAdmin span {
    background-color: #ecf5ff;
    padding: 5px 8px;
    display: inline-block;
    border-radius: 10px;
    margin: 0px 0px 5px 5px;
    position: relative;
    border: 1px solid #E3E3E3;
    max-width: 290px;
  }

  .contentCustomer :hover {
    background-color: #0a61cc;
  }

  .contentCustomer span {
    background-color: #2683f5;
    padding: 5px 8px;
    display: inline-block;
    border-radius: 10px;
    margin: 0px 5px 5px 0px;
    position: relative;
    border: 1px solid #E3E3E3;
    max-width: 290px;
    color: #fff;
  }

  .messageBoard {
    overflow-x: hidden;
    overflow-y: auto;
    height: 300px;
    width: 100%;
    border: 1px solid #DCDCDC;
    background-color: #fff;
    display: flex;
    flex-direction: column-reverse;
  }
</style>