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
        <el-main>
          <el-card class="box-card">
            <el-steps :active="step" finish-status="success" simple>
              <el-step title="填写经营资质" icon="el-icon-document"></el-step>
              <el-step title="填写酒店信息" icon="el-icon-edit"></el-step>
              <el-step title="添加房型信息" icon="el-icon-circle-plus-outline"></el-step>
            </el-steps><br>
            <el-row>
              <!--经营资质填写-->
              <el-col :span="7">
                <el-form :model="permitForm" :rules="rules" ref="permitForm" label-width="140px"
                         :class="{'filling': step===0, 'notFilling': step!==0}" :disabled="step!==0" style="padding: 20px">
                  <el-form-item label="卫生许可证" prop="sanitation">
                    <el-input v-model="permitForm.sanitation"></el-input>
                  </el-form-item>
                  <el-form-item label="消防检查合格证" prop="fire">
                    <el-input v-model="permitForm.fire"></el-input>
                  </el-form-item>
                  <el-form-item label="餐饮服务经营许可证" prop="catering">
                    <el-input v-model="permitForm.catering"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="success" @click="changeForm(0,1)" style="width: 100%">下一步</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <!--酒店信息填写-->
              <el-col :span="8" :offset="1">
                <el-form :model="hotelForm" :rules="rules" ref="hotelForm" label-width="70px"
                         :class="{'filling': step===1, 'notFilling': step!==1}" :disabled="step!==1"
                         style="padding: 20px" inline>
                  <el-form-item label="酒店星级" prop="star" style="width: 100%">
                    <el-rate v-model="hotelForm.star" style="margin-top: 10px"></el-rate>
                  </el-form-item>
                  <el-form-item label="酒店名称" prop="name"  style="width: 100%">
                    <el-input v-model="hotelForm.name" placeholder="酒店完整名称" maxlength="30" show-word-limit></el-input>
                  </el-form-item>
                  <el-form-item label="酒店位置" prop="province" style="width: 43%">
                    <el-input size="small" placeholder="酒店所在省" v-model="hotelForm.province" input-style="padding:8px"></el-input>
                  </el-form-item>
                  <el-form-item prop="city" style="width: 24%" label-width="0">
                    <el-input size="small" placeholder="所在城市" v-model="hotelForm.city" input-style="padding:8px"></el-input>
                  </el-form-item>
                  <el-form-item prop="region" style="width: 24%" label-width="0">
                    <el-input size="small" placeholder="所在行政区" v-model="hotelForm.region" input-style="padding:8px"></el-input>
                  </el-form-item>
                  <el-form-item label="详细地址" prop="location" style="width: 100%">
                    <el-input v-model="hotelForm.location" placeholder="例如：曹安公路4800号"></el-input>
                  </el-form-item>
                  <el-form-item label="联系电话" prop="phone" style="width: 100%">
                    <el-input v-model="hotelForm.phone" placeholder="酒店官方的联系方式"></el-input>
                  </el-form-item>
                  <el-form-item label="酒店描述" prop="details" style="width: 100%">
                    <el-input type="textarea" v-model="hotelForm.details" maxlength="600" resize="none"
                              :autosize="{ minRows: 3, maxRows: 6}" show-word-limit placeholder="详细描述酒店的情况"></el-input>
                  </el-form-item>
                  <el-form-item style="width: 100%">
                    <el-button type="primary" @click="changeForm(1,0)" style="width: 46%">上一步</el-button>
                    <el-button type="success" @click="changeForm(1,2)" style="width: 50%">下一步</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <!--房型信息填写-->
              <el-col :span="7" :offset="1">
                <el-form :model="roomForm" :rules="rules" ref="roomForm" :disabled="step!==2"
                         :class="{'filling': step===2, 'notFilling': step!==2}" style="padding: 20px" inline>
                  <el-form-item style="width: 100%">
                    <i class="iconfont icon-haoping" style="color: orange"></i>
                    <span style="color: #2bb82b">为防止恶意注册，请您预设一种房型</span>
                  </el-form-item>
                  <el-form-item label="房间类型" prop="type"  style="width: 66%">
                    <el-input v-model="roomForm.type" placeholder="房间名" size="small" input-style="padding:8px"></el-input>
                  </el-form-item>
                  <el-form-item label="面积" prop="area" style="width: 26%">
                    <el-input v-model="roomForm.area" placeholder="㎡" size="small" input-style="padding:8px"></el-input>
                  </el-form-item>
                  <el-form-item label="基准价格" prop="price" style="width: 50%">
                    <el-input v-model="roomForm.price" placeholder="RMB" size="small" input-style="padding:8px"></el-input>
                  </el-form-item>
                  <el-form-item label="房间总数" prop="number" style="width: 42%">
                    <el-input v-model="roomForm.number" placeholder="总数量" size="small" input-style="padding:8px"></el-input>
                  </el-form-item>
                  <el-form-item label="房间配置" prop="facilities" style="width: 100%">
                    <el-checkbox-group v-model="roomForm.facilities">
                      <el-checkbox label="窗户" style="margin-right: 10px; "><i class="iconfont icon-youchuanghu"> 窗户</i></el-checkbox>
                      <el-checkbox label="WIFI" style="margin-right: 10px; "><i class="iconfont icon-wifi"> WIFI</i></el-checkbox>
                      <el-checkbox label="禁烟"><i class="iconfont icon-jinyan"> 禁烟</i></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item style="width: 100%">
                    <el-button type="primary" @click="changeForm(2,1)" style="width: 46%">上一步</el-button>
                    <el-popconfirm title="请再次确定您填写的内容" @confirm="changeForm(3,0)" confirmButtonType="success"
                                   confirmButtonText="确定" cancelButtonText="取消" cancelButtonType="danger">
                      <template #reference>
                        <el-button type="success" style="width: 48%" @click="changeForm(2,3)">完成</el-button>
                      </template>
                    </el-popconfirm>

                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </el-scrollbar>
