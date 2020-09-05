<template>
  <div>
    <goods-detail :is-edit="true"></goods-detail>
  </div>
</template>

<script>
import GoodsDetail from './components/GoodsDetail'

export default {
  name: 'GoodsEdit',
  components: { GoodsDetail }
}
</script>

<style>
</style>
