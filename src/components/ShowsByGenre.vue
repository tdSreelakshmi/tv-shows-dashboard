<template>
  <div>
    <div class="flex-row">
      <div class="flex-row wrapper">
        <h2>{{ genre }}</h2>
        <button class="next-button" v-if="!selectedGenre" @click="selectGenre(genre)">
          <img src="../assets/arrow.svg" alt="next" />
        </button>
      </div>
    </div>
    <!-- {{ $store.state.showsByGenre[genre] }} -->

    <div :class="['shows-wrapper', wrap ? 'wrap' : 'no-wrap', { center: selectedGenre }]">
      <ShowCard v-for="showId in shows" :key="showId" :id="showId" :genre="genre" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ShowCard from './ShowCard.vue'
export default {
  components: { ShowCard },
  name: 'ShowsByGenre',
  props: {
    genre: String,
    wrap: Boolean
  },
  data() {
    return {
      showAll: false
    }
  },
  computed: {
    ...mapState(['showsByGenre', 'selectedGenre']),

    shows() {
      return this.selectedGenre && this.showAll
        ? this.showsByGenre[this.genre]
        : [...this.showsByGenre[this.genre].slice(0, 10)]
    }
  },
  mounted() {
    setTimeout(() => {
      this.showAll = true
    }, 10)
  },
  methods: {
    selectGenre(genre) {
      this.$store.commit('SELECT_GENRE', genre)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin-left: 20px;
}
.center {
  justify-content: center;
}
</style>
