<template>
  <el-container>
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
          <el-tab-pane label="正在进行中" name="first"></el-tab-pane>
          <el-tab-pane label="历史订单" name="second"></el-tab-pane>
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
                v-if="this.activeName != 'first'"
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
                  this.activeName == 'second' || this.activeName == 'third'
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
                v-show="this.activeName === 'first'"
                >退订</el-button
              >
              <el-button
                size="min"
                type="danger"
                @click="deleteorder(scope.$index)"
                v-show="
                  this.activeName == 'second' || this.activeName == 'third'
                "
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="订单评价" v-model="showEva" width="500px">
          <p
            style="text-align: left"
            v-if="!!this.orderTemp[this.index].eday_time"
          >
            上次评价时间:{{
              orderTemp[index].eday_time.split("T")[0] +
              " " +
              orderTemp[index].eday_time.split("T")[1]
            }}
          </p>
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
              <el-descriptions-item label="入离时间" width="120px">
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
                    <span>地址:{{ this.orderTemp[this.index].location }}</span>
                  </el-col>
                  <!-- 这里调用酒店详情路由 -->
                  <el-col :span="4" style="align: right">
                    <el-button
                      right="0"
                      type="text"
                      style="margin-top: 0px"
                      @click="reserve"
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
              <el-descriptions-item label="评价">
                <div v-if="!!this.orderTemp[index].eday_time">
                  <el-rate
                    v-model="this.orderTemp[index].star_level"
                    disabled
                  ></el-rate>
                  {{ this.orderTemp[index].details }}
                </div>
                <div v-else>
                  <p>您还没有去评价订单哦</p>
                </div>
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
      activeName: "first",
      dataRange: null,
      index: -1,
      dialogVisible: false,
      showEva: false,
      order: [
        // {
        //   customer_name: "nzh",
        //   order_id: "123",
        //   day_time: new Date("2021-04-06 19:45"),
        //   url: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        //   myname: "上海田园佳美酒店",
        //   start_date: "2017-08-01 18:56:38",
        //   end_date: "2017/08/28 04:56:38",
        //   order_money: 828,
        //   order_status: "已退订",
        //   location: "曹安公路4800号",
        //   room_type: "大床房",
        //   phone_num: 12345,
        //   timeLength: "",
        //   star_level: "",
        //   details: "",
        //   eday_time: "",
        // },
      ],
      orderTemp: [], //这里是一个替代的数组
    };
  },
  created() {
    this.showTable();
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
              "/zhunar/api/customerorder/delete/" +
                this.orderTemp[newindex].order_id
            )
            .then((response) => {
              console.log(response.data);
            });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.orderTemp.splice(newindex, 1);
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
              "/zhunar/api/customerorder/cancel/" +
                this.orderTemp[newindex].order_id
            )
            .then(() => {
              this.orderTemp.splice(newindex, 1);
              this.$message({
                type: "success",
                message: "退订成功!",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退订",
          });
        });
    },
    //显示详情
    showDialog(newindex) {
      this.index = newindex;
      this.dialogVisible = true;
    },
    //展示通过时间选择器筛选订单
    show() {
      if (this.dataRange != null) {
        this.time1 = this.dataRange[0]; //.split('T')[0]
        this.time2 = this.dataRange[1]; //.split('T')[0]
      }
      this.showTable();
    },
    getData(status) {
      this.a = true;
      this.axios
        .get(
          "/zhunar/api/customerorder/customer/" + this.c_user_id + "/" + status
        )
        .then((response) => {
          this.order = response.data;
          console.log(this.order);
          for (let item of this.order) {
            item.start_date = item.start_date.split("T")[0].replace(/-/g, "/");
            item.end_date = item.end_date.split("T")[0].replace(/-/g, "/");
            item.day_time = item.day_time.split("T")[0].replace(/-/g, "/");
            item.timeLength =
              (new Date(item.end_date) - new Date(item.start_date)) / 86400000;
          }
          for (var k = 0; k < this.order.length; k++) {
            if (
              this.dataRange == null ||
              (new Date(this.order[k].day_time) >= new Date(this.time1) &&
                new Date(this.order[k].day_time) <= new Date(this.time2))
            )
              this.orderTemp.push(this.order[k]);
          }
          this.a = false;
        });
    },
    showTable() {
      if (this.activeName == "first") {
        this.dataRange = null;
        this.orderTemp.length = 0;
        this.getData("进行中");
      } else if (this.activeName == "third") {
        this.orderTemp.length = 0;
        this.getData("已退订");
      } else if(this.activeName=="second")
      {
        this.orderTemp.length = 0;
        this.getData("已完成");
      }
    },
    //展示评论信息
    showEvaDialog(newindex) {
      this.index = newindex;
      if (!!this.orderTemp[this.index].eday_time && true) {
        console.log("233");
      } else {
        this.orderTemp[this.index].star_level = 0;
        this.orderTemp[this.index].details = "";
      }
      this.showEva = true;
    },
      // 这里把评价信息传入数据库存储
    onSubmit() {
      this.showEva = false;
      console.log(this.orderTemp[this.index])
      this.axios
        .post(
          "/zhunar/api/estimation/add/" +
            this.orderTemp[this.index].order_id +
            "/" +
            this.orderTemp[this.index].details +
            "/" +
            this.orderTemp[this.index].star_level
        )
        .then((response) => {
          this.orderTemp[this.index].eday_time=response.data
          this.$message({
            type: "success",
            message: "提交成功!",
          });
        });
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
  font-weight: 550;
  color: #000;
}
</style>
