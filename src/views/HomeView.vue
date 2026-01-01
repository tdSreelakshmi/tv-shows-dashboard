<template>
  <div class="home" id="home" @scroll="onScroll">
    <ShowsByGenre v-if="selectedGenre" :genre="selectedGenre" :wrap="true" />

    <div v-else-if="getGenres.length">
      <div v-for="genre in getGenres" :key="genre">
        <ShowsByGenre :genre="genre" />
      </div>
    </div>
    <PageLoader v-else-if="!loaded" />
    <h2 v-else>Some Error Occured. Please try again later</h2>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import ShowsByGenre from "@/components/ShowsByGenre.vue";
import PageLoader from "@/components/loaders/PageLoader.vue";
export default {
  name: "HomeView",
  components: { ShowsByGenre, PageLoader },
  computed: {
    ...mapGetters(["getGenres"]),
    ...mapState(["selectedGenre", "loaded"])
  },
  created() {
    this.getShows();
  },
  data() {
    return {
      appElement: null,
      scrollThrottled: false
    };
  },
  mounted() {
    this.appElement = document.getElementById("app");
    if (this.appElement) this.appElement.addEventListener("scroll", this.onScroll);
  },
  beforeUnmount() {
    if (this.appElement) this.appElement.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    getShows() {
      try {
        this.$store.dispatch("getShows");
      } catch (error) {
        console.log(error);
      }
    },
    onScroll(event) {
      if (this.scrollThrottled) return;

      this.scrollThrottled = true;
      this.$store.commit("SET_SCROLL_POSTION", event.target.scrollTop);
      setTimeout(() => {
        this.scrollThrottled = false;
      }, 20);
    }
  },
  watch: {
    selectedGenre() {
      const appElement = document.getElementById("app");
      appElement.scrollTo(0, 0);
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  min-height: calc(100dvh - 80px);
  display: flex;
  flex-direction: column;
  padding: 0px 0px;
}
</style>
