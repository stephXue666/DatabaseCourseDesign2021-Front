<template>
  <el-container>
    <el-header style="padding: 0">
      <TopNav />
    </el-header>
    <el-main>
      <el-card class="box-card" style="margin-left: 10%; margin-right: 10%">
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
                @change="show"
                v-if="this.activeName!='second'"
              ></el-date-picker>
            </div>
          </el-col>
        </el-row>
        <!-- 这里考虑v-loading -->
        <el-table :data="orderTemp" stripe>
          <el-table-column label="酒店" width="400">
            <template #default="scope">
          
              <el-row>
                <el-col :span="8">
                  <el-image :src="scope.row.hotelImage"></el-image
                ></el-col>
                <el-col :span="15" :offset="1">
                  {{ scope.row.hotelName }}
                  <br>
                  <link href="//at.alicdn.com/t/font_2651833_p7i4gve45t.css">
                  
                  <i class="iconfont  icon-icon-yilidian"></i>
                   <i class=" iconfont icon-zhusu">{{scope.row.orderTime}}</i>
                  <i class="el-icon-share"> {{ scope.row.startTime }}</i>
                  <i class="el-icon-delete">{{ scope.row.endTime }}</i>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="价格" width="200">
            <template #default="scope" >
              <p id="price">
              ￥{{ scope.row.orderPrice }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" width="200">
            <template #default="scope">
              {{ scope.row.orderStatus }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="330">
            <template #default="scope">
              <el-button
                @click="showEvaDialog(scope.$index)"
                type="primary"
                size="min"
               v-show="this.activeName=='first'||this.activeName=='third'"
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
                v-show="this.activeName==='second'"
                >退订</el-button
              >
               <el-button
                size="min"
                type="danger"
                @click="deleteorder(scope.$index)"
                v-show="this.activeName=='first'||this.activeName=='third'"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="评论" v-model="showEva" width="500px">
          <el-col :span="18">
            <el-rate v-model="value" show-text >
            </el-rate>
            <br>
          </el-col>
          <el-input
            placeholder="评价"
            v-model="form.evaluate"
            type="textarea"
            rows="8"
          ></el-input>
<br><br>
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
              <p id="orderStatus">{{ this.orderTemp[this.index].orderStatus }}</p>
              <p v-show="this.orderTemp[this.index].orderStatus == '已退订'">
                订单已取消
              </p>
              <p v-show="this.orderTemp[this.index].orderStatus == '已完成'">
                感谢您的预定，期待您再次使用本软件
              </p>
              <el-button round>再次预定</el-button>
            </el-card>

            <el-descriptions
              class="margin-top"
              title="房间信息"
              :column="1"
              border="true"
            >
              <el-descriptions-item label="入离时间">
                <span>
                  {{ this.orderTemp[this.index].startTime }}后入住
                  <br />
                  <el-tag size="small"
                    >共{{ this.orderTemp[this.index].timeLength }}晚</el-tag
                  >
                  <br />
                  {{ this.orderTemp[this.index].startTime }}前离店
                  <br />
                  <span style="color: #9f9f9f; font-size: 5px"
                    >如需提前入住,延迟退房,请联系酒店协商</span
                  >
                </span>
              </el-descriptions-item>

              <el-descriptions-item label="酒店">
                <el-row>
                  <el-col :span="21">
                    {{ this.orderTemp[this.index].hotelName }}
                    <br />
                    {{ this.orderTemp[this.index].hotelAddress }}
                  </el-col>
                  <!-- 这里调用酒店详情路由 -->
                  <el-col :span="3" style="align: right">
                    <el-link type="primary" right="0">酒店详情</el-link>
                  </el-col>
                </el-row>
              </el-descriptions-item>

              <el-descriptions-item label="房型">
                {{ this.orderTemp[index].roomType }}
                <!-- 这里写酒店房间的简要属性 -->
              </el-descriptions-item>
              <el-descriptions-item label="其他">
                <!-- 这里随便写 -->
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions
              class="margin-top"
              title="入住信息"
              :column="2"
              border="true"
            >
              <el-descriptions-item label="入住人">
                {{ orderTemp[index].name }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号" width="50">
                {{ orderTemp[index].phoneNumber }}
              </el-descriptions-item>
              <el-descriptions-item label="订单号">
                {{ orderTemp[index].orderId }}
              </el-descriptions-item>
              <el-descriptions-item label="下单时间">
                {{ orderTemp[index].orderTime }}
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
      form: {
        evaluate: "",
      },
      time1: "",
      time2: "",
      // 说明绑定的是历史订单还是其他的什么
      activeName: "second",
      // 时间长度
      dataRange: null,
      value: "",
      index: -1,
      dialogVisible: false,
      showEva: false,
      order: [
        {
          name: "nzh",
          orderId: "123",
          orderTime: new Date("2021-04-06 19:45"),
          hotelImage:
            "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
          hotelName: "上海田园佳美酒店",
          startTime: "2017-08-01 18:56:38",
          endTime: "2017/08/28 04:56:38",
          orderPrice: 828,
          orderStatus: "已退订",
          hotelAddress: "曹安公路4800号",
          roomType: "大床房",
          phoneNumber: 12345,
          timeLength: "",
        },
        {
          name: "nzh",
          orderId: "1234",
          orderTime: new Date("2021-05-06 19:45"),
          hotelImage:
            "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
          hotelName: "上海园佳美酒店",
          startTime: "2017-08-01 18:56:38",
          endTime: "2017/08/28 04:56:38",
          orderPrice: 188,
          orderStatus: "已完成",
          hotelAddress: "曹安公路4800号",
          roomType: "情侣房",
          phoneNumber: 12345,
          timeLength: "",
        },
        {
          name: "nzh",
          orderId: "12345",
          orderTime: new Date("2021-06-06 19:45"),
          hotelImage:
            "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
          hotelName: "上海田佳美酒店",
          startTime: "2017-08-01 18:56:38",
          endTime: "2017/08/28 04:56:38",
          orderPrice: 288,
          orderStatus: "进行中",
          hotelAddress: "曹安公路4800号",
          roomType: "电竞房",
          phoneNumber: 12345,
          timeLength: "",
        },
      ],
      orderTemp: [], //这里是一个替代的数组
    };
  },
  created() {
    this.doTimeLength();
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
          for (var i = 0; i < this.order.length; i++) {
            if (this.order[i].orderId == this.orderTemp[this.index].orderId) {
              this.order.splice(i, 1);
              console.log(this.index);
              break;
            }
          }
          this.showTable();
          //这里要使得服务器订单对应删除

          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
      leaveorder(newindex) {
      this.index = newindex;
      console.log(this.index);
      this.$confirm("请确认是否退订？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          for (var i = 0; i < this.order.length; i++) {
            if (this.order[i].orderId == this.orderTemp[this.index].orderId) {
             this.order[i].orderStatus="已退订"
              break;
            }
          }
          this.showTable();
          //这里要使得服务器订单对应删除
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
    showDialog(newindex) {
      this.index = newindex;
      this.dialogVisible = true;
    },
    show() {
      if (this.dataRange != null) {
        this.time1 = this.dataRange[0].getTime();
        this.time2 = this.dataRange[1].getTime();
        console.log("233");
      }
      this.showTable();
    },
    doTimeLength() {
      for (var i = 0; i < this.order.index; i++) {
        this.order[i].timeLength =
          this.order[i].endTime - this.order[i].startTime;
        console.log(this.order[i].timeLength);
      }
    },
    showTable() {
      if (this.activeName == "first") {
        this.orderTemp.length = 0;
        for (var i = 0; i < this.order.length; i++) {
          if (this.order[i].orderStatus == "已完成") {
            if (
              this.dataRange == null ||
              (this.order[i].orderTime.getTime() >= this.time1 &&
                this.order[i].orderTime.getTime() <= this.time2)
            )
              this.orderTemp.push(this.order[i]);
          }
        }
      } else if (this.activeName == "second") {
        console.log(this.activeName)
        this.orderTemp.length = 0
        for (var j = 0; j < this.order.length; j++) {
          if (this.order[j].orderStatus == "进行中") {
            if (
              this.dataRange == null ||
              (this.order[j].orderTime.getTime() >= this.time1 &&
                this.order[j].orderTime.getTime() <= this.time2)
            )
              this.orderTemp.push(this.order[j]);
          }
        }
      } else if (this.activeName == "third") {
        console.log(this.activeName);
        this.orderTemp.length = 0;
        for (var k = 0; k < this.order.length; k++) {
          if (this.order[k].orderStatus == "已退订") {
            if (
              this.dataRange == null ||
              (this.order[k].orderTime.getTime() >= this.time1 &&
                this.order[k].orderTime.getTime() <= this.time2)
            )
              this.orderTemp.push(this.order[k]);
          }
        }
      }
    },
    showEvaDialog() {
      this.showEva = true;

      // 这里把评价信息传入数据库存储
    },
  },
};
</script>

<style>
#price {
	color:#ff7400;
  font-weight:bold;
  font: bold 20px arial,sans-serif;
}
#orderStatus{
  font-size: 25px;
    font-weight: 600;
    color: #000;
}
</style>
