<template>
  <div>
    <stock-plan-detail :type="'see'"></stock-plan-detail>
  </div>
</template>

<script>
import StockPlanDetail from './components/StockPlanDetail'

export default {
  name: 'StockPlanSee',
  components: { StockPlanDetail }
}
</script>

<style>
</style>
