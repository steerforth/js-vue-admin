<template>
  <div>
    <overseas-storage-detail :is-edit="true"></overseas-storage-detail>
  </div>
</template>

<script>
import OverseasStorageDetail from './components/OverseasStorageDetail'

export default {
  name: 'OverseasStorageEdit',
  components: { OverseasStorageDetail }
}
</script>

<style>
</style>
