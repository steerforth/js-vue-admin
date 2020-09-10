<template>
  <div>
    <ad-recharge-detail :is-edit="true"></ad-recharge-detail>
  </div>
</template>

<script>
import AdRechargeDetail from './components/AdRechargeDetail'

export default {
  name: 'AdRechargeEdit',
  components: { AdRechargeDetail }
}
</script>

<style>
</style>