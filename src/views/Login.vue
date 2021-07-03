<template>
  <div :style ="bg">
    <!--登录窗口-->
    <el-card v-if="isRegistered" style="margin-left: 33%; margin-right: 33%; margin-top: 10%">
      <h2>用户登录</h2>
      <el-form :model="loginForm" status-icon ref="loginForm" label-width="80px"
               style="margin-left: 7%; margin-right: 13%" :rules="rules">
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="loginForm.type" >
            <el-radio-button label="住户"></el-radio-button>
            <el-radio-button label="酒店"></el-radio-button>
            <el-radio-button label="管理员"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="loginForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="startRegister" style="width: 48%">注册</el-button>
          <el-button type="success" @click="logIn(loginForm)" style="width: 48%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--注册窗口-->
    <el-card v-else style="margin-left: 33%; margin-right: 33%; margin-top: 10%">
      <h2>用户注册</h2>
      <el-form :model="registerForm" status-icon ref="registerForm" label-width="80px"
               style="margin-left: 7%; margin-right: 13%" :rules="rules">
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="registerForm.type" >
            <el-radio-button label="住户"></el-radio-button>
            <el-radio-button label="酒店"></el-radio-button>
            <el-radio-button label="管理员"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号" prop="newAccount">
          <el-input v-model="registerForm.newAccount"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="newPassword">
          <el-input v-model="registerForm.newPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm">
          <el-input v-model="registerForm.confirm" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="register(registerForm)" style="width: 48%">完成</el-button>
          <el-button type="danger" @click="cancelRegister" style="width: 48%">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <!--暂时用按钮跳转，后续用表单提交，结果正确时跳转-->
  <div>
    <el-button @click="testLogIn(1)">登录住户成功</el-button>
    <el-button @click="testLogIn(2)">登录酒店成功</el-button>
    <el-button @click="testLogIn(4)">登录酒店未审核</el-button>
    <el-button @click="testLogIn(3)">登录管理员成功</el-button>
    <el-button @click="testLogIn(0)">返回</el-button>
    <el-button @click="test">测试</el-button>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
