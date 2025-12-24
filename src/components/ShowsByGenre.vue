<template>
  <div>
    <h2>{{ genre }}</h2>
    <!-- {{ $store.state.showsByGenre[genre] }} -->
    <div class="shows-wrapper">
      <ShowCard v-for="showId in shows" :key="showId" :id="showId" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ShowCard from "./ShowCard.vue";
export default {
  components: { ShowCard },
  name: "ShowsByGenre",
  props: {
    genre: String,
  },
  data() {
    return {
      shows: null,
    };
  },
  computed: {
    ...mapGetters(["getShowsByGenre"]),
  },
  mounted() {
    this.shows = this.getShowsByGenre(this.genre);
  },
};
</script>

<style lang="scss" scoped>
.shows-wrapper {
  display: flex;
  flex-direction: row;
  gap: 20px;
  overflow: auto;
  padding: 0px 20px;
  margin: 4px 0px;
  scrollbar-width: none; /* For Firefox */
  -ms-overflow-style: none;
}
</style>