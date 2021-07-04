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
          <el-tab-pane label="历史订单" name="first"></el-tab-pane>
          <el-tab-pane label="正在进行中" name="second"></el-tab-pane>
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
              ></el-date-picker>
            </div>
          </el-col>
        </el-row>
        <!-- 这里考虑v-loading -->
        <el-table :data="orderTemp" stripe>
          <el-table-column label="酒店" width="450">
            <template #default="scope">
              <el-row>
                <el-col :span="8">
                  <el-image :src="scope.row.hotelImage"></el-image
                ></el-col>
                <el-col :span="16">
                  {{ scope.row.hotelName }}
                  <br />
                  <i class="el-icon-share"> {{ scope.row.startTime }}</i>
                  <i class="el-icon-delete">{{ scope.row.endTime }}</i>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="价格" width="250">
            <template #default="scope">
              {{ scope.row.orderPrice }}
            </template>
          </el-table-column>
          <el-table-column label="订单状态" width="200">
            <template #default="scope">
              {{ scope.row.orderStatus }}
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="200">
            <template #default="scope">
              <el-button
                @click="showDialog(scope.$index)"
                type="primary"
                size="min"
              >
                详情信息
              </el-button>
              <el-button size="min" type="danger" @click="deleteorder"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-dialog title="订单详情" v-model="dialogVisible">
          <el-card class="box-card" shadow="never">
            <h1>{{ this.orderTemp[this.index].orderStatus }}</h1>
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
            :size="size"
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
          <br /><br />

          <el-descriptions
            class="margin-top"
            title="入住信息"
            :column="2"
            :size="size"
            border="true"
          >
            <el-descriptions-item label="入住人">
              {{ orderTemp[index].name }}
            </el-descriptions-item>
            <el-descriptions-item label="手机号" width="50">
              {{ orderTemp[index].phoneNumber }}
            </el-descriptions-item>
            <el-descriptions-item label="入住需知"> </el-descriptions-item>
            <el-descriptions-item label="订单号">
              {{ orderTemp[index].orderId }}
            </el-descriptions-item>
            <el-descriptions-item label="下单时间">
              {{ orderTemp[index].orderTime }}
            </el-descriptions-item>
            <el-descriptions-item label="商家"> </el-descriptions-item>
            <el-descriptions-item label="经营者"> </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
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
      // 说明绑定的是历史订单还是其他的什么
      activeName: "first",
      // 时间长度
      dataRange: "",
      value: "",
      index: -1,
      size: "",
      dialogVisible: false,
      order: [
        {
          name: "nzh",
          orderId: "",
          orderTime: "",
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
          orderId: "",
          orderTime: "",
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
          orderId: "",
          orderTime: "",
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
    this.showTable();
  },
  methods: {
    /*此处调用api中删除订单的方法*/
    deleteorder() {},
    showDialog(newindex) {
      this.index = newindex;
      this.dialogVisible = true;
    },
    // 调用接口，把已退订的传进来
    orderDoing() {},
    show() {
      var time1 = this.dataRange[0].getTime();
      var time2 = this.dataRange[1].getTime();

      this.orderTemp.length = 0;
      for (var i = 0; i < this.order.length; i++) {
        if (
          this.order[i].orderTime.getTime() >= time1 &&
          this.order[i].orderTime.getTime() <= time2
        ) {
          this.orderTemp.push(this.order[i]);
        }
      }
    },
    doTimeLength() {
      this.orderTemp[this.index].timeLength =
        this.orderTemp[this.index].endTime - this.orderTemp[this.index].startTime;
    },
    showTable() {
      if (this.activeName == "first") {
        console.log(this.activeName);
        this.orderTemp.length = 0;
        for (var i = 0; i < this.order.length; i++) {
          if (this.order[i].orderStatus == "已完成") {
            this.orderTemp.push(this.order[i]);
          }
        }
      } else if (this.activeName == "second") {
        console.log(this.activeName);
        this.orderTemp.length = 0;
        for (var j = 0; j < this.order.length; j++) {
          if (this.order[j].orderStatus == "进行中") {
            this.orderTemp.push(this.order[j]);
          }
        }
      } else if (this.activeName == "third") {
        console.log(this.activeName);
        this.orderTemp.length = 0;
        for (var k = 0; k < this.order.length; k++) {
          if (this.order[k].orderStatus == "已退订") {
            this.orderTemp.push(this.order[k]);
          }
        }
      }
    },
  },
};
</script>
