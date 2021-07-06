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
          <el-row>
            <el-col :span="2" :offset="22">
              <el-button
                type="primary"
                size="min"
                style="border-radius: 7px"
                @click="showDialog('roomMessage')"
              >
                添加
              </el-button>
            </el-col>
          </el-row>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="roomType" label="房间类型" width="205">
              <template #default="scope">
                <h3>{{ scope.row.roomType }}</h3>
              </template>
            </el-table-column>

            <el-table-column prop="roomNumber" label="基准数量" width="205">
              <template #default="scope">
                <p style="font-weight: bold; font: bold 18px arial, sans-serif">
                  {{ scope.row.roomNumber }}
                </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="todayRoomNumber"
              label="剩余数量"
              width="205"
            >
              <template #default="scope">
                <p style="font-weight: bold; font: bold 18px arial, sans-serif">
                  {{ scope.row.todayRoomNumber }}
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="基准价格" width="205">
              <template #default="scope">
                <p
                  style="
                    color: #ff7400;
                    font-weight: bold;
                    font: bold 18px arial, sans-serif;
                  "
                >
                  ￥{{ scope.row.price }}
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="todayPrice" label="今日价格" width="205">
              <template #default="scope">
                <p
                  style="
                    color: #ff7400;
                    font-weight: bold;
                    font: bold 18px arial, sans-serif;
                  "
                >
                  ￥{{ scope.row.todayPrice }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
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
                  @click="deleteRoomType(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <el-dialog title="房型信息" v-model="dialogVisible">
            <el-form
              :model="roomMessage"
              status-icon
              :rules="rules"
              ref="roomMessage"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item
                label="房型名称"
                prop="roomType"
                style="text-align: left"
              >
                <el-input
                  v-model="roomMessage.roomType"
                  style="width: 300px"
                ></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="6">
                  <el-form-item
                    label="房型数量"
                    prop="roomNumber"
                    style="text-align: left"
                  >
                    <el-input
                      v-model.number="roomMessage.roomNumber"
                      style="width: 100px"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item
                    label="房型面积"
                    prop="roomArea"
                    style="text-align: left"
                  >
                    <el-input
                      v-model.number="roomMessage.roomArea"
                      style="width: 100px"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3"><p>m^2</p></el-col>
              </el-row>
              <el-form-item
                label="基准价格"
                prop="price"
                style="text-align: left"
              >
                <el-input
                  v-model.number="roomMessage.price"
                  style="width: 200px"
                ></el-input>
              </el-form-item>
              <el-form-item label="提供价格" style="text-align: left">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="show"
                ></el-date-picker>
              </el-form-item>

              <el-form-item prop="timeprice" style="text-align: left">
                <el-input
                  v-model.number="roomMessage.timeprice"
                  style="width: 200px"
                ></el-input>
                <span style="font-size: 9px; margin-buttom: 0px; color: gray">
                  (默认为基准价格￥{{ roomMessage.price }})</span
                >
              </el-form-item>

              <el-form-item label="设施" style="text-align: left">
                <el-checkbox v-model="roomMessage.Wifi">
                  <i class="iconfont icon-wifi"></i>WIFI
                </el-checkbox>
                <el-checkbox v-model="roomMessage.roomWindow">
                  <i class="iconfont icon-youchuanghu"></i>
                  窗户
                </el-checkbox>
                <el-checkbox v-model="roomMessage.roomSmoke">
                  <i class="iconfont icon-jinyan"></i>
                  禁烟
                </el-checkbox>
              </el-form-item>

              <el-form-item label="上传实图" style="text-align: left">
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
              <el-button type="primary" @click="submitForm('roomMessage')"
                >保存并提交</el-button
              >
              <el-button @click="resetForm('roomMessage')">重置</el-button>
            </el-form>
          </el-dialog>
          <el-dialog
            class="mydialog"
            title="详细信息"
            v-model="roomDialogVisible"
            @close="closeEditDialog('roomMessage')"
            style="padding: 0px"
          >
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in 5" :key="item">
                <el-image
                  src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
                ></el-image>
              </el-carousel-item>
            </el-carousel>
            <h2 style="text-align: left">房间概况</h2>
            <el-form
              :model="roomMessage"
              status-icon
              :rules="rules"
              ref="roomMessage"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label="房型名称"
                    prop="roomType"
                    style="text-align: left"
                  >
                    <span v-if="this.editVisible == false">{{
                      this.tableData[index].roomType
                    }}</span>
                    <el-input
                      v-if="this.editVisible == true"
                      v-model="this.roomMessage.roomType"
                      style="width: 100px; font-weight: bold"
                    ></el-input>
                    <!-- //这里需要对接数据库 -->
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item
                    label="基准数量"
                    prop="roomNumber"
                    style="text-align: left"
                  >
                    <span v-if="this.editVisible == false"
                      >{{ this.tableData[index].roomNumber }}间</span
                    >
                    <el-input
                      v-if="this.editVisible == true"
                      v-model.number="this.roomMessage.roomNumber"
                      placeholder=""
                      style="width: 70px; font-weight: bold"
                    ></el-input>
                    <!-- //这里需要对接数据库 -->
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="今日剩余数量"
                    prop="todayRoomNumber"
                    style="text-align: left"
                  >
                    <span style="font-size: 14px"
                      >{{ this.tableData[index].todayRoomNumber }}间</span
                    >
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label="基准价格"
                    prop="price"
                    style="text-align: left"
                  >
                    <span
                      v-if="this.editVisible == false"
                      style="
                        color: #ff7400;
                        font-weight: bold;
                        font: bold 17px arial, sans-serif;
                      "
                    >
                      ￥{{ this.tableData[index].price }} </span
                    ><!-- //这里需要对接数据库 -->
                    <el-input
                      v-if="this.editVisible == true"
                      v-model.number="this.roomMessage.price"
                      style="width: 70px; font-weight: bold"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="9">
                  <el-form-item
                    label="今日价格"
                    prop="todayPrice"
                    style="text-align: left"
                  >
                    <span
                      v-if="this.editVisible == false"
                      style="
                        color: #ff7400;
                        font-weight: bold;
                        font: bold 17px arial, sans-serif;
                      "
                    >
                      ￥{{ this.tableData[index].todayPrice }}
                    </span>
                    <el-input
                      v-if="this.editVisible == true"
                      v-model.number="this.roomMessage.todayPrice"
                      @change="changeNull"
                      style="width: 70px; font-weight: bold"
                    ></el-input>
                    <span style="font-size: 9px; color: gray"
                      >(默认为基准价格)</span
                    >
                  </el-form-item>
                </el-col>

                <el-col :span="7">
                  <el-form-item
                    label="面积"
                    prop="roomArea"
                    style="text-align: left"
                  >
                    <el-input
                      v-if="this.editVisible == true"
                      v-model.number="this.roomMessage.roomArea"
                      style="width: 70px; font-weight: bold"
                    ></el-input>
                    <el-tag size="medium" v-if="this.editVisible == false"
                      >{{ this.tableData[index].roomArea }}m^2</el-tag
                    >
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="基本设施" style="text-align: left">
                <el-checkbox v-model="tableData[index].roomWifi">
                  <i class="iconfont icon-wifi"></i>WIFI
                </el-checkbox>
                <el-checkbox v-model="tableData[index].roomWindow">
                  <i class="iconfont icon-youchuanghu"></i>
                  窗户
                </el-checkbox>
                <el-checkbox v-model="tableData[index].roomSmoke">
                  <i class="iconfont icon-jinyan"></i>
                  禁烟
                </el-checkbox>
              </el-form-item>
            </el-form>
            <el-button
              @click="showEditDialog"
              type="primary"
              v-if="this.editVisible == false"
              >编辑信息</el-button
            >
            <el-button
              @click="tijiao('roomMessage')"
              type="primary"
              v-if="this.editVisible == true"
              >保存并提交</el-button
            >
            <el-button
              @click="closeEditDialog('roomMessage')"
              type="primary"
              v-if="this.editVisible == true"
              >退出编辑</el-button
            >
          </el-dialog>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideNav from "../../components/SideNav";
import BackNav from "../../components/BackNav";
export default {
  components: {
    SideNav,
    BackNav,
  },
  data() {
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
      editVisible: false,
      dateRange: null,
      index: -1,
      roomDialogVisible: false,
      dialogVisible: false,
      tableData: [
        {
          roomType: "双人间",
          price: 150,
          todayPrice: 170,
          roomNumber: 250,
          todayRoomNumber: 150,
          roomArea: 15,
          roomWifi: true,
          roomWindow: false,
          roomSmoke: false,
        },
        {
          roomType: "单人间",
          price: 130,
          todayPrice: 120,
          roomNumber: 200,
          todayRoomNumber: 130,
          roomArea: 25,
          roomWifi: false,
          roomWindow: true,
          roomSmoke: false,
        },
      ],
      //添加或者修改数据用的
      roomMessage: {
        roomType: "",
        price: "",
        todayPrice: "",
        roomNumber: "",
        todayRoomNumber: "",
        roomArea: "",
        roomWifi: false,
        roomWindow: false,
        roomSmoke: false,
      },
      temp: {
        roomType: "",
        price: "",
        todayPrice: "",
        roomNumber: "",
        todayRoomNumber: "",
        roomArea: "",
        roomWifi: false,
        roomWindow: false,
        roomSmoke: false,
      },
      rules: {
        roomType: [
          { required: true, message: "请输入房间类型名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        price: [
          { required: true, message: "价格不能为空" },
          { type: "number", message: "价格必须为数字值" },
          { required: true, validator: valiNumberPass2, trigger: "change" },
        ],
        timeprice: [
          { type: "number", message: "价格必须为数字值" },
          { required: true, validator: valiNumberPass3, trigger: "change" },
        ],
        todayPrice: [
          { type: "number", message: "价格必须为数字值" },
          { required: true, validator: valiNumberPass2, trigger: "change" },
        ],
        roomNumber: [
          { required: true, message: "房间数量不能为空" },
          { type: "number", message: "房间数量必须为数字值" },
          { required: true, validator: valiNumberPass2, trigger: "change" },
        ],
        roomArea: [
          { required: true, message: "房间面积不能为空" },
          { type: "number", message: "房间面积必须为数字值" },
          { required: true, validator: valiNumberPass2, trigger: "change" },
        ],
      },
    };
  },
  methods: {
    //展示添加界面
    showDialog() {
      this.roomMessage.roomType = "";
      this.roomMessage.price = "";
      this.roomMessage.todayPrice = "";
      this.roomMessage.roomNumber = "";
      this.roomMessage.todayRoomNumber = "";
      this.roomMessage.roomArea = "";
      this.roomMessage.roomWifi = false;
      this.roomMessage.roomWindow = false;
      this.roomMessage.roomSmoke = false;
      this.dialogVisible = true;
    },
    //添加界面提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //此处调用存储房间接口，并且向表格添加数据
          this.dialogVisible = false;
          this.$message({
            type: "success",
            message: "提交成功!",
          });
          return true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置页面
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //添加页面关闭的时候
    dialogClose() {
      console.log("close");
    },
    //详细信息页面打开
    showRoomDialog(newindex) {
      this.index = newindex;
      this.roomMessage.roomType = this.tableData[this.index].roomType;
      this.roomMessage.price = this.tableData[this.index].price;
      this.roomMessage.todayPrice = this.tableData[this.index].todayPrice;
      this.roomMessage.roomNumber = this.tableData[this.index].roomNumber;
      this.roomMessage.todayRoomNumber =
        this.tableData[this.index].todayRoomNumber;
      this.roomMessage.roomArea = this.tableData[this.index].roomArea;
      this.roomMessage.roomWifi = this.tableData[this.index].roomWifi;
      this.roomMessage.roomWindow = this.tableData[this.index].roomWindow;
      this.roomMessage.roomSmoke = this.tableData[this.index].roomSmoke;
      this.roomDialogVisible = true;
    },
    //展示编辑界面
    showEditDialog() {
      this.editVisible = true;
    },
    //退出编辑
    closeEditDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //此处调用修改房型接口

          this.roomDialogVisible = false;
          this.editVisible = false;
          return true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //编辑提交的时候
    tijiao(formName) {
      console.log(this.roomMessage.todayPrice);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //此处调用修改房型接口
          this.editVisible = false;
          this.roomDialogVisible = false;
          this.$message({
            type: "success",
            message: "保存成功!",
          });
          return true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteRoomType(newindex) {
      this.index = newindex;
      console.log(this.tableData[newindex].roomType);
      this.tableData.splice(this.index, 1);
      //这里调用删除房型的接口
    },
  },
};
</script>