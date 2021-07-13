<template>
  <el-scrollbar>
    <el-container style="height: 700px">
      <el-header style="background-color: #2c3e50; color: white">
        <back-nav/>
      </el-header>
      <el-container>
        <el-aside width="200px" style="background-color: #545c64">
          <side-nav/>
        </el-aside>
        <el-container direction="vertical">
          <el-main>
            <el-card class="box-card">
              <!--展示酒店账号信息-->
              <el-descriptions title="账号信息" :column="3" border>
                <template #extra>
                  <el-button type="primary" @click="modifyPass">修改密码</el-button>
                </template>
                <el-descriptions-item>
                  <template #label>
                    <i class="el-icon-info"></i>
                    酒店编号
                  </template>
                  {{ accountInfo.hotelID }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <i class="el-icon-user"></i>
                    用户名
                  </template>
                  {{ accountInfo.userName }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label style="width: 200px">
                    <i class="el-icon-lock"></i>
                    密码
                  </template>
                  <el-row>
                    <el-col :span="18">
                      <span v-if="isHide">{{ hidePassword }}</span>
                      <span v-else>{{ accountInfo.password }}</span>
                    </el-col>
                    <el-col :span="6">
                      <el-button icon="el-icon-view" circle size="mini" @click="changeHide"></el-button>
                    </el-col>
                  </el-row>
                </el-descriptions-item>
              </el-descriptions>
              <el-divider/>
              <el-row>
                <el-col :span="12">
                  <!--可修改的酒店信息-->
                  <el-descriptions title="酒店信息" :column="1" border>
                    <template #extra style="margin-bottom: 6px">
                      <el-button v-if="!isModify" @click="modify" type="primary">修改</el-button>
                      <el-button v-if="isModify" @click="submit" type="success">确认</el-button>
                      <el-button v-if="isModify" @click="cancel" type="danger">取消</el-button>
                    </template>
                    <!--修改信息表单-->
                    <el-descriptions-item v-if =isModify>
                      <template #label>
                        <el-form :model="infoModify" ref="infoModify" :rules="rules"
                                 label-width="90px" style="height: 275px" size="small">
                          <el-form-item prop="newName" style="width: 560px">
                            <template #label>
                              <i class="el-icon-office-building"></i>
                              酒店名称
                            </template>
                            <el-input maxlength="30" show-word-limit v-model="infoModify.newName"></el-input>
                          </el-form-item>
                          <el-form-item prop="newPhone" style="width: 280px">
                            <template #label>
                              <i class="el-icon-mobile-phone"></i>
                              联系电话
                            </template>
                            <el-input v-model="infoModify.newPhone"></el-input>
                          </el-form-item>
                          <el-form-item prop="newDetails" style="width: 560px">
                            <template #label>
                              <i class="el-icon-document"></i>
                              酒店描述
                            </template>
                            <el-input type="textarea" v-model="infoModify.newDetails" :autosize="{ minRows: 4, maxRows: 8}"
                                      maxlength="600" resize="none" show-word-limit class="input"></el-input>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-descriptions-item>
                    <el-descriptions-item v-if ="!isModify">
                      <template #label>
                        <i class="el-icon-office-building"></i>
                        酒店名称
                      </template>
                      <label v-if="!isModify">{{ hotelInfo.name }}</label>
                    </el-descriptions-item>
                    <el-descriptions-item v-if="!isModify">
                      <template #label>
                        <i class="el-icon-mobile-phone"></i>
                        联系电话
                      </template>
                      <label v-if="!isModify">{{ hotelInfo.phone }}</label>
                    </el-descriptions-item>
                  </el-descriptions>
                  <!--酒店描述-->
                  <el-descriptions :column="1" border>
                    <el-descriptions-item v-if ="!isModify">
                      <template #label>
                        <i class="el-icon-document"></i>
                        酒店描述
                      </template>
                      <label v-if="!isModify">{{ hotelInfo.details }}</label>
                    </el-descriptions-item>
                  </el-descriptions>
                  <br>
                  <!--展示酒店实体信息-->
                  <el-descriptions title="其他信息" :column="2" border>
                    <el-descriptions-item>
                      <template #label>
                        <i class="el-icon-position"></i>
                        酒店所在地
                      </template>
                      {{ hotelInfo.province }} /
                      {{ hotelInfo.city }} /
                      {{ hotelInfo.region }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <i class="el-icon-map-location"></i>
                        详细地址
                      </template>
                      {{ hotelInfo.location }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <i class="el-icon-star-off"></i>
                        酒店星级
                      </template>
                      <el-rate v-model="hotelInfo.star" disabled text-color="#ff9900"
                               disabled-void-color="white">
                      </el-rate>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <i class="el-icon-thumb"></i>
                        当前评分
                      </template>
                      <el-rate v-model="hotelInfo.score" disabled show-score text-color="#99A9BF" score-template="{value}"
                               :icon-classes="['iconfont icon-chaping', 'iconfont icon-zhongping', 'iconfont icon-haoping']"
                               disabled-void-color="white" :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                      </el-rate>
                    </el-descriptions-item>
                  </el-descriptions>
                </el-col>
                <el-col :span="11" :offset="1">
                  <!--展示图片管理-->
                  <el-row>
                    <el-col :span="14" style="text-align: left">
                      <span style="font-weight: 800;font-size: 16px">酒店展示图</span><br><br>
                      <el-image :src="pic[0]">
                        <template #error>
                          <span style="color:darkorange">
                            <i class="el-icon-circle-close"></i>
                            请先提交主要图片
                          </span>
                        </template>
                      </el-image>
                    </el-col>
                    <el-col :span="9" :offset="1">
                      <el-image :src="pic[1]">
                        <template #error>
                          <span style="color:darkorange">
                            <i class="el-icon-circle-close"></i>
                            请先提交次要图片1
                          </span>
                        </template>
                      </el-image><br><br>
                      <el-image :src="pic[2]" alt="暂无次要图片">
                        <template #error>
                          <span style="color:darkorange">
                            <i class="el-icon-circle-close"></i>
                            请先提交次要图片2
                          </span>
                        </template>
                      </el-image>
                    </el-col>
                  </el-row>
                  <!--展示酒店资质信息-->
                  <el-collapse><el-collapse-item>
                    <template #title>
                      <span style="font-weight: 800;font-size: 16px;color: gray">资质信息</span>
                    </template>
                    <el-descriptions :column="2" border>
                      <el-descriptions-item>
                        <template #label>
                          <i class="el-icon-document"></i>
                          卫生许可证
                        </template>
                        <label>{{ permitInfo.permit1 }}</label>
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template #label>
                          <i class="el-icon-document"></i>
                          消防检查合格证
                        </template>
                        <label>{{ permitInfo.permit2 }}</label>
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template #label>
                          <i class="el-icon-document"></i>
                          餐饮服务经营许可证
                        </template>
                        <label>{{ permitInfo.permit3 }}</label>
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template #label>
                          <i class="el-icon-user"></i>
                          审核管理员ID
                        </template>
                        <label>{{ permitInfo.adminID }}</label>
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-collapse-item></el-collapse>
              </el-col>
              </el-row>
            </el-card>
            <!--修改密码对话框-->
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
          <el-footer>Copyright ©2021 住哪儿-酒店预定平台</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </el-scrollbar>
</template>

<script>
import SideNav from "../../components/SideNav"
import BackNav from "../../components/BackNav"
import { ElMessage } from 'element-plus'
export default {
	components: {
    SideNav,
    BackNav,
	},
  data() {
    //修改联系电话验证
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('联系电话不能为空！'));
      } else {
        callback();
      }
    }
    //修改酒店名验证
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('酒店名不能为空！'));
      } else {
        callback();
      }
    }
    //修改酒店描述验证
    const validateDetails = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('酒店描述不能为空！'));
      } else {
        callback();
      }
    }
    //修改密码原密码验证
    const validateOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'));
      } else if (value !== this.accountInfo.password) {
        callback(new Error('原密码错误!'));
      } else {
        callback();
      }
    }
    //修改密码新密码验证
    const validateNew = (rule, value, callback) => {
      const regNumber = /\d+/; //验证0-9的任意数字最少出现1次。
      const regString = /[a-zA-Z]+/; //验证大小写26个字母任意字母最少出现1次。
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else if (value.length < 8) {
        callback(new Error('密码应不少于8位'));
      } else if (value.length > 20) {
        callback(new Error('密码应不超过20位'));
      } else if (!regNumber.test(value) || !regString.test(value)) {
        callback(new Error('密码应同时包含数字与字母'));
      } else if (value === this.modifyForm.old) {
        callback(new Error('密码不应与旧密码相同'));
      } else {
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
      hid: '',
      isModify: false,    //控制修改信息框的显隐
      isReset: false,   //控制修改密码窗口的显隐
      isUpload: false,
      accountInfo: {},
      hotelInfo: {},
      permitInfo: {},
      pic: [],
      modifyForm: {
        old: '',
        new: '',
        confirm: '',
      },
      infoModify: {
        newPhone: '',
        newName: '',
        newDetails: '',
      },
      isHide: true,    //控制隐藏密码
      hidePassword: '',
      rules: {
        old: [{ validator: validateOld, trigger: 'blur'}],
        new: [{ validator: validateNew, trigger: 'blur'}],
        confirm: [{ validator: validateConfirm, trigger: 'blur' }],
        newName: [{ validator: validateName, trigger: 'blur' }],
        newPhone: [{ validator: validatePhone, trigger: 'blur' }],
        newDetails: [{ validator: validateDetails, trigger: 'blur' }],
      },
    }
  },
  created() {
    this.hid = window.sessionStorage.getItem('uid')
    this.getInfo()
  },
  methods: {
    //获取酒店信息
    getInfo() {
      //调用接口+ 传入酒店ID，返回账户信息
      this.axios.get("/zhunar/api/hotelaccount/id/"+this.hid).then((response) => {
        this.accountInfo = {
          hotelID: this.hid,
          userName: response.data.h_user_name,
          password: response.data.mypassword,
        }
        let hideLen = this.accountInfo.password.length
        this.hidePassword = '***************'.substring(0,hideLen)
      })

      //调用接口+ 传入酒店ID，返回酒店信息
      this.axios.get("/zhunar/api/hotel/id/"+this.hid).then((response) => {
        let rd = response.data[0]
        this.hotelInfo = rd
        this.hotelInfo.name = rd.myname
        this.hotelInfo.star = rd.star_level
      })

      //调用接口+ 传入酒店ID，返回资质信息
      this.axios.get("/zhunar/api/registration/id/"+this.hid).then((response) => {
        let rd = response.data
        this.permitInfo = {
          adminID: rd.a_user_id,
          permit1: rd.sanitation_card,
          permit2: rd.fire_card,
          permit3: rd.catering_card,
        }
      })

      //调用接口+ 传入酒店ID，返回图片url的列表
      this.axios.get('/zhunar/api/hotelpicture/gethotelpicture/'+this.hid).then((response) => {
        let url = response.data
        for(let i=0;i<3;i++) {
          if(url[i] !== '')
            this.pic[i] = url[i]
        }
      })

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
          let sForm = {
            h_user_name: this.hotelInfo.name,
            hotel_id: parseInt(this.hid),
            mypassword: form.new,
          }
          //调用接口+ 传入用户ID、新密码，无返回
          this.axios.put("/zhunar/api/hotelaccount/update", sForm).then((response) => {
            console.log(response)
            ElMessage.success('密码修改成功')
            this.accountInfo.password = this.modifyForm.new
            this.isReset = false
            this.$refs.modifyForm.resetFields()
          })
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
      this.infoModify.newName = this.hotelInfo.name
      this.infoModify.newPhone = this.hotelInfo.phone
      this.infoModify.newDetails = this.hotelInfo.details
      this.isModify = true
    },
    //提交修改信息
    submit() {
      this.$refs['infoModify'].validate((valid) => {
        if (valid) {
          this.hotelInfo.name = this.infoModify.newName
          this.hotelInfo.phone = this.infoModify.newPhone
          this.hotelInfo.details = this.infoModify.newDetails
          console.log(this.hid, this.hotelInfo)
          let sForm = this.hotelInfo
          sForm.myname = this.hotelInfo.name
          sForm.star_level = this.hotelInfo.star
          console.log(sForm)
          //调用接口+ 传入酒店ID、所有信息，无返回
          this.axios.put("/zhunar/api/hotel/update", sForm).then((response) => {
            console.log(response)
          })

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
