<template>
  <el-container style="height: 700px">
    <el-header style="background-color: #2c3e50; color: white">
      <back-nav/>
    </el-header>
    <el-container style="height: 100%" >
      <el-aside width="200px" style="background-color: #545c64">
        <side-nav/>
      </el-aside>
      <el-main v-loading="loadingOrderData">
        <el-scrollbar>
        <el-card class="box-card">
          
          <el-tabs v-model="tabActiveName">
            <!-- 全部订单列表!-->
            <el-tab-pane label="全部订单" name="allOrders">
              <el-divider v-if="allOrdersNum>0" content-position="left">共有{{ allOrdersNum }}条订单信息</el-divider>
              <el-table
                :data="allOrdersData"
                style="width: 100%"
                :stripe="true">
                <el-table-column
                  prop="order_id"
                  label="订单号"
                  min-width="20%">
                </el-table-column>
                <el-table-column
                  prop="customer_name"
                  label="预定人"
                  min-width="20%">
                </el-table-column>
                <el-table-column
                  prop="room_type"
                  label="房间类型"
                  min-width="23%">
                </el-table-column>
                <el-table-column
                  prop="room_quantity"
                  label="订房数量"
                  min-width=20%
                  align="center">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  align="right"
                  min-width="10%">
                  <template #default="scope">
                    <el-button @click="showMoreInfo(scope.row)" type="text" size="small">
                      订单详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 当前订单列表!-->
            <el-tab-pane label="当前订单" name="currentOrders">
              <el-divider v-if="currentOrdersNum>0" content-position="left">共有{{ currentOrdersNum }}条订单信息</el-divider>
              <el-table
                :data="currentOrdersData"
                :stripe="true"
                style="width: 100%">
                <el-table-column
                  prop="order_id"
                  label="订单号"
                  min-width="18%">
                </el-table-column>
                <el-table-column
                  prop="customer_name"
                  label="预定人"
                  min-width="18%">
                </el-table-column>
                <el-table-column
                  prop="room_type"
                  label="房间类型"
                  min-width="18%">
                </el-table-column>
                <el-table-column
                  prop="room_quantity"
                  label="订房数量"
                  min-width="15%"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="end_date"
                  label="离店日期"
                  min-width="21%"
                  align="center">
                  <template #default="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.end_date }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  align="right"
                  min-width="10%">
                  <template #default="scope">
                    <el-button @click="showMoreInfo(scope.row)" type="text" size="small">
                      订单详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 预定订单列表!-->
            <el-tab-pane label="预定订单" name="reserveOrders">  
              <el-divider v-if="reserveOrdersNum>0" content-position="left">共有{{ reserveOrdersNum }}条订单信息</el-divider>
              <el-table
                :data="reserveOrdersData"
                :stripe="true"
                style="width: 100%">
                <el-table-column
                  prop="order_id"
                  label="订单号"
                  min-width="18%">
                </el-table-column>
                <el-table-column
                  prop="customer_name"
                  label="预定人"
                  min-width="18%">
                </el-table-column>
                <el-table-column
                  prop="room_type"
                  label="房间类型"
                  min-width="18%">
                </el-table-column>
                <el-table-column
                  prop="room_quantity"
                  label="订房数量"
                  min-width="15%"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="start_date"
                  label="进店日期"
                  min-width="21%"
                  align="center">
                  <template #default="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.start_date }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  align="right"
                  min-width="10%">
                  <template #default="scope">
                    <el-button @click="showMoreInfo(scope.row)" type="text" size="small">
                      订单详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 历史订单列表!-->
            <el-tab-pane label="历史订单" name="historyOrders">
              <el-divider v-if="historyOrdersNum>0" content-position="left">共有{{ historyOrdersNum }}条订单信息</el-divider>
              <el-table
                :data="historyOrdersData"
                :stripe="true"
                style="width: 100%">
                <el-table-column
                  prop="order_id"
                  label="订单号"
                  min-width="18%">
                </el-table-column>
                <el-table-column
                  prop="customer_name"
                  label="预定人"
                  min-width="18%">
                </el-table-column>
                <el-table-column
                  prop="room_type"
                  label="房间类型"
                  min-width="18%">
                </el-table-column>
                <el-table-column
                  prop="room_quantity"
                  label="订房数量"
                  min-width="15%"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="end_date"
                  label="离店日期"
                  min-width="21%"
                  align="center">
                  <template #default="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.end_date }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  min-width="10%"
                  align="right">
                  <template #default="scope">
                    <el-button @click="showMoreInfo(scope.row)" type="text" size="small">
                      订单详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 查询订单列表!-->
            <el-tab-pane label="查询订单" name="searchOrders">
              <el-row>
                <el-col :span="3"></el-col>
                <el-col :span="5">
                  <div style="margin-top: 9px">
                    <i class="el-icon-s-custom"></i>
                    查询预定人姓名:
                  </div>
                </el-col>
                <el-col :span="8">
                <el-input v-model="searchInput" placeholder="请输入内容"></el-input>
                </el-col>
                <el-col :span="1"></el-col>
                <el-button icon="el-icon-search" size="medium" @click="searchReserveName">搜索</el-button>
              </el-row>

              <el-divider v-show="searchedOrdersNum>0" content-position="left">共有{{ searchedOrdersNum }}条搜索结果</el-divider>
              <el-table
                v-show="searchedOrdersNum>0"
                :data="searchedOrdersData"
                :stripe="true"
                style="width: 100%">
                <el-table-column
                  prop="order_id"
                  label="订单号"
                  min-width="20%">
                </el-table-column>
                <el-table-column
                  prop="customer_name"
                  label="预定人"
                  min-width="20%">
                </el-table-column>
                <el-table-column
                  prop="room_type"
                  label="房间类型"
                  min-width="23%">
                </el-table-column>
                <el-table-column
                  prop="room_quantity"
                  label="订房数量"
                  min-width=20%
                  align="center">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  align="right"
                  min-width="10%">
                  <template #default="scope">
                    <el-button @click="showMoreInfo(scope.row)" type="text" size="small">
                      订单详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>

          <!--详细信息!-->
          <el-dialog
            title="订单详情"
            v-model="dialogVisible"
            width="50%">
            <el-descriptions :column="2" border="true">
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-s-order"></i>
                订单号
              </template>
              {{ detailedInfo.order_id }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-info"></i>
                订单状态
              </template>
              {{ detailedInfo.order_status }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-user"></i>
                用户账号
              </template>
              {{ detailedInfo.c_user_id }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-s-custom"></i>
                预定人姓名
              </template>
              {{ detailedInfo.customer_name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-school"></i>
                房间类型
              </template>
              <el-tag size="small">{{ detailedInfo.room_type }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-office-building"></i>
                房间数量
              </template>
              {{ detailedInfo.room_quantity }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-time"></i>
                入住时间
              </template>
              {{ detailedInfo.start_date }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-time"></i>
                离开时间
              </template>
              {{ detailedInfo.end_date }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-bank-card"></i>
                付款金额
              </template>
              {{ detailedInfo.order_money }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-timer"></i>
                付款时间
              </template>
              {{ detailedInfo.day_time }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <i class="el-icon-phone"></i>
                联系电话
              </template>
              {{ detailedInfo.phone_num }}
            </el-descriptions-item>
            </el-descriptions>
            <template #footer>
              <span class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false" size="small">确 定</el-button>
              </span>
            </template>
          </el-dialog>

        </el-card>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideNav from "../../components/SideNav"
import BackNav from "../../components/BackNav"

export default {
	components: {
    SideNav,
    BackNav,
	},
  created(){
    let currentDate = new Date();
    let orderEnterDate, orderExitDate;

    // 调用接口- 获得所有酒店订单信息
    //this.hid = window.sessionStorage.getItem('hid');
    this.hid = "100";
    this.axios.get("/zhunar/api/customerOrder/hotel/" + this.hid).then(
      (response) =>{
        this.orderData = response.data;
        for(let order of this.orderData){
          
          order.start_date = order.start_date.split('T')[0];
          order.end_date = order.end_date.split('T')[0];
          this.allOrdersData.push(order); // 将order加入全部订单列表
          orderEnterDate = new Date(order.start_date); // order进店日期
          orderExitDate = new Date(order.end_date); // order离店日期

          if(orderExitDate < currentDate){ // 在今天之前离开店
            this.historyOrdersData.push(order); // 加入历史订单
          }
          else if(orderEnterDate <= currentDate){ // 在今天之前入住
            this.currentOrdersData.push(order); // 加入当前订单
          }
          else{
            this.reserveOrdersData.push(order); // 否则，加入预定订单
          }
        }
        this.allOrdersNum = this.allOrdersData.length;
        this.currentOrdersNum = this.currentOrdersData.length;
        this.reserveOrdersNum = this.reserveOrdersData.length;
        this.historyOrdersNum = this.historyOrdersData.length;
        setTimeout(()=>{this.loadingOrderData = false;},100);
      }
    );
  },
  data() {
    return {
      orderData: [],
      loadingOrderData: true,
      hid: 0,
      tabActiveName: "allOrders",
      allOrdersData: [],
      allOrdersNum: 0,
      currentOrdersData: [],
      currentOrdersNum: 0,
      reserveOrdersData: [],
      reserveOrdersNum: 0,
      historyOrdersData: [],
      historyOrdersNum: 0,
      searchedOrdersData: [],
      searchedOrdersNum: 0,
      searchInput: "",
      dialogVisible: false,
      detailedInfo: {}
    }
  },
  methods: {
    showMoreInfo: function(info){
      this.detailedInfo = info;
      this.dialogVisible = true;
    },
    searchReserveName: function(){
      this.searchedOrdersNum = 0;
      this.searchedOrdersData = [];
      for(let order of this.orderData){
        if(order.customer_name.search(this.searchInput)!=-1){ // 找到检索目标
          this.searchedOrdersData.push(order);
        }
      }
      this.searchedOrdersNum = this.searchedOrdersData.length;
      if(this.searchedOrdersNum == 0) // 检索结果为0条，即没有搜索结果
      {
        this.$alert('没有搜索结果', '', {
          confirmButtonText: '确定',
        });
      }
      this.searchInput = "";
    }
  }
}
</script>