</template>

<script>
import SideNav from "../../components/SideNav"
import BackNav from "../../components/BackNav"
import {ElMessage} from "element-plus";
import BaseUrl from "../../config"
export default {
  components: {
    SideNav,
    BackNav,
  },
  created() {
    this.hid = parseInt(window.sessionStorage.getItem('uid'))
    this.getStatus()
  },
  data() {
    //卫生许可验证
    const validateSanitation = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写您的卫生许可证!'));
      } else {
        callback();
      }
    }
    //消防许可验证
    const validateFire = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写您的消防检查合格证!'));
      } else {
        callback();
      }
    }
    //经营许可验证
    const validateCatering = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写您的餐饮服务经营许可证!'));
      } else {
        callback();
      }
    }
    //酒店名验证
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写酒店名称!'));
      } else {
        callback();
      }
    }
    //酒店星级验证
    const validateStar = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('请选择酒店的星级!'));
      } else {
        callback();
      }
    }
    //酒店描述验证
    const validateDetails = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写酒店描述!'));
      } else {
        callback();
      }
    }
    //联系电话验证
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写酒店的联系电话!'));
      } else {
        callback();
      }
    }
    //详细地址验证
    const validateLocation = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写酒店的详细地址!'));
      } else {
        callback();
      }
    }
    //省验证
    const validateProvince = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写完整!'));
      } else {
        callback();
      }
    }
    //城市验证
    const validateCity = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写完整!'));
      } else {
        callback();
      }
    }
    //区验证
    const validateRegion = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写完整!'));
      } else {
        callback();
      }
    }
    //房间类型验证
    const validateType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写房间类型!'));
      } else {
        callback();
      }
    }
    //房间面积验证
    const validateArea = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写面积!'));
      } else {
        callback();
      }
    }
    //房价验证
    const validatePrice = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写房价!'));
      } else {
        callback();
      }
    }
    //房间数验证
    const validateNumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写总数!'));
      } else {
        callback();
      }
    }
    return {
      step: 0,
      hid: 0,
      finished: false,
      permitForm: {
        sanitation: '',
        fire: '',
        catering: '',
      },
      hotelForm: {
        hotelID: window.sessionStorage.getItem('uid'),
        star: 0,
        name: '',
        details: '',
        phone: '',
        province: '',
        city: '',
        region: '',
        location: '',
        score: -1,
      },
      wholeLocation: '',
      roomForm: {
        type: '',
        area: '',
        price: '',
        number: '',
        facilities: []
      },
      rules: {
        //经营资质验证
        sanitation: [{validator: validateSanitation, trigger: 'blur'}],
        fire: [{validator: validateFire, trigger: 'blur'}],
        catering: [{validator: validateCatering, trigger: 'blur'}],
        //酒店验证
        name: [{validator: validateName, trigger: 'blur'}],
        star: [{validator: validateStar, trigger: 'blur'}],
        details: [{validator: validateDetails, trigger: 'blur'}],
        phone: [{validator: validatePhone, trigger: 'blur'}],
        location: [{validator: validateLocation, trigger: 'blur'}],
        province: [{validator: validateProvince, trigger: 'blur'}],
        city: [{validator: validateCity, trigger: 'blur'}],
        region: [{validator: validateRegion, trigger: 'blur'}],
        //房型验证
        type: [{validator: validateType, trigger: 'blur'}],
        area: [{validator: validateArea, trigger: 'blur'}],
        price: [{validator: validatePrice, trigger: 'blur'}],
        number: [{validator: validateNumber, trigger: 'blur'}],
      }
    }
  },
  methods: {
    //调用接口- 获取当前审核进度（没有可测试样本）
    getStatus() {
      this.axios.get(BaseUrl.ZHUNAR+'/api/registration/id/'+this.hid).then((response) => {
        let rd = response.data
        if(rd!=='') {
          if(rd.audit_status===1) {
            this.$notify({
              title: '消息',
              message: '您的入驻申请已通过，自动为您跳转酒店后台！',
              type: 'success'
            });
          this.$router.push('/hotel/home')
          } else if(rd.reason===null) {
            this.step = 3
            this.$notify({
              title: '消息',
              message: '您的入驻申请正在审核，请耐心等待！',
              type: 'warning'
            });
          } else {
            this.step = 0
            this.$notify.error({
              title: '消息',
              message: '您的入驻申请未通过审核，请重新填写！',
            });
          }
        }
      })
    },
    //三个表单间的跳转
    changeForm(from, to) {
      switch (from) {
        case 0:
          this.$refs['permitForm'].validate((valid) => {
            if (valid) {
              this.step = to
            }
          })
          break
        case 1:
          if(to===0) {
            this.$refs.hotelForm.clearValidate()
            this.step = to
          } else {
            this.$refs['hotelForm'].validate((valid) => {
            if (valid) {
                this.step = to
              }
            })
          }
          break
        case 2:
          if(to===1) {
            this.$refs.roomForm.clearValidate()
            this.step = to
          } else {
            this.$refs['roomForm'].validate((valid) => {
              this.finished = !!valid;
            })
          }
          break
        case 3:
          if (this.finished) {
            this.step = 3
            this.submit()
            ElMessage.success('提交成功，请耐心等待审核！系统将在5S后回到首页！')
            window.sessionStorage.setItem('uid', '0')
            setTimeout(() => {
              this.$router.push('/home')
            }, 5000)
          }
          else {
            ElMessage.warning('请检查是否填写完整!')
          }
          break
      }
    },
    //表单提交
    submit() {
      //调用接口- 传入酒店ID、空管理员ID、许可证，无返回
      let pf = this.permitForm
      let sForm1 = {
        a_user_id: 0,
        hotel_id: parseInt(this.hid),
        sanitation_card: pf.sanitation,
        fire_card: pf.fire,
        catering_card: pf.catering,
      }
      this.axios.post(BaseUrl.ZHUNAR+'/api/registration/add', sForm1).then((response) => {
        console.log(response)
      })
      //调用接口- 传入酒店ID、酒店信息，无返回
      let hf = this.hotelForm
      let sForm2 = {
        hotel_id: parseInt(this.hid),
        star_level: parseInt(hf.star),
        myname: hf.name,
        details: hf.details,
        phone: hf.phone,
        province: hf.province,
        city: hf.city,
        region: hf.region,
        location: hf.location,
        score: -1,
        lat: 0,
        lng: 0,
      }
      this.axios.post(BaseUrl.ZHUNAR+'/api/hotel/add', sForm2).then((response) => {
        console.log(response)
      })
      //调用接口+ 传入酒店ID、房型信息，无返回
      let rf = this.roomForm
      console.log(rf)
      let sForm3 = {
        hotel_id: parseInt(this.hid),
        room_type: rf.type,
        area: parseInt(rf.area),
        windows: rf.facilities.indexOf('窗户')===-1?0:1,
        wifi: rf.facilities.indexOf('WIFI')===-1?0:1,
        smoke: rf.facilities.indexOf('禁烟')===-1?0:1,
        basic_price: parseInt(rf.price),
        room_quantity: parseInt(rf.number)
      }
      console.log(sForm1,sForm2,sForm3)
      this.axios.post(BaseUrl.ZHUNAR+'/api/roomtype/add', sForm3).then((response) => {
        console.log(response)
      })
    },
  },
}
</script>


<style>
.notFilling{
  background-color: whitesmoke
}
.filling{
  background-color: #ffdeb7
}
</style>
