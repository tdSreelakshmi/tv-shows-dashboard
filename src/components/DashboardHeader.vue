<template>
  <nav class="flex-row">
    <div class="flex-row">
      <button class="next-button backward" v-if="enableBackButton" @click="back()">
        <img src="../assets/arrow-white.svg" alt="next" />
      </button>
      <router-link to="/" :class="{ search: isSearch }"><h1>Show Glance</h1></router-link>
    </div>
    <div :class="['search-wrapper', { search: isSearch }]">
      <input
        v-if="isSearch"
        type="text"
        v-model.trim="searchTerm"
        id="search"
        placeholder="Search Show"
      />
      <button
        v-if="isSearch"
        class="next-button"
        @click="searchTerm = ''"
        aria-label="clear search"
      >
        <img src="@/assets/close.svg" alt="close" />
      </button>
      <button v-else class="next-button" @click="toggleSearch(true)">
        <img src="../assets/Search.svg" alt="search" />
      </button>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DashBoardHeader",
  data() {
    return {
      searchTerm: ""
    };
  },
  computed: {
    ...mapState(["selectedGenre"]),
    isSearch() {
      return this.$route.name === "SearchShow";
    },
    isHome() {
      return this.$route.name === "home";
    },
    enableBackButton() {
      return (this.isHome && this.selectedGenre) || !this.isHome;
    }
  },
  methods: {
    back() {
      if (this.isHome) this.$store.commit("SELECT_GENRE", null);
      else this.$router.back();
    },
    toggleSearch(flag) {
      if (flag) {
        this.$router.push("/search");
      } else this.$router.back();
    }
  },
  watch: {
    searchTerm() {
      this.$store.commit("SET_SEARCH_TERM", this.searchTerm.trim());
    },
    isSearch(val) {
      if (val)
        this.$nextTick(() => {
          const searchElement = document.getElementById("search");
          if (searchElement) searchElement.focus();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
nav {
  position: fixed;
  min-height: 60px;
  height: fit-content;
  background: transparent;
  z-index: 10;
  padding: 4px 5%;
  justify-content: space-between;
  top: 16px;
  background: black;
  margin: auto;
  width: 90%;
  border-radius: 32px;
  right: 0;
  left: 0;
  box-shadow: 0px 4px 4px $gradient-spectrum;
  //   color: white;
}
h1 {
  background: $gradient-spectrum;
  color: transparent;
  background-clip: text;
}
.search-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
@media screen and (max-width: 767px) {
  .search.search-wrapper {
    flex: 1;
  }
  a.search {
    display: none;
  }
}
</style>
