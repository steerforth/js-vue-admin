<template>
  <div>
    <goods-sku-detail :is-edit="true"></goods-sku-detail>
  </div>
</template>

<script>
import GoodsSkuDetail from './components/GoodsSkuDetail'

export default {
  name: 'GoodsSkuEdit',
  components: { GoodsSkuDetail }
}
</script>

<style>
</style>
