<template>
  <div>
    <div class="shows-wrapper wrap">
      <ShowCard
        v-for="showInfo in searchResults"
        :key="showInfo.show.id"
        :show="showInfo.show"
      />
    </div>
  </div>
</template>

<script>
import ShowCard from '@/components/ShowCard.vue'
import { mapState } from 'vuex'

mapState
export default {
  components: { ShowCard },
  name: 'SearchShow',
  computed: {
    ...mapState(['searchResults'])
  }
}
</script>

<style>
</style>
