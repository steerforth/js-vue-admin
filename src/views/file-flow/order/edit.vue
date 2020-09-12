<template>
  <div>
    <order-detail :is-edit="true"></order-detail>
  </div>
</template>

<script>
import OrderDetail from './components/OrderDetail'

export default {
  name: 'OrderEdit',
  components: { OrderDetail }
}
</script>

<style>
</style>