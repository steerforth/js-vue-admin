<template>
   <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  // 按需加载echarts
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/pie'
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
      //图表说明
      legends:{
        type: Array,
        default: []
      },
      chartData:{
        type: Array,
        default: []
      }
    },
    data() {
      return {
        chart: null
      }
    },
    computed:{
      selectableData(){
        var obj = {};
        for(var i =0 ;i< this.legends.length;i++){
          obj[this.legends[i]] = 1;
        }
        return obj;
      },
      seriesData(){
        var data = [];
        for(var i =0 ;i< this.chartData.length;i++){
          var obj = {}
          obj.name = this.legends[i]
          obj.value = this.chartData.length > i? this.chartData[i]:0
          data.push(obj)
        }
        return data;
      }
    },
    watch: {
      'chartData':{
        handler(val){
          console.log('watch chartData')
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
      this.initChart()
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el)
        this.setOptions();
      },
      setOptions(){
        if(!this.chart || this.chartData.length == 0){
          return;
        }
        this.chart.setOption({
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b}: {c} ({d}%)'
					},
					legend: {
							// type: 'scroll',
							orient: 'vertical',
							left: 10,
							top: 20,
							bottom: 20,
							data: this.legends,
							selected: this.selectableData
					 },
					series: [
						{
							name: '类别',
							type: 'pie',
							radius: '55%',
							center: ['40%', '50%'],
							emphasis: {
								itemStyle: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},
							data:this.seriesData,
						}
					]
				})
      }
    }
  }
</script>

<style>

</style>
