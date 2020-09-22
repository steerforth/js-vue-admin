<template>
  <div>
    <stock-plan-detail :type="'edit'"></stock-plan-detail>
  </div>
</template>

<script>
import StockPlanDetail from './components/StockPlanDetail'

export default {
  name: 'StockPlanEdit',
  components: { StockPlanDetail }
}
</script>

<style>
</style>
