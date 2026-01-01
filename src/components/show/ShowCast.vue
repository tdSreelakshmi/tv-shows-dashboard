<template>
  <div v-if="casts.length > 0" class="cast-wrapper">
    <h2>Cast</h2>

    <div class="cast-container">
      <button v-for="cast in casts" :key="cast.person.id" @click="selectPerson(cast.person.id)">
        <img
          class="cast-img"
          :src="cast?.character.image?.medium ?? cast?.person.image?.medium"
          alt="cast"
        />

        <p class="cast-text">
          {{ cast?.person.name }} <span>as {{ cast?.character.name }}</span>
        </p>
      </button>
    </div>
    <ShowsByPerson
      v-if="selectedPerson"
      :id="selectedPerson"
      :show-id="id"
      @close="selectedPerson = null"
    />
  </div>
</template>

<script>
import ShowsByPerson from "./ShowsByPerson.vue";

export default {
  name: "ShowCast",
  props: { id: String },
  components: { ShowsByPerson },
  data() {
    return {
      casts: [],
      selectedPerson: null
    };
  },
  created() {
    this.getShowCast();
  },
  methods: {
    selectPerson(id) {
      this.selectedPerson = id;
    },
    async getShowCast() {
      try {
        this.casts = await this.$store.dispatch("getShowCast", this.id);
      } catch (error) {}
    }
  }
};
</script>

<style lang="scss" scoped>
.cast-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.cast-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  button {
    display: flex;
    flex-direction: row;
    font-size: x-small;
    margin: 4px;
    gap: 4px;
    align-items: center;
    background: $color-yellow-alpha;
    border-radius: 10px;
    box-shadow: 0px 2px 2px 0px gray;
    transition: all 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95);
    padding: 0px;
    outline: none;
    border: none;
    cursor: pointer;
    &:hover {
      scale: 1.3;
      background: $color-yellow;
    }
  }
}
.cast-text {
  display: flex;
  flex-direction: column;
  font-size: x-small;
  width: 80px;
  align-items: center;
  text-align: center;
  span {
    font-style: italic;
  }
}

.cast-img {
  height: 60px;
  border-radius: 10px;
}
@media screen and (max-width: 769px) {
  .cast-wrapper {
    align-items: center;
  }
  .cast-container {
    justify-content: space-evenly;
  }
}
</style>
