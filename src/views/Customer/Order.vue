<template>
  <el-container>
    <div style="
        background-image: url(//s2.hdslb.com/bfs/static/blive/blfe-dynamic-web/static/img/background.bc725153.png);
        background-repeat: no-repeat;
        background-attachment: fixed;
        height: 100%;
        background-size:100% 100%;">
    <el-header style="padding: 0">
      <TopNav />
    </el-header>
    <el-main>
      <el-card
        v-loading="a"
        class="box-card"
        style="margin-left: 10%; margin-right: 10%"
      >
        <!--这里写代码-->
        <order-detail ref="orderdetail"></order-detail>

        <el-tabs v-model="activeName" @tab-click="showTable">
          <el-tab-pane label="正在进行中" name="second"></el-tab-pane>
          <el-tab-pane label="历史订单" name="first"></el-tab-pane>
          <el-tab-pane label="已退订" name="third"></el-tab-pane>
        </el-tabs>
        <el-row justify="begin">
          <el-col :span="6">
            <div>
              <el-date-picker
                v-model="dataRange"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY 年 MM 月 DD 日"
                @change="show"
                v-if="this.activeName != 'second'"
              ></el-date-picker>
            </div>
          </el-col>
        </el-row>
        <!-- 这里考虑v-loading -->
        <el-table :data="orderTemp" stripe>
          <el-table-column label="酒店" width="420">
            <template #default="scope">
              <el-row>
                <el-col :span="8">
                  <el-image
                    :src="scope.row.url"
                    style="height: 100%; width: 100%"
                  ></el-image
                ></el-col>
                <el-col :span="15" :offset="1">
                  <span style="color: #00afc7; font-size: 16px">{{
                    scope.row.myname
                  }}</span>
                  <br />
                  <i class="iconfont icon-xiadan-shijian"
                    ><span style="font-size: 13px"
                      >下单时间:{{ scope.row.day_time }}</span
                    ></i
                  >
                  <br />
                  <i class="iconfont icon-zhusu"
                    ><span style="font-size: 13px"
                      >入住时间:{{ scope.row.start_date }}</span
                    ></i
                  >
                  <br />
                  <i class="iconfont icon-icon-yilidian">
                    <span style="font-size: 13px"
                      >离店时间:{{ scope.row.end_date }}</span
                    ></i
                  >
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="价格" width="175">
            <template #default="scope">
              <p id="price">￥{{ scope.row.order_money }}</p>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" width="170">
            <template #default="scope">
              {{ scope.row.order_status }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="310">
            <template #default="scope">
              <el-button
                @click="showEvaDialog(scope.$index)"
                type="primary"
                size="min"
                v-show="
                  this.activeName == 'first' || this.activeName == 'third'
                "
                >添加评论</el-button
              >
              <el-button
                @click="showDialog(scope.$index)"
                type="primary"
                size="min"
              >
                详情信息
              </el-button>
              <el-button
                size="min"
                type="danger"
                @click="leaveorder(scope.$index)"
                v-show="this.activeName === 'second'"
                >退订</el-button
              >
              <el-button
                size="min"
                type="danger"
                @click="deleteorder(scope.$index)"
                v-show="
                  this.activeName == 'first' || this.activeName == 'third'
                "
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="评论"
          v-model="showEva"
          width="500px"
          @close="closeEva"
        >
          <el-col :span="18">
            <el-rate v-model="this.orderTemp[this.index].star_level" show-text>
            </el-rate>
            <br />
          </el-col>
          <el-input
            placeholder="评价"
            v-model="this.orderTemp[this.index].details"
            type="textarea"
            rows="8"
          ></el-input>
          <br /><br />
          <el-button type="primary" @click="onSubmit" style="width: 50%" round
            >保存并提交</el-button
          >
        </el-dialog>

        <el-drawer
          v-model="dialogVisible"
          direction="rtl"
          :with-header="false"
          size="45%"
          :before-close="handleClose"
          destroy-on-close
        >
          <div style="margin-left: 40px; margin-right: 20px">
            <el-divider><h1>订单详情</h1></el-divider>
            <el-card class="box-card" shadow="never">
              <p id="order_status">
                {{ this.orderTemp[this.index].order_status }}
              </p>
              <p v-show="this.orderTemp[this.index].order_status == '已退订'">
                订单已取消
              </p>
              <p v-show="this.orderTemp[this.index].order_status == '已完成'">
                感谢您的预定，期待您再次使用本软件
              </p>
              <el-button round @click="reserve">再次预定</el-button>
            </el-card>

            <el-descriptions
              class="margin-top"
              title="房间信息"
              :column="1"
              border="true"
            >
              <el-descriptions-item label="入离时间">
                <span>
                  {{ this.orderTemp[this.index].start_date }}后入住
                  <br />
                  <el-tag size="small" style="font-size: 13px"
                    >共{{ this.orderTemp[this.index].timeLength }}晚</el-tag
                  >
                  <br />
                  {{ this.orderTemp[this.index].end_date }}前离店
                  <br />
                  <span style="color: #9f9f9f; font-size: 5px"
                    >如需提前入住,延迟退房,请联系酒店协商</span
                  >
                </span>
              </el-descriptions-item>

              <el-descriptions-item label="酒店">
                <el-row>
                  <el-col :span="20">
                    {{ this.orderTemp[this.index].myname }}
                    <br />
                    ({{ this.orderTemp[this.index].location }})
                  </el-col>
                  <!-- 这里调用酒店详情路由 -->
                  <el-col :span="4" style="align: right">
                    <el-button right="0" size="small" @click="reserve"
                      >酒店详情</el-button
                    >
                  </el-col>
                </el-row>
              </el-descriptions-item>

              <el-descriptions-item label="房型">
                {{ this.orderTemp[index].room_type }} ×{{
                  this.orderTemp[index].room_quantity
                }}
              </el-descriptions-item>
              <el-descriptions-item label="其他">
                <!-- <p>星级{{this.orderTemp[index].star_level}}</p>
                <p>评价信息{{this.orderTemp[index].details}}</p> -->
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions
              class="margin-top"
              title="入住信息"
              :column="2"
              border="true"
            >
              <el-descriptions-item label="入住人">
                {{ orderTemp[index].customer_name }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号" width="50">
                {{ orderTemp[index].phone_num }}
              </el-descriptions-item>
              <el-descriptions-item label="订单号">
                {{ orderTemp[index].order_id }}
              </el-descriptions-item>
              <el-descriptions-item label="下单时间">
                {{ orderTemp[index].day_time }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-drawer>
      </el-card>
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
export default {
  components: {
    TopNav,
  },

  data() {
    return {
      a: false,
      c_user_id: 10000,
      time1: "",
      time2: "",
      // 说明绑定的是历史订单还是其他的什么
      activeName: "second",
      dataRange: null,
      index: -1,
      dialogVisible: false,
      showEva: false,
      order: [
        {
          customer_name: "nzh",
          order_id: "123",
          day_time: new Date("2021-04-06 19:45"),
          url: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
          myname: "上海田园佳美酒店",
          start_date: "2017-08-01 18:56:38",
          end_date: "2017/08/28 04:56:38",
          order_money: 828,
          order_status: "已退订",
          location: "曹安公路4800号",
          room_type: "大床房",
          phone_num: 12345,
          timeLength: "",
          star_level: "",
          details: "",
          eday_time: "",
        },
      ],
      orderTemp: [], //这里是一个替代的数组
    };
  },
  created() {
    this.getData();
  },
  methods: {
    /*此处调用api中删除订单的方法*/
    deleteorder(newindex) {
      this.index = newindex;
      console.log(this.index);
      this.$confirm("请确认是否删除该订单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios
            .delete(
              "http://121.196.223.20:5000/api/customerorder/delete/" +
                this.orderTemp[newindex].order_id
            )
            .then((response) => {
              console.log(response.data);
            });
          //这里要使得服务器订单对应删除
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          for (var item of this.order) {
            if (item.order_id == this.orderTemp[newindex].order_id) {
              this.orderTemp.splice(newindex, 1);
              this.order.splice(this.order.indexOf(item), 1);
              break;
            }
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //退订按钮
    leaveorder(newindex) {
      this.index = newindex;
      console.log(this.index);
      this.$confirm("请确认是否退订？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios
            .put(
              "http://121.196.223.20:5000/api/customerorder/cancel/" +
                this.orderTemp[newindex].order_id
            )
            .then((response) => {
              console.log(response.data);
            });
          for (var item of this.order) {
            if (item.order_id == this.orderTemp[newindex].order_id) {
              var temp = item;
              temp.order_status = "已退订";
              this.order.push(temp);
              this.orderTemp.splice(newindex, 1);
              this.order.splice(this.order.indexOf(item), 1);
              break;
            }
          }
          this.$message({
            type: "success",
            message: "退订成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退订",
          });
        });
    },
    /*closeEva()
    {
       this.$confirm("请确认是否退出(您还没有保存评价信息)？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(()=>{
          this.orderTemp[this.index].star_level=""
          this.orderTemp[this.index].details=""
          this.showEva=false;
        })
        .catch(() => {
          this.orderTemp[this.index].star_level=""
          this.orderTemp[this.index].details=""
          this.showEva=true;
        });
    },*/
    //显示详情
    showDialog(newindex) {
      this.index = newindex;
      this.dialogVisible = true;
    },
    //展示通过时间选择器筛选订单
    show() {
      if (this.dataRange != null) {
        this.time1 = this.dataRange[0]//.split('T')[0]
        this.time2 = this.dataRange[1]//.split('T')[0]
      }
      this.showTable();
    },
    getData() {
      this.a = true;
      this.axios
        .get(
          "http://121.196.223.20:5000/api/customerorder/gethotel/" +
            this.c_user_id
        )
        .then((response) => {
          this.order = response.data;
          console.log(this.order);
          for (let item of this.order) {
            item.start_date = item.start_date.split("T")[0].replace(/-/g,'/')
            item.end_date = item.end_date.split("T")[0].replace(/-/g,'/')
            item.day_time = item.day_time.split("T")[0].replace(/-/g,'/')
            item.timeLength =
              (new Date(item.end_date) - new Date(item.start_date)) / 86400000;
          }
          this.a = false;
          this.showTable();
        });
    },
    showTable() {
      if (this.activeName == "first") {
        this.orderTemp.length = 0;
        for (var i = 0; i < this.order.length; i++) {
          if (this.order[i].order_status == "已完成") {
            
            if (
              this.dataRange == null ||
              (new Date(this.order[i].day_time) >= new Date(this.time1) &&
                new Date(this.order[i].day_time) <= new Date(this.time2))
            )
              this.orderTemp.push(this.order[i]);
          }
        }
      } else if (this.activeName == "second") {
        this.orderTemp.length = 0;
        this.dataRange = null;
        for (var j = 0; j < this.order.length; j++) {
          if (this.order[j].order_status == "进行中") {
            this.orderTemp.push(this.order[j]);
          }
        }
      } else if (this.activeName == "third") {
        this.orderTemp.length = 0;
        
        for (var k = 0; k < this.order.length; k++) {
          if (this.order[k].order_status == "已退订") {
            console.log(new Date(this.order[k].day_time),this.time1,this.time2)
            if (
              this.dataRange == null ||
              (new Date(this.order[k].day_time) >= new Date(this.time1) &&
                new Date(this.order[k].day_time) <= new Date(this.time2))
            )
              this.orderTemp.push(this.order[k]);
          }
        }
      }
    },
    showEvaDialog(newindex) {
      this.index = newindex;
      this.orderTemp[this.index].star_level = 0;
      this.orderTemp[this.index].details = "";
      this.showEva = true;
    },
    onSubmit() {
      this.showEva = false;
      this.axios
        .post(
          "http://121.196.223.20:5000/api/estimation/add?order_id=" +
            this.orderTemp[this.index].order_id +
            "&details=" +
            this.orderTemp[this.index].details +
            "&star_level=" +
            this.orderTemp[this.index].star_level
        )
        .then(() => {
          this.$message({
            type: "success",
            message: "提交成功!",
          });
        });
      // 这里把评价信息传入数据库存储
    },
    reserve() {
      this.$router.push({
        path: "../Details",
        query: { hotelID: this.orderTemp[this.index].hotelID },
      });
    },
  },
};
</script>

<style>
#price {
  color: #ff7400;
  font-weight: bold;
  font: bold 20px arial, sans-serif;
}
#order_status {
  font-size: 25px;
  font-weight: 600;
  color: #000;
}
</style>
