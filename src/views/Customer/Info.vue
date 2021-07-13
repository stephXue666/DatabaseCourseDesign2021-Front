<template>
  <el-container>
    <div style="
        background-image: url(//s2.hdslb.com/bfs/static/blive/blfe-dynamic-web/static/img/background.bc725153.png);
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size:100% 100%;">
    <el-header style="padding: 0">
      <top-nav/>
    </el-header>
    <el-main>
      <el-card style="margin:2% 20%; height:540px">
        <el-descriptions title="账号信息" :column="2" border>
          <template #extra>
            <el-button type="primary" @click="modifyPass">修改密码</el-button>
          </template>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-user"></i>
              用户名
            </template>
            {{ info.userName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label style="width: 200px">
              <i class="el-icon-lock"></i>
              密码
            </template>
            <el-row>
              <el-col :span="18">
                <span v-if="isHide">{{ hidePassword }}</span>
                <span v-else>{{ info.password }}</span>
              </el-col>
              <el-col :span="6">
                <el-button icon="el-icon-view" circle size="mini" @click="changeHide"></el-button>
              </el-col>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>
        <el-divider/>
        <el-descriptions title="个人信息" :column="2" border>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-user"></i>
              姓名
            </template>
            {{ info.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-male"></i>
              <i class="el-icon-female"></i>
              性别
            </template>
            {{ info.gender }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-date"></i>
              生日
            </template>
            {{ info.birthday }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-postcard"></i>
              身份证
            </template>
            {{ info.IDNumber }}
          </el-descriptions-item>
        </el-descriptions>
        <el-divider/>
        <!--展示信息描述框-->
        <el-descriptions title="其他信息" :column="2" border>
          <template #extra>
            <el-button v-if="!isModify" @click="modify" type="primary">修改</el-button>
            <el-button v-if="isModify" @click="submit" type="success">确认</el-button>
            <el-button v-if="isModify" @click="cancel" type="danger">取消</el-button>
          </template>
          <!--修改信息表单-->
          <el-descriptions-item v-if =isModify>
            <template #label>
              <el-form :inline="true" :model="infoModify" ref="infoModify" :rules="rules"
                       label-width="80px" style="height: 46px" size="small">
                <el-form-item prop="newName" style="width: 350px">
                  <template #label>
                    <i class="el-icon-user"></i>
                    昵称
                  </template>
                  <el-input v-model="infoModify.newName"></el-input>
                </el-form-item>
                <el-form-item prop="newPhone" style="width: 350px; margin-left: 40px">
                  <template #label>
                    <i class="el-icon-mobile-phone"></i>
                    手机号
                  </template>
                  <el-input v-model="infoModify.newPhone"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-descriptions-item>
          <el-descriptions-item v-if ="!isModify">
            <template #label>
              <i class="el-icon-user"></i>
              昵称
            </template>
            <label v-if="!isModify">{{ info.nickName }}</label>
          </el-descriptions-item>
          <el-descriptions-item v-if="!isModify">
            <template #label>
              <i class="el-icon-mobile-phone"></i>
              手机号
            </template>
            <label v-if="!isModify">{{ info.phone }}</label>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <!--修改密码窗口-->
      <el-dialog title="修改密码" v-model="isReset" width="30%" top="10%" @closed="cancelPass">
        <el-form :model="modifyForm" ref="modifyForm" label-width="80px"
                 style="margin-left: 7%; margin-right: 13%" :rules="rules">
          <el-form-item label="原密码" prop="old">
            <el-input v-model="modifyForm.old" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new">
            <el-input v-model="modifyForm.new" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirm">
            <el-input v-model="modifyForm.confirm" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="submitPass(modifyForm)" style="width: 48%">确 定</el-button>
            <el-button type="danger" @click="cancelPass" style="width: 48%">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
    </div>
    <el-footer style="background-color: #f6f9fa; height:100%">
    <p style="margin:0px; padding:30px 0px 40px 0px">
      Copyright ©2021 住哪儿-酒店预定平台
    </p>
  </el-footer>
  </el-container>

</template>

<script>
import TopNav from "../../components/TopNav";
import { ElMessage } from 'element-plus'
export default {
	components: {
    TopNav,
	},
	data() {
    //修改电话验证
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('电话不能为空！'));
      }
      else {
        callback();
      }
    }
    //修改昵称验证
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('昵称不能为空！'));
      }
      else {
        callback();
      }
    }
    //修改密码原密码验证
    const validateOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'));
      }
      else if (value !== this.info.password) {
        callback(new Error('原密码错误!'));
      }
      else {
        callback();
      }
    }
    //修改密码新密码验证
    const validateNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
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
    }
    //修改密码再次输入验证
    const validateConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.modifyForm.new) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      isModify: false,    //控制修改信息框的显隐
      isReset: false,   //控制修改密码窗口的显隐
      info: {},
      modifyForm: {
        old: '',
        new: '',
        confirm: '',
      },
      infoModify: {
        newPhone: '',
        newName: '',
      },
      isHide: true,    //控制隐藏密码
      hidePassword: '',
      rules: {
        old: [{ validator: validateOld, trigger: 'blur'}],
        new: [{ validator: validateNew, trigger: 'blur'}],
        confirm: [{ validator: validateConfirm, trigger: 'blur' }],
        newName: [{ validator: validateName, trigger: 'blur' }],
        newPhone: [{ validator: validatePhone, trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    //获取个人信息
    getInfo() {
      //调用接口- 传入用户ID，返回个人信息
      this.info = {
        userName: 'abc12123',
        password: '123456',
        name: '张三',
        gender: '男',
        birthday: '2000-01-01',
        IDNumber: '123454200001011234',
        nickName: '某张三',
        phone: '12345678900',
      }

      let hideLen = this.info.password.length
      this.hidePassword = '***************'.substring(0,hideLen)
    },
    //修改密码显隐状态
    changeHide() {
      this.isHide = !this.isHide
    },
    //修改密码
    modifyPass() {
      if(this.isHide === false)
        this.changeHide()
      this.isModify = false
      this.isReset = true
    },
    //提交修改密码
    submitPass(form) {
      this.$refs['modifyForm'].validate((valid) => {
        if (valid) {
          let uid = window.sessionStorage.getItem('uid')
          console.log(form.new, uid)
          //调用接口- 传入用户ID、新密码，无返回

          ElMessage.success('密码修改成功')
          this.info.password = this.modifyForm.new
          this.isReset = false
          this.refs.modifyForm.resetFields()
        }
        else {
          return false
        }
      })
    },
    //取消修改密码
    cancelPass() {
      this.isReset = false
      this.$refs.modifyForm.resetFields()
    },
    //修改信息
    modify() {
      this.infoModify.newName = this.info.nickName
      this.infoModify.newPhone = this.info.phone
      this.isModify = true
    },
    //提交修改信息
    submit() {
      this.$refs['infoModify'].validate((valid) => {
        if (valid) {
          let uid = window.sessionStorage.getItem('uid')
          this.info.nickName = this.infoModify.newName
          this.info.phone = this.infoModify.newPhone
          console.log(uid, this.info)
          //调用接口- 传入用户ID、所有信息，无返回

          ElMessage.success('信息修改成功')
          this.isModify = false
          this.refs.infoModify.resetFields()
        }
        else {
          return false
        }
      })
    },
    //取消修改信息
    cancel() {
      this.$refs.infoModify.resetFields()
      this.isModify = false
    },
  },
}
</script>

