<template>
  <div>
    <stock-plan-detail :type="'add'"></stock-plan-detail>
  </div>
</template>

<script>
import StockPlanDetail from './components/StockPlanDetail'

export default {
  name: 'StockPlanAdd',
  components: { StockPlanDetail }
}
</script>

<style>
</style>
