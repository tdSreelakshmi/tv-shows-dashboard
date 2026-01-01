<template>
  <div class="search-wrapper">
    <PageLoader v-if="loading" />
    <div v-else-if="searchResults && searchResults.length > 0" class="shows-wrapper wrap">
      <ShowCard v-for="showInfo in searchResults" :key="showInfo.show.id" :show="showInfo.show" />
    </div>
    <p class="message" v-else>{{ message }}</p>
  </div>
</template>

<script>
import ShowCard from "@/components/ShowCard.vue";
import { mapState } from "vuex";
import PageLoader from "@/components/loaders/PageLoader.vue";

export default {
  components: { ShowCard, PageLoader },
  name: "SearchShow",
  computed: {
    ...mapState(["searchTerm"])
  },
  data() {
    return {
      searchTimeout: null,
      searchResults: null,
      message: "Search for shows",
      loading: false
    };
  },

  mounted() {
    if (this.searchTerm) this.getShowsByName();
  },
  methods: {
    async getShowsByName() {
      try {
        this.loading = true;
        this.searchResults = await this.$store.dispatch("searchShow", this.searchTerm);
        if (this.searchResults.length === 0) this.message = "No results found";
      } catch (error) {
        this.searchResults = null;
        this.message = "Some error occured. Please try again later";
      } finally {
        this.loading = false;
      }
    }
  },
  watch: {
    searchTerm(val) {
      clearTimeout(this.searchTimeout);
      if (val) {
        this.searchTimeout = setTimeout(() => {
          this.getShowsByName();
        }, 500);
      } else {
        this.searchResults = null;
      }
    }
  }
};
</script>

<style scoped>
.message {
  width: 90%;
  font-size: x-large;
  text-align: center;
  padding-top: 200px;
  color: #1e1e1e;
}
.search-wrapper {
  height: auto;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
@media screen and (max-width: 767px) {
  .shows-wrapper {
    justify-content: center;
  }
}
</style>
