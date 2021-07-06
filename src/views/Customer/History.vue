<template>
  <el-container>
    <el-header style="padding: 0">
      <TopNav/>
    </el-header>
    <el-main>
      <!--这里写代码-->
    <i 
    style="font-size: 25px;margin-bottom: 10px;margin-top: 10px;font-weight: bold"
    class='el-icon-time'>
    浏览记录
    </i>
    <el-table
    :data="tableData"
    style="width = 100%"
    max-height="500"
    highlight-current-row
    @cell-click="handleJumpToHotelPage"
    @current-change="handleCurrentChange"
    >
    <el-table-column
      fixed
      prop="time"
      label="浏览时间"
      width="200">
    </el-table-column>
    <el-table-column
      prop="hotelName"
      label="酒店名"
      width="200">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      min-width="200">
    </el-table-column>
    <el-table-column
      prop="star"
      label="星级"
      width="200"
      align="center">
      <template #default="scope">
        <span style="margin-left: 10px">{{ scope.row.star }}</span>
        <i class="el-icon-star-on"></i>
      </template>
    </el-table-column>
    <el-table-column
      prop="score"
      label="评分"
      width="200"
      align="center">
      <template #default="scope">
      <el-rate v-model="scope.row.score" 
      disabled
      show-score
      text-color="#ff9900"
      score-template="{ value }分"></el-rate>
      </template>
    </el-table-column>
    <el-table-column
      prop="lowestPrice"
      label="最低价/天"
      width="200"
      align="center">
    </el-table-column>
    <!--未加入“评论数”属性-->
    <!--"删除"操作-->
    <el-table-column
      prop="operation"
      fixed="right"
      label="操作"
      width="200"
      align="center">
      <template #default="scope">
        <el-button
          @click.prevent="deleteRow(scope.$index,tableData)" 
          icon="el-icon-delete"
          type="text"
          size="small">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script>
import TopNav from "../../components/TopNav";

let historyList=[{
          time: '2016-05-03 15:20:19',
          hotelName: '同济招待中心',
          star: '4',
          address: '上海市普陀区金沙江路 1512 弄',
          score: 4.1,
          lowestPrice:400
        },
        {
          time: '2016-05-03 15:20:20',
          hotelName: '同济招待中心',
          star: '3',
          address: '上海市普陀区金沙江路 1513 弄',
          score: 4.2,
          lowestPrice:100
        },
        {
          time: '2016-05-03 15:20:21',
          hotelName: '同济招待中心',
          star: '2',
          address: '上海市普陀区金沙江路 1514 弄',
          score: 4.3,
          lowestPrice:500
        },
        {
          time: '2016-05-03 15:20:22',
          hotelName: '同济招待中心',
          star: '4',
          address: '上海市普陀区金沙江路 1516 弄',
          score: 4.4,
          lowestPrice:590
        },
        {
          time: '2016-05-03 15:20:23',
          hotelName: '同济招待中心',
          star: '5',
          address: '上海市普陀区金沙江路 1517 弄',
          score: 4.5,
          lowestPrice:510
        },
        {
          time: '2016-05-03 15:20:29',
          hotelName: '同济招待中心',
          star: '1',
          address: '上海市普陀区金沙江路 1517 弄',
          score: 4.9,
          lowestPrice:324
        },
        {
          time: '2016-05-03 15:29:23',
          hotelName: '同济招待中心',
          star: '5',
          address: '上海市普陀区金沙江路 1517 弄',
          score: 3.1,
          lowestPrice:498
        },
        {
          time: '2016-05-03 15:30:23',
          hotelName: '同济招待中心',
          star: '5',
          address: '上海市普陀区金沙江路 1517 弄',
          score: 4.5,
          lowestPrice:465
        },
        {
          time: '2016-05-03 15:40:23',
          hotelName: '同济招待中心',
          star: '5',
          address: '上海市普陀区金沙江路 1517 弄',
          score: 3.5,
          lowestPrice:455}]

export default {
	components: {
    TopNav,
	},
   methods: {
     //"删除"操作
      deleteRow(index, rows){
        this.$confirm('是否删除该条记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           rows.splice(index, 1);
          //调用接口-删除历史足迹：传入（用户ID、酒店ID、时间）返回（null）
          console.log(rows);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {});
      },

      //单击选中时，"点亮"当前行
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },

      //单击除"操作"以外列的单元格，"跳转"到对应"酒店详情"页面
      handleJumpToHotelPage(row, column, cell, event){
        //"跳转"，用"酒店1"的详情页面测试
        if(column.property !== "operation"){
          this.$router.push({
          path: '/details',
          query: { id: 1 }
        });
          console.log(row, event, column);
        }
      },
   },

    data() {
      return {
        tableData: []
      }
    },

    created(){
      //调用接口-列表显示酒店历史足迹：传入（用户ID）返回（酒店简要信息+时间）
      //将变量historyList赋值给tableData
      for(let item of historyList){
        this.tableData.push(item);
    }
    },
 }
</script>