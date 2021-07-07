<template>
  <el-scrollbar>
    <el-container>
      <el-header style="padding: 0">
        <top-nav/>
      </el-header>
      <el-row><el-col :span="20" :offset="2">
        <el-main>
          <!--上方显示省市区的面包屑-->
          <el-divider content-position="left">
            <el-breadcrumb separator="/" style="margin-top: 10px; margin-bottom: 10px">
              <el-breadcrumb-item :to="{ path: '/home' }">酒店首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ hotelInfo.province }}酒店</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/result', query: { province:hotelInfo.province, city: hotelInfo.city }}">
                {{ hotelInfo.city }}
              </el-breadcrumb-item>
              <el-breadcrumb-item>{{ hotelInfo.region }}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-divider>
          <!--标题、星级、地址、收藏按钮-->
          <el-row>
            <el-col :span="12">
              <el-row>
                <el-col :span="8" style="font-size: 24px; font-weight: 900; text-align: left">
                  {{ hotelInfo.name }}
                </el-col>
                <el-col :span="6" style="text-align: left">
                  <el-rate v-model="hotelInfo.star" disabled text-color="#ff9900" style="margin-top: 10px"/>
                </el-col>
              </el-row>
              <p style="font-size: 16px; font-weight: 500; text-align: left">{{ hotelInfo.location }}</p>
            </el-col>
            <el-col :span="4" :offset="8">
              <el-button @click="addFavorite" icon="el-icon-star-on" round size="small">收藏</el-button>
            </el-col>
          </el-row>
          <!--酒店图片、简要介绍-->
          <el-row>
            <el-col :span="12">
              <el-image :src="hotelInfo.url" style="height: 270px"></el-image>
            </el-col>
            <el-col :span="11" style="margin-left: 16px">
              <el-card shadow="hover" style="border-radius: 8px; text-align: left" class="box-card">
                <span style="font-weight: 900 ;font-size: 30px; color: #67C23A">
                  {{ hotelInfo.score }}
                </span>
                <span style="font-weight: 600 ;font-size: 20px; color: #67C23A">分</span>
                <span style="font-size: 16px; font-weight: 500; margin-left:10px; text-align: left; color: #9f9f9f">
                  共有{{eAll.length}}条点评
                </span>
                <p style="font-size: 15px; font-weight: 500; text-align: left">{{hotelInfo.details}}</p>
                <h3>这里是放地图展示的位置</h3>
              </el-card>
            </el-col>
          </el-row>
          <br><el-divider content-position="left">更多信息</el-divider>
          <el-tabs v-model="activePart" type="card" style="border-radius: 8px" @tab-click="refresh">
            <!--房型预定部分-->
            <el-tab-pane label="房间预定" name="room"
                         style="background-color: #ffdeb7; padding: 10px; border-radius: 6px">
              <el-card style="text-align: left; margin-bottom: 6px; padding: 0">
                <!--预定时间选择+合计天数,变更时自动刷新-->
                <el-date-picker range-separator="=>" start-placeholder="入住" end-placeholder="离店"
                                :disabledDate="getDisable" value-format="YYYY-MM-DD" v-model="dateRange"
                                type="daterange" @blur="getTimeSlot" :clearable="false"></el-date-picker>
                <span style="margin-left: 20px; margin-right: 25px ; font-weight: 700; color: darkgray">共 {{orderForm.days}} 晚</span>
                <el-divider direction="vertical"></el-divider>
                <!--预定房间数，变更时自动按剩余数修改是否可以预定-->
                <span style="margin-left: 25px; font-weight: 700; color: darkgray">预定房间数量</span>
                <el-input-number v-model="orderForm.number" style="margin-left: 20px; width: 12%"
                                 :min="1" :max="10" ></el-input-number>
              </el-card>
              <el-table :data="roomInfo" style="width: 100%" v-loading="roomLoading">
                <!--房间主图和房型-->
                <el-table-column label="房型" width="420px">
                  <template #default="scope">
                    <el-space>
                      <el-image :src="scope.row.pic" style="width: 240px; margin-right:6px"></el-image>
                      <span style="font-weight: bold; font-size: 16px">{{ scope.row.type }}<br><br><br><br><br></span>
                    </el-space>
                  </template>
                </el-table-column>
                <!--房间配置-->
                <el-table-column label="房间配置">
                  <template #default="scope">
                    <span class="room-details">房间面积：{{ scope.row.area }}㎡</span><br>
                    <span class="room-details">{{ scope.row.window }}窗户</span><br>
                    <span class="room-details">{{ scope.row.wifi }}无线网络</span><br>
                    <span class="room-details">{{ scope.row.smoke }}吸烟</span><br><br>
                  </template>
                </el-table-column>
                <!--房间价格-->
                <el-table-column label="价格">
                  <template #default="scope">
                    <span style="font-weight: 700; font-size: 22px; color: dodgerblue">
                      ￥{{ scope.row.price }}<br><br><br><br>
                    </span>
                  </template>
                </el-table-column>
                <!--预定操作-->
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button round icon="el-icon-s-order" type="success" :disabled="scope.row.remain < orderForm.number"
                               @click="addOrder(scope.row)">
                      预定房间
                    </el-button>
                    <br><br><br><br>
                  </template>
                </el-table-column>
              </el-table>
              <!--预定房间窗口-->
              <el-dialog title="预定房间" v-model="newOrder" width="40%" @closed="cancelOrder">
                <!--预定时间确认-->
                <el-descriptions title="信息确认" :column="3" border
                                 style="margin-left: 2%; margin-right: 2%">
                  <el-descriptions-item>
                    <template #label>入住日期</template>
                    {{ dateRange[0] }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>离店日期</template>
                    {{ dateRange[1] }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>预定天数</template>
                    {{ orderForm.days }}
                  </el-descriptions-item>
                </el-descriptions>
                <!--订单信息确认-->
                <el-descriptions :column="2" border
                                 style="margin-left: 2%; margin-right: 2%; margin-bottom: 20px">
                  <el-descriptions-item>
                    <template #label>房间类型</template>
                    {{ orderForm.type }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>房间单价</template>
                    ￥ {{ orderForm.price }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>订房数量</template>
                    {{ orderForm.number }} 间
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>订单金额</template>
                    ￥ {{ orderForm.volume }}
                  </el-descriptions-item>
                </el-descriptions>
                <!--入住信息确认-->
                <el-form inline :model="orderForm" label-width="100px" style="margin-left: 0; margin-right: 2%">
                  <el-form-item label="入住人姓名">
                    <el-input v-model="orderForm.name" style="width: 110px"></el-input>
                  </el-form-item>
                  <el-form-item label="入住人电话">
                    <el-input type="tel" v-model="orderForm.phone" style="width: 160px; margin-right:10px"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-tooltip effect="light" content="使用当前用户信息" placement="right">
                      <el-button type="primary" @click="setInfo" icon="el-icon-user" circle></el-button>
                    </el-tooltip>
                  </el-form-item>
                  <el-button type="success" @click="submitOrder" style="width: 48%">确认</el-button>
                  <el-button type="danger" @click="newOrder = false" style="width: 48%">取消</el-button>
                </el-form>
              </el-dialog>
            </el-tab-pane>
            <!--用户评价部分-->
            <el-tab-pane label="用户评价" name="estimation"
                         style="background-color: #ffdeb7; padding: 10px; border-radius: 6px">
              <el-card style="text-align: left; margin-bottom: 6px" body-style="padding: 10px">
                <span style="font-weight: 800 ;font-size: 28px; color: #67C23A; margin-right: 3px; margin-left: 20px">
                  {{ hotelInfo.score }}
                </span>
                <span style="font-weight: 600 ;font-size: 18px; color: #67C23A; margin-right: 20px">分</span>
                <el-tag type="success" effect="dark">
                  好评率 {{ eHigh.length/eAll.length*100 }}%
                </el-tag><br>
                <!--筛选评论类型-->
                <el-radio-group style="margin-left: 20px; margin-top: 10px; margin-bottom: 5px" v-model="estimationType" @change="filterEstimation">
                  <el-radio label="全部" style="width: 64px">全部（{{ eAll.length }}）</el-radio>
                  <el-radio label="好评" style="width: 64px">好评（{{ eHigh.length }}）</el-radio>
                  <el-radio label="中评" style="width: 64px">差评（{{ eMiddle.length }}）</el-radio>
                  <el-radio label="差评" style="width: 64px">差评（{{ eLow.length }}）</el-radio>
                </el-radio-group>
                <el-button v-if="eOrder" @click="sortEstimation" icon="el-icon-caret-bottom" style="margin-left: 400px" size="small" type="primary">按评论最新</el-button>
                <el-button v-else @click="sortEstimation" icon="el-icon-caret-top" style="margin-left: 400px" size="small" type="primary">按评论最早</el-button>
              </el-card>
              <!--评论内容-->
              <el-table :show-header="false" :data="estimation" style="width: 100%; min-height: 530px">
                <el-table-column width="120">
                  <template #default="scope">
                    <i class="el-icon-user" style="color:#409EFF;"></i>
                    <span style="margin-left: 10px; font-weight: 700; color: #409EFF">{{ scope.row.nickName }}</span><br><br><br>
                  </template>
                </el-table-column>
                <el-table-column width="800">
                  <template #default="scope">
                    <el-rate v-model="scope.row.star" :icon-classes="iconClasses" style="margin-left: 40px"
                             disabled-void-color='white' :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled>
                    </el-rate>
                    <span style="margin-left: 10px; display:block;text-indent:2em">{{ scope.row.content }}</span>
                    <i class="el-icon-time" style="color: darkgray"></i>
                    <span style="margin-left: 10px; color: darkgray">发布于 {{ scope.row.time }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-col>
      <el-col :span="2">
        <!--快捷导航的固钉-->
        <el-affix :offset="74">
          <el-button type="primary" @click="goUp(0)" size="mini" style="margin-bottom: 4px">酒店详情</el-button><br>
          <el-button type="primary" @click="goUp(1)" size="mini">更多信息</el-button>
        </el-affix>
      </el-col></el-row>
      <el-footer>Copyright ©2021 住哪儿-酒店预定平台</el-footer>
    </el-container>
  </el-scrollbar>
</template>


<script>
import TopNav from "../components/TopNav";
import {ElMessage} from "element-plus";
export default {
  components: {
    TopNav,
  },
  data() {
    return {
      uid: '',
      hid: '',
      hotelInfo: {},    //酒店详细
      activePart: 'estimation',   //选择的标签页：房间预定/用户评论
      //==房间预定数据==
      roomLoading: false,
      roomInfo: {},   //房型详情
      dateRange: [ '2021-07-06', '2021-07-08' ],    //预定日期
      //预定表单
      newOrder: false,    //控制预定窗口
      orderForm: {
        type: '',
        price: '',
        number: 1,
        days: '',
        volume: '',
        name: '',
        phone: '',
        status:'进行中'
      },
      //==用户评论数据==
      estimationLoading: false,
      eOrder: true,
      estimationType: '全部',
      iconClasses: ['iconfont icon-chaping', 'iconfont icon-zhongping', 'iconfont icon-haoping'],
      estimation: [],
      eAll: [], eHigh: [], eMiddle: [], eLow: [],
    }
  },
  created() {
    this.uid = window.sessionStorage.getItem('uid')
    this.hid = this.$route.query.id
    this.addHistory()
    this.getInfo()
    this.getRoom()
    this.getTimeSlot()
    this.getEstimation()
  },
  methods: {
    //获取酒店详情
    getInfo() {
      //调用接口- 提供酒店ID，返回酒店信息
      this.hotelInfo = {
        name: '上海宝格丽酒店', star: 5, score: '4.7', phone: '021-36067788',
        details: '上海宝格丽酒店坐落于拥有丰厚历史人文背景的苏河湾——河南北路，它将惬意的自然景观、当代的设计风格以及经典的历史建筑精妙平衡。',
        province: '上海', city: '上海市', region: '静安区', location: '静安区山西北路108弄',
        url: require('../assets/hotel.png'),
      }
    },
    //进入页面时添加浏览记录
    addHistory() {
      console.log('酒店ID:', this.hid, ' 用户ID:', this.uid)
      //调用接口- 传入酒店id、用户id，无返回
    },
    //添加到收藏夹
    addFavorite() {
      console.log(this.hid, this.uid)
      //调用接口- 传入酒店ID、用户ID，无返回

    },
    //切换标签后的页面调整
    refresh(tab) {
      document.documentElement.scrollTop = 558
      console.log(tab.props.name)
      if(tab.props.name === 'room') {
        this.estimationType = '全部'
        this.filterEstimation('全部')
      }
    },
    //侧边用于滚动到固定位置的固钉
    goUp(i) {
      if(i ===0)
        document.documentElement.scrollTop = 0
      else
        document.documentElement.scrollTop = 558
    },

    //设置不可选时间段
    getDisable(time) {
      const curDate = (new Date()).getTime()
      // 这里算出一个月的毫秒数,
      //这里使用30的平均值,实际中应根据具体的每个月有多少天计算
      const day = 30 * 24 * 3600 * 1000
      const dateRegion = curDate + day
      return time.getTime() < Date.now() - 8.64e7 ||
          time.getTime() > dateRegion
    },
    //获取房间详情
    getRoom() {
      //console.log(this.hid)
      this.roomLoading = true
      //调用接口- 传入酒店ID，返回所有房间信息
      this.roomInfo = [
        {
          type: '高级城市景观房', area: 52, window: '有', wifi: '有', smoke: '不可',
          pic: 'http://121.196.223.20:24/登录.png'
        },
        {
          type: '豪华外滩景观房', area: 61, window: '有', wifi: '有', smoke: '不可',
          pic: 'http://121.196.223.20:24/登录.png'
        },
        {
          type: '高级城市景观套房', area: 81, window: '有', wifi: '有', smoke: '可',
          pic: 'http://121.196.223.20:24/登录.png'
        },
      ]

      this.roomLoading = false
    },
    //获取选定时间段的房间价格与剩余量
    getTimeSlot() {
      this.roomLoading = true
      //获取预定天数
      let start = Date.parse(this.dateRange[0])
      let end = Date.parse(this.dateRange[1])
      this.orderForm.days = (end - start)/(24*3600*1000)
      //console.log(this.hid, this.dateRange[0], this.dateRange[1])
      //调用接口- 传入酒店ID，两个时间点，返回所有房间剩余情况
      this.roomInfo[0].price = 4431;
      this.roomInfo[0].remain = 10
      this.roomInfo[1].price = 5830;
      this.roomInfo[1].remain = 6
      this.roomInfo[2].price = 6646;
      this.roomInfo[2].remain = 2

      this.roomLoading = false
    },
    //预定房间
    addOrder(row) {
      console.log(this.uid)
      if(this.uid === '0') {
        ElMessage.warning('请先登录！')
        return
      }
      this.newOrder = true
      let form = this.orderForm
      form.type = row.type
      form.price = row.price
      form.volume = row.price * form.days * form.number
      form.time = new Date().toLocaleDateString('chinese',{year:'numeric', month:'2-digit', day:'2-digit'})
                            .replaceAll('/', '-')
      form.time += ' ' + new Date().toLocaleTimeString('chinese',{hour12:false})
      form.start = this.dateRange[0]
      form.end = this.dateRange[1]
    },
    //设置信息为当前用户的
    setInfo() {
      //console.log(this.uid)
      //调用接口- 传入用户ID，返回该用户的姓名和电话
      this.orderForm.name = '张三'
      this.orderForm.phone = '12345678900'
    },
    //提交订单
    submitOrder() {
      if(this.orderForm.name === '' || this.orderForm.phone === '') {
        ElMessage.warning('请将入住信息填写完整！')
        return
      }
      //console.log(this.hid, this.uid, this.orderForm)
      //调用接口- 传入用户ID、酒店ID、所有信息，无返回

      this.newOrder = false
    },
    //取消预定，清空表单
    cancelOrder() {
      this.orderForm.name = ''
      this.orderForm.phone = ''
    },

    //获取全部评论
    getEstimation() {
      //console.log(this.hid)
      //调用接口- 传入酒店ID、返回所有评价
      const all = [
        {nickName: '张三三', time: '2021-07-06', star: 5,
          content: '非常棒👍，服务无语伦比的体贴，食品也超赞，只是可惜我们只是住一晚，而晚餐的中餐已经订满，据说这可是全球唯一有中餐馆的宝格丽酒店，为我们服务的小姐是个香港，满口标准的粤语是我们倍感亲切，一起都是那么舒适和圆满，赞赞赞……'},
        {nickName: '李四四', time: '2021-07-07', star: 4,
          content: '酒店服务特别好，主动性问候，求婚大作战圆满成功，老婆很开心，酒店前台还配合着演了一次戏，晚上半夜还叫阿姨来打扫了房间，实在有点乱。早餐也不错，上海最贵的酒店，价格么嘿嘿'},
        {nickName: '王五五', time: '2021-07-08', star: 3,
          content: '第一次入住这家酒店，整体体验很不错👍 酒店服务也很用心干净卫生床也特别好睡 早餐也好吃酒店特别用心服务特周到订的房间能望到外面夜景'},
        {nickName: '雄哥NB', time: '2021-07-09', star: 2,
          content: '风景太棒啦！很喜欢酒店的装修，低调奢华'},
        {nickName: '昕哥NB', time: '2021-07-10', star: 1,
          content: '第二次来了，国际品牌酒店，设施方面肯定不用说，早餐体验非常棒，因为一点小差错，服务员特别送来一小盒巧克力表示歉意，那巧克力绝对够惊喜'},
      ]

      this.eAll = all
      this.estimation = all
      for(let i =0;i<all.length;i++) {
        if (all[i].star >= 4)
          this.eHigh.push(all[i])
        else if(all[i].star === 3)
          this.eMiddle.push(all[i])
        if (all[i].star <= 2)
          this.eLow.push(all[i])
      }
    },
    //筛选评论类型
    filterEstimation(type) {
      switch (type) {
        case '全部':
          this.estimation = this.eAll
          break
        case '好评':
          this.estimation = this.eHigh
          break
        case '中评':
          this.estimation = this.eMiddle
          break
        case '差评':
          this.estimation = this.eLow
          break
      }
    },
    //评论按时间排序
    sortEstimation() {
      this.eOrder = !this.eOrder;		//
      this.estimation.sort(this.compare('time'));
    },
    //排序逻辑
    compare(attr) {
      let that = this;
      return function(a,b){
        let val1 = a[attr];
        let val2 = b[attr];
        if(that.eOrder){
          return new Date(val1.replace(/-/,'/')) - new Date(val2.replace(/-/,'/'));
        } else{
          return new Date(val2.replace(/-/,'/')) - new Date(val1.replace(/-/,'/'));
        }
      }
    }
  },
}
</script>


<style scoped>
.room-details{
  color: darkgray;
}

</style>