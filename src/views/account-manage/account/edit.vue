<template>
  <div>
    <account-detail :is-edit="true"></account-detail>
  </div>
</template>

<script>
import AccountDetail from './components/AccountDetail.vue'

export default {
  name: 'AccountEdit',
  components: { AccountDetail }
}
</script>

<style>
</style>
