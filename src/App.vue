
<template>
  <DashboardHeader />
  <router-view />
</template>
<script>
import { mapState } from 'vuex'
import DashboardHeader from './components/DashboardHeader.vue'

export default {
  components: { DashboardHeader },
  created () {
    this.getShows()
  },
  methods: {
    getShows () {
      this.$store.dispatch('getShows')
    }
  },
  computed: {
    ...mapState(['loaded'])
  },
  watch: {
    loaded (_, prev) {
      if (!prev) this.$store.dispatch('setShows')
    }
  }
}
</script>
<style lang="scss">
#app {
  height: 100dvh;
  width: 100%;
  padding-top: 100px;
  background: $gradient-soft-spectrum;
  overflow: auto;
  // color: $color-text-light;
}
</style>
