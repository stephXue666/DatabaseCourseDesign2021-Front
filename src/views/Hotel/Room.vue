<template>
  <el-container style="height: 700px">
    <el-header style="background-color: #2c3e50; color: white">
      <back-nav />
    </el-header>
    <el-container style="height: 100%">
      <el-aside width="200px" style="background-color: #545c64">
        <side-nav />
      </el-aside>
      <el-main>
        <el-card class="box-card">
          <el-container style="margin-left: 90%">
            <el-button
              type="primary"
              size="min"
              style="border-radius: 7px"
              @click="showDialog('addRoomMessage')"
            >
              添加
            </el-button>
          </el-container>
          <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column prop="room_type" label="房间类型" width="200px">
              <template #default="scope">
                <p style="font-size: 15px">{{ scope.row.room_type }}</p>
              </template>
            </el-table-column>

            <el-table-column
              prop="room_quantity"
              label="基准数量"
              width="200px"
            >
              <template #default="scope">
                <p style="font-weight: bold; font: 17px arial, sans-serif">
                  {{ scope.row.room_quantity }}
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="remaining" label="剩余数量" width="200px">
              <template #default="scope">
                <p style="font-weight: bold; font: 17px arial, sans-serif">
                  {{ scope.row.remaining }}
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="basic_price" label="基准价格" width="199px">
              <template #default="scope">
                <p style="color: #ff7400; font: 17px arial, sans-serif">
                  ￥{{ scope.row.basic_price }}
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="today_price" label="今日价格" width="199px">
              <template #default="scope">
                <p style="color: #ff7400; font: 17px arial, sans-serif">
                  ￥{{ scope.row.today_price }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="210px">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="min"
                  style="border-radius: 7px"
                  @click="showRoomDialog(scope.$index)"
                >
                  详细信息
                </el-button>
                <el-button
                  type="danger"
                  size="min "
                  style="border-radius: 7px"
                  @click="deleteRoom_type(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <el-dialog
            title="房型信息"
            v-model="adddialogVisible"
            width="505px"
            @close="resetForm('addRoomMessage')"
          >
            <el-form
              :model="addRoomMessage"
              status-icon
              :rules="rules"
              ref="addRoomMessage"
              label-width="100px"
            >
              <el-form-item
                label="房型名称"
                prop="room_type"
                style="text-align: left"
              >
                <el-input
                  v-model="addRoomMessage.room_type"
                  style="width: 300px"
                ></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="10">
                  <el-form-item
                    label="房型数量"
                    prop="room_quantity"
                    style="text-align: left"
                  >
                    <el-input
                      v-model.number="addRoomMessage.room_quantity"
                      style="width: 100px"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item
                    label="房型面积"
                    prop="area"
                    style="text-align: left"
                  >
                    <el-input
                      v-model.number="addRoomMessage.area"
                      style="width: 95px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                label="基准价格"
                prop="basic_price"
                style="text-align: left"
              >
                <el-input
                  v-model.number="addRoomMessage.basic_price"
                  style="width: 200px"
                ></el-input>
              </el-form-item>

              <el-form-item label="设施" style="text-align: left">
                <el-checkbox v-model="addRoomMessage.wifi">
                  <i class="iconfont icon-wifi"></i>wifi
                </el-checkbox>
                <el-checkbox v-model="addRoomMessage.windows">
                  <i class="iconfont icon-youchuanghu"></i>
                  窗户
                </el-checkbox>
                <el-checkbox v-model="addRoomMessage.smoke">
                  <i class="iconfont icon-jinyan"></i>
                  禁烟
                </el-checkbox>
              </el-form-item>

              <!-- <el-form-item label="上传实图" style="text-align: left">
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item> -->
              <el-button type="primary" @click="submitForm('addRoomMessage')"
                >保存并提交</el-button
              >
              <el-button @click="resetForm('addRoomMessage')">重置</el-button>
            </el-form>
          </el-dialog>

          <el-dialog
            top="0px"
            class="mydialog"
            title="详细信息"
            width="600px"
            :before-close="closeEditDialog"
            v-model="roomDialogVisible"
          >
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in tableData[index].url.length"
                :key="item"
              >
                <el-image
                  style="width: 100%; height: 100%"
                  :src="tableData[index].url[item - 1]"
                ></el-image>
              </el-carousel-item>
            </el-carousel>
            <el-tabs
              type="card"
              @tab-click="showEditDialog"
              v-model="activeName"
            >
              <el-tab-pane label="房间概况" name="first"></el-tab-pane>
              <el-tab-pane label="编辑信息" name="second"></el-tab-pane>
              <el-form
                status-icon
                :rules="rules"
                v-if="this.activeName == 'first'"
              >
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="房型名称" style="text-align: left">
                      {{ this.tableData[index].room_type }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="面积" style="text-align: left">
                      <span>{{ this.tableData[index].area }} ㎡</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="基准数量" style="text-align: left">
                      <span>{{ this.tableData[index].room_quantity }}</span>
                    </el-form-item>
                  </el-col>
                  <el-form-item label="基准价格" style="text-align: left">
                    <span style="color: #ff7400; font: 17px arial, sans-serif">
                      ￥{{ this.tableData[index].basic_price }}
                    </span>
                  </el-form-item>
                </el-row>
                <el-form-item label="基本设施:" style="text-align: left">
                  <el-tag v-if="tableData[index].wifi == 1">
                    <i class="iconfont icon-wifi"></i>wifi
                  </el-tag>
                  <el-tag v-if="this.tableData[index].windows == 1">
                    <i class="iconfont icon-youchuanghu"></i>
                    窗户
                  </el-tag>
                  <el-tag v-if="tableData[index].smoke == 1">
                    <i class="iconfont icon-jinyan"></i>
                    禁烟
                  </el-tag>
                </el-form-item>
                <el-form-item label="" style="text-align: left">
                  <el-date-picker
                    v-model="roomMessage.selectDate"
                    type="date"
                    :clearable="false"
                    :editable="false"
                    placeholder="选择日期"
                    value-format="YYYY-MM-DD"
                    @change="selectDayMessage"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      label="该日剩余数量:"
                      prop="remaining"
                      style="text-align: left"
                    >
                      <span style="font-size: 14px">{{
                        roomMessage.time_remaining
                      }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="该日价格:" style="text-align: left">
                      <span
                        style="color: #ff7400; font: 17px arial, sans-serif"
                      >
                        {{ roomMessage.time_price }}
                      </span>
                      <span style="font-size: 9px; color: gray"
                        >(默认为基准价格)</span
                      >
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>

              <el-form
                :model="roomMessage"
                status-icon
                :rules="rules"
                v-if="this.activeName == 'second'"
                ref="roomMessage"
              >
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="房型名称" style="text-align: left">
                      {{ this.tableData[index].room_type }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="面积"
                      prop="area"
                      style="text-align: left"
                    >
                      <el-input
                        v-model.number="this.roomMessage.area"
                        style="width: 107px; font-weight: bold"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="基准数量" style="text-align: left">
                      <span>{{ this.tableData[index].room_quantity }}</span>
                    </el-form-item>
                  </el-col>
                  <el-form-item label="基准价格" style="text-align: left">
                    <span style="color: #ff7400; font: 17px arial, sans-serif">
                      ￥{{ this.tableData[index].basic_price }}
                    </span>
                  </el-form-item>
                </el-row>

                <el-form-item label="基本设施:" style="text-align: left">
                  <el-checkbox v-model="this.roomMessage.wifi">
                    <i class="iconfont icon-wifi"></i>wifi
                  </el-checkbox>
                  <el-checkbox v-model="this.roomMessage.windows">
                    <i class="iconfont icon-youchuanghu"></i>
                    窗户
                  </el-checkbox>
                  <el-checkbox v-model="this.roomMessage.smoke">
                    <i class="iconfont icon-jinyan"></i>
                    禁烟
                  </el-checkbox>
                </el-form-item>
                <br />
                <el-form-item
                  label="提供日期:"
                  prop="dateRange"
                  style="text-align: left"
                >
                  <el-date-picker
                    v-model="roomMessage.dateRange"
                    type="daterange"
                    format="YYYY 年 MM 月 DD 日"
                    value-format="YYYY-MM-DD"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="show"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item
                  prop="time_prices"
                  label="修改价格:"
                  style="text-align: left"
                >
                  <el-input
                    v-model.number="roomMessage.time_prices"
                    style="width: 200px"
                  ></el-input>
                  <span style="font-size: 9px; margin-buttom: 0px; color: gray">
                    (默认为基准价格)</span
                  >
                </el-form-item>
              </el-form>
              <el-button
                @click="tijiao('roomMessage')"
                type="primary"
                v-if="this.activeName == 'second'"
                >保存并提交</el-button
              >
              <el-button
                @click="closeEditDialog"
                type="primary"
                v-if="this.activeName == 'second'"
                >退出编辑</el-button
              >
            </el-tabs>
          </el-dialog>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideNav from "../../components/SideNav";
import BackNav from "../../components/BackNav";
import BaseUrl from "../../config"
export default {
  components: {
    SideNav,
    BackNav,
  },
  created() {
    this.getData();
  },
  data() {
    var valiRoomType = (rule, value, callback) => {
      this.axios
        .get(BaseUrl.ZHUNAR+"/api/roomtype/judge/" + this.hotel_id + "/" + value)
        .then((response) => {
          if (response.data == false) {
            callback(new Error("已有该房型,请修改"));
          } else {
            callback();
          }
        });
    };
    var valiDay = (rule, value, callback) => {
      if (!!this.roomMessage.time_prices && (typeof(value)==undefined||value==""||value==[])) {
        callback(new Error("请输入时间"));
      } else {
        callback();
      }
    };
    var valiNumberPass2 = (rule, value, callback) => {
      //正整数
      let reg = /^[+]{0,1}(\d+)$/g;
      if (!reg.test(value)) {
        console.log(value);
        callback(new Error("请输入正数"));
      } else {
        callback();
      }
    };
    var valiNumberPass3 = (rule, value, callback) => {
      //正整数
      let reg = /^[+]{0,1}(\d+)$/g;
      if (!reg.test(value) && !!value) {
        console.log(value);
        callback(new Error("请输入正数"));
      } else {
        callback();
      }
    };
    return {
      hotel_id: 100,
      activeName: "first",
      index: -1,
      roomDialogVisible: false,
      loading: false,
      adddialogVisible: false,
      tableData: [
        // {
        //   room_type: "双人间",
        //   basic_price: 150,
        //   today_price: 170,
        //   room_quantity: 250,
        //   remaining: 150,
        //   area: 15,
        //   wifi: true,
        //   windows: false,
        //   smoke: false,
        //   url: [],
        // },
      ],
      //添加或者修改数据用的
      roomMessage: {
        selectDate: new Date(),
        dateRange: [],
        room_type: "",
        basic_price: "",
        today_price: "",
        time_price: "",
        time_prices: "",
        time_remaining: "",
        room_quantity: "",
        remaining: "",
        area: "",
        wifi: false,
        windows: false,
        smoke: false,
        url: [],
      },
      addRoomMessage: {
        room_type: "",
        basic_price: "",
        room_quantity: "",
        area: "",
        wifi: false,
        windows: false,
        smoke: false,
      },
      rules: {
        room_type: [
          { required: true, message: "请输入房间类型名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
          { required: true, validator: valiRoomType, trigger: "change" },
        ],
        room_type1: [],
        basic_price: [
          { required: true, message: "价格不能为空" },
          { type: "number", message: "价格必须为数字值" },
          { required: true, validator: valiNumberPass2, trigger: "change" },
        ],
        time_price: [
          { type: "number", message: "价格必须为数字值" },
          { required: true, validator: valiNumberPass3, trigger: "change" },
        ],
        time_prices: [
          { type: "number", message: "价格必须为数字值" },
          { required: true, validator: valiNumberPass3, trigger: "change" },
        ],
        today_price: [
          { type: "number", message: "价格必须为数字值" },
          { required: true, validator: valiNumberPass2, trigger: "change" },
        ],
        room_quantity: [
          { required: true, message: "房间数量不能为空" },
          { type: "number", message: "房间数量必须为数字值" },
          { required: true, validator: valiNumberPass2, trigger: "change" },
        ],
        area: [
          { required: true, message: "房间面积不能为空" },
          { type: "number", message: "房间面积必须为数字值" },
          { required: true, validator: valiNumberPass2, trigger: "change" },
        ],
        dateRange: [
          { required: true, validator: valiDay, trigger: "blur" }

          ],
      },
    };
  },
  methods: {
    getData() {
      this.loading = true
      this.axios
        .get(BaseUrl.ZHUNAR+"/api/roomtype/id/" + window.sessionStorage.getItem("uid"))
        .then((response) => {
          this.loading = false
          this.tableData = response.data;
          this.hotel_id = window.sessionStorage.getItem("uid");
        });
    },
    //展示添加界面
    showDialog() {
      this.adddialogVisible = true;
    },
    //添加界面提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const add = {
            hotel_id: parseInt(this.hotel_id),
            room_type: this.addRoomMessage.room_type,
            area: this.addRoomMessage.area,
            windows: this.addRoomMessage.windows == true ? 1 : 0,
            wifi: this.addRoomMessage.wifi == true ? 1 : 0,
            smoke: this.addRoomMessage.smoke == true ? 1 : 0,
            basic_price: this.addRoomMessage.basic_price,
            room_quantity: this.addRoomMessage.room_quantity,
            remaining: this.addRoomMessage.room_quantity,
            today_price: this.addRoomMessage.basic_price,
          };
          this.$confirm("是否保存并提交?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            this.axios.post(BaseUrl.ZHUNAR+"/api/roomtype/add", add).then(() => {
              this.adddialogVisible = false;
              this.getData();
              this.$message({
                type: "success",
                message: "保存成功!",
              });
              return true;
            });
          });
        }
      });
    },
    //重置页面
    resetForm(formName) {
      this.addRoomMessage.windows = false;
      this.addRoomMessage.wifi = false;
      this.addRoomMessage.smoke = false;
      this.$refs[formName].resetFields();
    },
    //详细信息页面打开
    showRoomDialog(newindex) {
      this.index = newindex;
      this.roomDialogVisible = true;
      this.activeName = "first";
      (this.roomMessage.selectDate = ""),
        (this.roomMessage.time_price = ""),
        (this.roomMessage.time_remaining = ""),
        (this.roomMessage.area = this.tableData[this.index].area);
      this.roomMessage.wifi =
        this.tableData[this.index].wifi == 1 ? true : false;
      this.roomMessage.windows =
        this.tableData[this.index].windows == 1 ? true : false;
      this.roomMessage.smoke =
        this.tableData[this.index].smoke == 1 ? true : false;
      this.roomMessage.time_prices = "";
      this.roomMessage.dateRange = [];
    },
    //退出编辑
    closeEditDialog() {
      if(this.activeName=="second")
      {
      this.$confirm("您还有未保存的更改,是否退出编辑?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.roomMessage.dateRange = [];
          this.roomDialogVisible = false;
          this.roomMessage.time_prices = "";
          this.roomMessage.time_prices = "";
          this.roomMessage.time_remaining = "";
          this.roomMessage.area = "";
          this.activeName = "first";
        })
      }
      else{
        this.roomMessage.dateRange = [];
          this.roomDialogVisible = false;
          this.roomMessage.time_prices = "";
          this.roomMessage.time_prices = "";
          this.roomMessage.time_remaining = "";
          this.roomMessage.area = "";
          this.activeName = "first";
      }
    },
    //编辑提交的时候
    tijiao(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let change = {
            hotel_id: parseInt(this.hotel_id),
            room_type: this.tableData[this.index].room_type,
            area: parseInt(this.roomMessage.area),
            wifi: this.roomMessage.wifi == true ? 1 : 0,
            windows: this.roomMessage.windows == true ? 1 : 0,
            smoke: this.roomMessage.smoke == true ? 1 : 0,
            start_date: (!!this.roomMessage.dateRange[0]==true)?this.roomMessage.dateRange[0] + "T00:00:00":"2000-01-02T00:00:00",
            end_date: (!!this.roomMessage.dateRange[1]==true)?this.roomMessage.dateRange[1] + "T00:00:00":"2000-01-01T00:00:00",
            price: (!!this.roomMessage.time_prices==true)?this.roomMessage.time_prices:-1
          };
          console.log(change);
          this.axios.put(BaseUrl.ZHUNAR+"/api/roomtimeslot/update", change).then(() => {
            this.getData();
            this.roomDialogVisible = false;
            this.$message({
              type: "success",
              message: "保存成功!",
            });
            return true;
          });
        }
      });
    },
    //删除房型
    deleteRoom_type(newindex) {
      this.index = newindex;
      this.axios
        .delete(
          BaseUrl.ZHUNAR+"/api/roomtype/delete?id=" +
            this.hotel_id +
            "&type=" +
            this.tableData[this.index].room_type
        )
        .then(() => {
          this.$confirm("是否确定删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            this.getData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        });
    },
    //查找时间
    selectDayMessage() {
      if (!!this.roomMessage.dateRange && true) {
        let selecttime = this.roomMessage.selectDate + "T00:00:00";
        this.axios
          .get(
            BaseUrl.ZHUNAR+"/api/roomtimeslot/timeslot?id=" +
              this.hotel_id +
              "&type=" +
              this.tableData[this.index].room_type +
              "&date=" +
              selecttime
          )
          .then((response) => {
            let temp = response.data;
            console.log(response.data);
            this.roomMessage.time_price = temp.current_price;
            this.roomMessage.time_remaining = temp.remain;
          });
      } else {
        console.log("none");
        this.roomMessage.time_price = "";
        this.roomMessage.time_remaining = "";
      }
    },
  },
};
</script>
<style>
</style>