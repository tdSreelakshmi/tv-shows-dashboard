<template>
  <div class="home" id="home" @scroll="onScroll">
    <ShowsByGenre v-if="selectedGenre" :genre="selectedGenre" :wrap="true" />

    <div v-else>
      <div v-for="genre in getGenres" :key="genre">
        <ShowsByGenre :genre="genre" />
      </div>
    </div>
  </div>
</template>

<script>
import DashboardHeader from '@/components/DashboardHeader.vue'
import { mapGetters, mapState } from 'vuex'

import ShowsByGenre from '@/components/ShowsByGenre.vue'
export default {
  name: 'HomeView',
  components: { DashboardHeader, ShowsByGenre },
  computed: {
    ...mapGetters(['getGenres']),
    ...mapState(['selectedGenre'])
  },
  mounted () {
    console.log('mounted')
    const appElement = document.getElementById('app')
    appElement.addEventListener('scroll', this.onScroll, { passive: true })
  },
  beforeUnmount () {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll (event) {
      this.$store.commit('SET_SCROLL_POSTION', event.target.scrollTop)
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 0px 0px;
}
</style>