export default {
  data() {
    //登录账户验证规则
    const validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'));
      } else {
        callback();
      }
    };
    //登录密码验证规则
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    //注册账户验证规则
    const validateNewAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'));
      }
      else {
        let isUsed = false
        switch (this.registerForm.type) {
          case '住户':
            //调用接口- 给账号密码，返回是否有相同账号
            isUsed = (value === 'test')

            break
          case '酒店':
            //调用接口- 给账号密码，返回是否有相同账号
            isUsed = (value === 'test')

            break
          case '管理员':
            //调用接口- 给账号密码，返回是否有相同账号
            isUsed = (value === 'test')

            break

        }
        if (isUsed) {
          callback(new Error('该账号已存在!'));
        }
        else {
          callback();
        }
      }
    };
    //注册密码验证规则
    const validateNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
      else if (value.length < 6) {
        callback(new Error('密码应不少于6位'));
      }
      else if(value.length > 15) {
        callback(new Error('密码应不超过15位'));
      }
      else {
        callback();
      }
    };
    //注册密码再次输入验证
    const validateConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      isRegistered: true,   //是否已注册，控制两种窗口的切换
      bg: {   //登录注册页面的背景样式
        backgroundImage: "url(" + require("../assets/loginBackground.jpg") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        height: "700px",
        border: "white 1px solid",
      },
      loginForm: {    //登录表单
        type: '住户',
        account: '',
        password: '',
      },
      registerForm: {   //注册表单
        type: '住户',
        newAccount: '',
        newPassword: '',
        confirm: '',
      },
      rules: {    //表单验证规则
        account: [{ validator: validateAccount, trigger: 'blur'}],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        newAccount: [{ validator: validateNewAccount, trigger: 'blur'}],
        newPassword: [{ validator: validateNewPassword, trigger: 'blur' }],
        confirm: [{ validator: validateConfirm, trigger: 'blur' }],
      }
    }
  },
  methods: {
    //测试功能
    test() {
      let url = 'http://106.15.179.2:8080/staff/all'
      this.axios.get(url).then((response) => {
        console.log(response)
      })
    },
    //用户登录分流
    logIn(form) {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          switch (form.type) {
            case '住户':
              this.customerLogin(form.account, form.password)
              break
            case '酒店':
              this.hotelLogin(form.account, form.password)
              break
            case '管理员':
              this.adminLogin(form.account, form.password)
              break
          }
        }
        else {
          return false
        }
      });
    },
    //住户登录
    customerLogin(account, password) {
      console.log(account, password)
      //调用接口- 传入账号密码，返回是否正确、用户ID
      let uid ='1'
      let isRight = true

      if(!isRight) {
        ElMessage.error('账号或密码错误！')
        return
      }
      ElMessage.success({
        message: '登录成功！',
        type: 'success'
      });
      window.sessionStorage.setItem('uid', uid)
      this.$router.push('/home')
    },
    //酒店登录
    hotelLogin(account, password) {
      console.log(account, password)
      //调用接口- 传入账号密码，返回是否正确、是否通过审核、酒店ID
      let uid ='2'
      let isPassed = true
      let isRight = true

      if(!isRight) {
        ElMessage.error('账号或密码错误！')
        return
      }
      ElMessage.success({
        message: '登录成功',
        type: 'success'
      });
      window.sessionStorage.setItem('uid', uid)
      if(isPassed === true)
        this.$router.push('/hotel/home')
      else
        this.$router.push('/hotel/wait')
    },
    //管理员登录
    adminLogin(account, password) {
      console.log(account, password)
      //调用接口- 传入账号密码，返回是否正确、管理员ID
      let uid ='3'
      let isRight = true

      if(!isRight) {
        ElMessage.error('账号或密码错误！')
        return
      }
      ElMessage.success({
        message: '登录成功',
        type: 'success'
      });
      window.sessionStorage.setItem('uid', uid)
      this.$router.push('/admin/home')
    },
    //用户注册分流
    register(form) {
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          switch (form.type) {
            case '住户':
              this.customerRegister(form.newAccount, form.newPassword)
              break
            case '酒店':
              this.hotelRegister(form.newAccount, form.newPassword)
              break
            case '管理员':
              this.adminRegister(form.newAccount, form.newPassword)
              break
          }
          ElMessage.success('注册成功！')
          this.cancelRegister()
        }
        else {
          return false
        }
      });
    },
    //住户注册
    customerRegister(account, password) {
      console.log(account, password)
      //调用接口- 传入账号密码，无返回

    },
    //酒店注册
    hotelRegister(account, password) {
      console.log(account, password)
      //调用接口- 传入账号密码，无返回

    },
    //管理员注册
    adminRegister(account, password) {
      console.log(account, password)
      //调用接口- 传入账号密码，无返回

    },
    //开始注册，切换到注册窗口
    startRegister() {
      this.isRegistered = false
      this.$refs.loginForm.resetFields()
    },
    //取消注册，切换回登录窗口
    cancelRegister() {
      this.isRegistered = true
      this.$refs.registerForm.resetFields()
    },
    //测试用登录函数
    testLogIn(character) {
      //设置session中的id值为用户ID
      switch (character) {
        case 0:
          this.$router.push('/home')
          break
        case 1:
          window.sessionStorage.setItem('uid', '1')
          this.$router.push('/home')
          break
        case 2:
          window.sessionStorage.setItem('uid', '2')
          this.$router.push('/hotel/home')
          break
        case 3:
          window.sessionStorage.setItem('uid', '3')
          this.$router.push('/admin/home')
          break
        case 4:
          window.sessionStorage.setItem('uid', '2')
          this.$router.push('/hotel/wait')
          break
      }

    },
  }
}
</script>

<style scoped>

</style>