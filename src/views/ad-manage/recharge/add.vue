<template>
  <div>
    <ad-recharge-detail :is-edit="false"></ad-recharge-detail>
  </div>
</template>

<script>
import AdRechargeDetail from './components/AdRechargeDetail'

export default {
  name: 'AdRechargeAdd',
  components: { AdRechargeDetail }
}
</script>

<style>
</style>
