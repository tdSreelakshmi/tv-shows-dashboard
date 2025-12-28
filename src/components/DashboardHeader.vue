<template>
  <nav class="flex-row">
    <router-link to="/" :class="['flex-row', { search: isSearch }]"
      ><button
        class="next-button backward"
        v-if="!isHome && !isSearch"
        @click="$router.back()"
      >
        <img src="../assets/arrow-white.svg" alt="next" />
      </button>
      <h1>TV Shows</h1></router-link
    >

    <div class="flex-row">
      <button
        class="next-button backward"
        v-if="enableSearch && isSearch"
        @click="toggleSearch(false)"
      >
        <img src="../assets/arrow-white.svg" alt="next" />
      </button>
      <input
        v-if="enableSearch && isSearch"
        type="text"
        v-model.trim="searchTerm"
        id="search"
        placeholder="Search Show"
      />
      <button v-else class="next-button" @click="toggleSearch(true)">
        <img src="../assets/Search.svg" alt="" />
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
      searchTerm: "",
      searchTimeout: null,
    };
  },
  computed: {
    ...mapState(["enableSearch"]),
    isSearch() {
      return this.$route.name == "SearchShow";
    },
    isHome() {
      return this.$route.name == "home";
    },
  },
  methods: {
    toggleSearch(flag) {
      this.$store.commit("SET_SEARCH", flag);
      if (flag) {
        this.$router.push("/search");
        this.$nextTick(() => {
          const searchElement = document.getElementById("search");
          if (searchElement) searchElement.focus();
        });
      } else this.$router.back();
    },
    async getShowsByName() {
      try {
        await this.$store.dispatch("searchShow", this.searchTerm);
      } catch (error) {}
    },
  },
  watch: {
    enableSearch(val) {
      if (val && this.searchTerm) {
        this.searchTimeout = setTimeout(() => {
          this.getShowsByName();
        }, 500);
      }
    },
    searchTerm(val) {
      if (val) {
        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(() => {
          this.getShowsByName();
        }, 500);
      }
    },
  },
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
@media screen and (max-width: 768px) {
  a.search {
    display: none;
  }
}
</style>
