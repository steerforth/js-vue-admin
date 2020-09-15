<template>
  <div>
    <overseas-storage-detail :is-edit="false"></overseas-storage-detail>
  </div>
</template>

<script>
import OverseasStorageDetail from './components/OverseasStorageDetail'

export default {
  name: 'OverseasStorageAdd',
  components: { OverseasStorageDetail }
}
</script>

<style>
</style>
