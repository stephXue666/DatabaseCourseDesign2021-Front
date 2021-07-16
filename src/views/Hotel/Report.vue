<template>
  <el-container style="height: 700px">
    <el-header style="background-color: #2c3e50; color: white">
      <back-nav/>
    </el-header>
    <el-container >
      <el-aside width="200px" style="background-color: #545c64">
        <side-nav/>
      </el-aside>
      <el-main v-loading="loadingHotelData">
        <el-scrollbar>
        <el-card class="box-card">
          <el-tabs v-model="tabActiveName" @tab-click="tabClicked">
            <el-tab-pane 
            :key="item.tabName"
            v-for="item in tabData"
            :label="item.tabName"
            :name="item.tabName">
              <h3>
                {{ item.tabName }} 全年营业额共 {{ separateNum(Math.floor(item.turnover)) }} 元
              </h3>
              <el-card shadow="hover" :id="'calendarChart-'+item.tabName" style="width:100%; height:230px;"></el-card>
              <el-card shadow="hover" :id="'lineChart-'+item.tabName" style="width:100%; height:550px;"></el-card>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideNav from "../../components/SideNav";
import BackNav from "../../components/BackNav";

// 导入图包
import * as echarts from 'echarts/core';
import BaseUrl from "../../config";
import {
  CalendarComponent,
  VisualMapComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent
} from 'echarts/components';
import {
  LineChart,
  HeatmapChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';
import {ElMessage} from "element-plus";

echarts.use(
  [TitleComponent, TooltipComponent, CalendarComponent, VisualMapComponent, DataZoomComponent,
    HeatmapChart, CanvasRenderer, GridComponent, LineChart, LegendComponent]
); 

export default {

	components: {
    SideNav,
    BackNav,
	},

  computed: { // 用逗号分隔数字 (不知道为什么非要用闭包函数才能实现。。)
    separateNum: function(){
      return function(num){
        let str = num.toString();
        let counter = 0;
        let result = "";
        for(let j = str.length - 1; j >= 0; j--){
          counter++;
          result = str.charAt(j) + result;
          if (!(counter % 3) && j != 0){ 
            result = ',' + result;
          }
        }
      return result;
      }
    }
  },

  mounted(){
    this.hid = window.sessionStorage.getItem('uid');
    //this.hid = "100";
    // 调用接口- 流水信息
    this.axios.get(BaseUrl.ZHUNAR+"/api/turnover/id/" + this.hid).then(
      (response)=>{
        let date, dateYear, yearDataFound;
        console.log(response)
        if(response.data.length === 0){
          this.loadingHotelData = false
          ElMessage.warning("暂无流水数据！")
          return
        }
        this.rawData = response.data
        for(let oneData of this.rawData) // 得到每年的营业额，即初始化tabData
        {
          date = new Date(oneData.day_time);

          // 初始化tabData
          dateYear = date.getFullYear(); // 得到原始数据中的年份信息
          yearDataFound = this.tabData.find(item=>item.year===dateYear); // 在tabData中找此年份的信息
          if(yearDataFound==undefined){ // 没找到年份
            this.tabData.push({ // 加入此年份并添加流水金额
              year: dateYear,
              tabName: dateYear.toString(),
              turnover: oneData.earning
            });
          }
          else{
            yearDataFound.turnover += oneData.earning; // 找到年份则增加相应流水金额
          }
        }
        this.tabData.sort((x,y)=>{ // 按year降序排序，使时间最近的年份显示在前面
          return y.year - x.year;
        });

        this.tabActiveName = this.tabData[0].tabName;
        
        this.generateChartData(this.tabData[0].year);
        setTimeout(() => { 
          this.drawCalendarChart(this.tabData[0].year);
          this.drawLineChart(this.tabData[0].year);
        },50);

        this.loadingHotelData = false;
      });
  },

  data() {
    return {
      loadingHotelData: true,
      hid: 0,
      tabActiveName: "",
      rawData: [], // 假数据 {date, turnover, accRate}
      tabData: [], // 以年为单位的营业额统计数据 {year, tableName, turnover}
      chartData: [], // 某年以天为单位的入住率 {date, accRate}
    }
  },

  methods: {
    tabClicked(whitchClicked){
      let year = this.tabData[whitchClicked.index].year;
      let myChart = echarts.getInstanceByDom(document.getElementById('calendarChart-'+year.toString()))
      if (myChart == null) { // 如果不存在，就进行初始化
        this.generateChartData(year);
        setTimeout(() => { // 神坑！echart执行得太快导致css跟不上(计算width:100%)，需要延迟图表初始化才能正常显示
          this.drawCalendarChart(year);
          this.drawLineChart(year);
        },50)
      }
    },

    generateChartData(year){
      this.chartData = [];
      let oneDate, oneYear;
      for(let oneData of this.rawData){
        oneDate = new Date(oneData.day_time);
        oneYear = oneDate.getFullYear(); // 得到原始数据中的年份信息

        if(year == oneYear){
          this.chartData.push({ // 加入日历图数据
            date: oneDate,
            occRate: oneData.occupancy_rate,
            turnover: oneData.earning
          });
        }
      }
      this.chartData.sort((x,y)=>{ // 按year降序排序，使时间最近的年份显示在前面
        return x.date - y.date;
      });
    },

    drawCalendarChart(year){ // 日历图
      let myChart = echarts.init(document.getElementById('calendarChart-'+year.toString()));
      let option = {
        title: { // 图表标题
          top: "7%",
          left: 'center',
          text: '入住率日历图',
          textStyle:{
            fontStyle: 'oblique',
            fontWeight: 'normal',
            fontSize: 18
          }
        },
        tooltip: { // 鼠标悬停时显示信息
          formatter: function(params){
            let date = params.data[0];
            return '<div>入住率</div>' + '<div>' + params.marker + (date.getMonth()+1).toString() + '月' + date.getDate().toString() + '日:' + '<b>' + params.data[1] + '%' + '</b></div>'
          }
        },
        visualMap: { // 数值对应颜色
          min: 0,
          max: 1,
          type: 'piecewise',
          pieces: [{
            gt: 0,
            lte: 20,
            label: '0%~20%',
          },{
            gt: 20,
            lte: 40,
            label: '20%~40%',
          },{
            gt: 40,
            lte: 60,
            label: '40%~60%',
          },{
            gt: 60,
            lte: 80,
            label: '60%~80%',
          },{
            gt: 80,
            lte: 100,
            label: '80%~100%',
          }],
          orient: 'horizontal',
          left: 'center',
          top: "22%"
        },
        calendar: { // 日历坐标系
          top: "44%",
          left: "8%",
          right: "8%",
          cellSize: ['auto', 13],
          range: year,
          itemStyle: {
            borderWidth: 0.5
          },
          yearLabel: {show: true}
        },
        series: { // 热力图
          name: '入住率',
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: this.chartData.map((item)=>{return [item.date, (item.occRate*100).toFixed(2)]})
        }
      };
      myChart.setOption(option,true); 
    },

    drawLineChart(year){ // 折线图;
      let myChart = echarts.init(document.getElementById('lineChart-'+year.toString()));
      
      let option = {
        grid:{ // 图表位置
          top:"22%",
          bottom: "16%",
          left: "9%",
          right: "9%"
        },
        title: { // 图表标题
          top: "6%",
          left: 'center',
          text: '营业额与入住率折线图',
          textStyle:{
            fontStyle: 'oblique',
            fontWeight: 'normal',
            fontSize: 18
          }
        },
        tooltip: { // 鼠标悬停时显示信息
          trigger: 'axis',
          formatter: function(params){
            let dateParams = params[0].name.split('/')
            let relVal = '<div>' + dateParams[0] + "月" + dateParams[1] + "日" + '</div>';
            relVal += '<div style="text-align:left">' + params[0].marker + params[0].seriesName + ":<b>" + params[0].value + '</b>元</div>';
            relVal += '<div style="text-align:left">' + params[1].marker + params[1].seriesName + ":<b>" + params[1].value + '</b>%</div>';
            return relVal;
          }
        },
        xAxis: { // x轴
          type: 'category',
          data: this.chartData.map((item)=>{
            return (item.date.getMonth()+1) + '/' + item.date.getDate()
          })
        },
        yAxis:[ // y轴(两个)
          {
            name: '营业额(元)',
            type: 'value',
          },
          {
            name: '入住率(%)',
            type: 'value',
            max: 100
          }
        ],
        legend: { // 图例
          data: ['营业额', '入住率'],
          right: "6%",
          top: "8%"
        },
        dataZoom: { // 滑轨
          type: 'slider',
          show: true,
          realTime: true,
          start: 0,
          end: 100,
          xAxisIndex: [0],
          bottom: "5%"
        },
        series:[ // 折线(两个)
          {
            name: '营业额',
            type: 'line',
            lineStyle: { width:1 },
            showSymbol: false,
            data: this.chartData.map((item)=>{return Math.floor(item.turnover)})
          },
          {
            yAxisIndex: 1,
            name: '入住率',
            type: 'line',
            lineStyle: { width:1 },
            showSymbol: false,
            data: this.chartData.map((item)=>{return (item.occRate*100).toFixed(2)})
          }
        ]
      }; 

      myChart.setOption(option);
    }
  }
}
</script>
