<template>
  <PageLoader v-if="loading" />
  <div v-else-if="person">
    <div class="backdrop" @click="close"></div>
    <div class="person-info-wrapper flex-col">
      <button class="close-button" @click="close" aria-label="Close dialog">
        <img src="@/assets/close.svg" alt="close" />
      </button>
      <div class="person-info">
        <img
          v-if="person?.image?.['medium']"
          :src="person?.image['medium']"
          :alt="person?.name + '-img'"
        />
        <div class="flex-col">
          <h3>
            {{ person?.name }}
          </h3>
          <p>
            {{ person?.country?.name }}
          </p>
        </div>
      </div>

      <div class="character-wrapper">
        <button
          class="character"
          v-for="(credit, idx) in person._embedded.castcredits"
          :key="idx"
          @click="getShowDetails(credit._links.show.href)"
        >
          <img
            v-if="credit.image"
            :src="credit.image"
            :alt="credit._links.character.name + '-img'"
          />
          <div class="character-info">
            <p>{{ credit._links.character.name }}</p>
            <p>{{ credit._links.show.name }}</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PageLoader from "../loaders/PageLoader.vue";
export default {
  components: { PageLoader },
  props: {
    id: Number,
    showId: String
  },
  data() {
    return {
      person: null,
      loading: true
    };
  },
  created() {
    this.getCastCredits();
  },
  methods: {
    close() {
      this.$emit("close");
    },
    getShowDetails(showHref) {
      if (!showHref) return;

      const showId = showHref.split("/")[4];
      if (showId === this.showId) {
        this.close();
        return;
      }
      this.$router.push(`/show/${showId}`);
    },
    async getCastCredits() {
      try {
        this.person = await this.$store.dispatch("getCastCredits", this.id);
        this.getCharacters();
        this.loading = false;
      } catch (error) {}
    },
    async getCharacters() {
      if (!this.person) return;
      const castcredits = this.person._embedded.castcredits;
      for (let index = 0; index < castcredits.length; index++) {
        const element = castcredits[index]._links.character.href;
        const characterId = element.split("/")[4];
        try {
          const image = await this.$store.dispatch("getCastInfo", characterId);
          if (image) {
            this.person._embedded.castcredits[index].image = image;
          }
        } catch (error) {}
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h3 {
  margin: 8px;
}
.close-button {
  height: 40px;
  width: 40px;
  padding: 8px;
  display: flex;
  align-items: center;
  outline: none;
  background: black;
  border-radius: 50%;
  border: none;
  justify-content: center;
  place-self: flex-end;
  margin: 4px;
  & img {
    height: 30px;
  }
}
.backdrop {
  position: fixed;
  inset: 0;
  background: #1e1e1eb0;
  z-index: 10;
}
.person-info-wrapper {
  position: fixed;
  background: white;
  max-height: 90vh;
  height: fit-content;
  width: 90vw;
  max-width: 400px;
  inset: 0;
  margin: auto;
  border-radius: 20px;
  overflow: auto;
  z-index: 20;
}
.person-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  justify-content: center;
  background: white;
  border-radius: 10px;
  margin-bottom: -80px;
  z-index: 1;

  & img {
    width: 200px;
    height: auto;
  }
}
img {
  height: 50px;
  border-radius: 10px 10px 0px 0px;
}
.character {
  display: flex;
  flex-direction: row;
  width: 200px;
  justify-content: flex-start;
  align-items: center;
  width: 95%;
  border-bottom: 1px solid #1e1e1e;
  border-top: none;
  border-left: none;
  border-right: none;
  padding: 8px;
  overflow: clip;
  background: transparent;
  color: white;
  outline: none;
  cursor: pointer;
  &:hover {
    background: #8080804a;
  }
}
.character-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 8px;
  flex: 1;
  place-items: center;
}
.character-wrapper {
  width: 100%;
  background: black;
  padding-top: 80px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
}
</style>
