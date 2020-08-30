<template>
   <div :class="className" :style="{height:height,width:width}"/>
   <!-- :dataColor="dataColor" :legends="legends" :xData="xData" :yData="yData" :xColor="xColor" -->
</template>

<script>
  // 按需加载echarts
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/title'

  export default {
    props: {
      className: {
        type: String,
        default: ''
      },
      width: {
        type: String,
        default: '200px'
      },
      height: {
        type: String,
        default: '200px'
      },
      //折线数据颜色
      dataColor:{
        type: Array,
        default: []
      },
      //图表说明
      legends:{
        type: Array,
        default: []
      },
      //eg.[[],[]]
      xData:{
        //验证TODO
        type: Array,
        default: []
      },
      //eg.[[],[],[],[]]
      yData:{
        type: Array,
        default: []
      },
      //x轴颜色,先底部轴,再顶部轴
      xColor:{
        typeL: Array,
        default(){
          return ['#C71585','#87CEFA']
        }
      }
    },
    data() {
      return {
        chart: null
      }
    },
    computed:{
      xAxisData(){
        var data = [];
        for(var i = 0;i < this.xData.length;i++){
          var obj = {
        	        type: 'category',
        	        axisTick: {
        	            alignWithLabel: true
        	        },
        	        axisLine: {
        	            onZero: false,
        	            lineStyle: {
        	                color: this.xColor[i]
        	            }
        	        },
        	        axisPointer: {
        	            label: {
        	                formatter: function (params) {
                            if(params.seriesData.length > 0){
                              var content = '';
                              for(i=0;i<params.seriesData.length;i++){
                                content +='['+params.seriesData[i].seriesName+']'+params.value+': ['+params.seriesData[i].data+']';
                                if(i<params.seriesData.length-1){
                                  content+='\n';
                                }
                              }
                              return content;
                            }
                            return params.value;
        	                }
        	            }
        	        },
        	        data: this.xData[i]
        	    };
            data.push(obj);

        }
        return data;
      },
      seriesData(){
        var data = [];
        for(var i = 0;i < this.yData.length;i++){
          var obj = {
        			name: this.legends[i],
        			type: 'line',
              xAxisIndex: i < this.legends.length/2 ? 0: 1,//前半段数据都是x轴buttom,其余x轴top
        			smooth: false,
        			itemStyle: {
        				 normal: {
        				   lineStyle: {
        					   color: this.dataColor[i]//折线的颜色
        				   }
        				}
        			 },
        			data: this.yData[i]
        	}
          data.push(obj);
        }
        return data;
      }
    },
    watch: {
      'yData':{
        handler(val){
          console.log('watch ydata')
          if(val == ''){
            return
          }
          this.setOptions()
        },
        immediate: true,
        // deep: true
      }
    },
    mounted() {
      console.log('start init chart')
      this.initChart()
      console.log('end init chart')
    },
    beforeDestroy() {
      console.log('before chart destroy')
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
      console.log('chart destroyed')
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el)
        // this.chart = echarts.init(document.getElementById(this.id))
        // console.log('chart init:'+this.chart)
        this.setOptions();
      },
      setOptions(){
        console.log('do set option')
        if(!this.chart || this.xAxisData.length == 0 || this.seriesData.length == 0){
          return;
        }
        // console.log('chart set option:'+this.dataColor+' legends:'+this.legends+' xAxixData'+this.xAxisData+' yData:'+this.yData)
        this.chart.setOption({
        	// 指定图表的配置项和数据 红，蓝
        	color: this.dataColor,
        	tooltip: {
        	    trigger: 'none',
        	    axisPointer: {
        	        type: 'cross'
        	    }
        	},
        	legend: {
        	    data: this.legends
        	},
        	grid: {
        	    top: 70,
        	    bottom: 50,
        	},
          //按顺序从下而上
        	xAxis: this.xAxisData,
        	yAxis: [
        	    {
        	        type: 'value'
        	    }
        	],
        	series: this.seriesData
        })
      }
    }
  }
</script>

<style>

</style>
