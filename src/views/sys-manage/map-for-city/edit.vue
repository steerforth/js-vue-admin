<template>
  <div>
    <map-for-city-detail :is-edit="true"></map-for-city-detail>
  </div>
</template>

<script>
import MapForCityDetail from './components/MapForCityDetail'

export default {
  name: 'MFCEdit',
  components: { MapForCityDetail },
  created() {
    alert('2222')
  }
}
</script>

<style>
</style>
