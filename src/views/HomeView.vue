<template>
  <div class="home">
    <DashboardHeader />
    <div v-for="genre in getGenres" :key="genre">
      <ShowsByGenre :genre="genre" />
    </div>
  </div>
</template>

<script>
import DashboardHeader from "@/components/DashboardHeader.vue";
import { mapGetters } from "vuex";
import ShowsByGenre from "@/components/ShowsByGenre.vue";
export default {
  name: "HomeView",
  components: { DashboardHeader, ShowsByGenre },
  computed: {
    ...mapGetters(["getGenres"]),
  },
  created() {
    this.getShows();
  },
  methods: {
    getShows() {
      this.$store.dispatch("getShows");
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 80px 5% 20px 5%;
}
</style>
