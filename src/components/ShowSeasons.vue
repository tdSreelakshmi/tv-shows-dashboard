<template>
  <div class="seasons" v-if="seasons">
    <h2>Seasons & Episodes</h2>
    <div class="seasons_list">
      <button
        v-for="season in seasons"
        :key="season.id"
        @click="selectSeason(season.id)"
      >
        Season {{ season.number }}
      </button>
    </div>
    <div class="season-wrapper" v-if="selectedSeason">
      <h3>
        Season {{ seasons[selectedSeason].number }} -
        {{ seasons[selectedSeason].premiereDate.split("-")[0] }}
      </h3>

      <p v-html="seasons[selectedSeason].summary"></p>

      <div class="episode-wrapper" v-if="episodes">
        <div class="season-item" v-for="episode in episodes" :key="episode.id">
          <img v-if="episode.image.medium" :src="episode.image.medium" alt="" />

          <div>
            <h3>Episode: {{ episode.number }}</h3>

            <h4>{{ episode.name }}</h4>
            <p v-html="episode.summary"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowSeasons",
  props: { id: Number },
  data() {
    return {
      seasons: null,
      episodes: null,
      selectedSeason: null,
    };
  },
  created() {
    this.getShowSeasons();
  },
  methods: {
    selectSeason(id) {
      this.selectedSeason = this.selectedSeason == id ? null : id;
      if (!this.selectedSeason) this.episodes = null;
    },
    async getEpisodes() {
      try {
        this.episodes = await this.$store.dispatch(
          "getShowEpisodesBySeason",
          this.selectedSeason
        );
        console.log(this.episodes);
      } catch (error) {}
    },
    async getShowSeasons() {
      try {
        this.seasons = await this.$store.dispatch("getShowSeasons", this.id);
      } catch (error) {}
    },
  },
  watch: {
    selectedSeason(val) {
      if (val) this.getEpisodes();
      else this.episodes = null;
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  padding: 8px 24px;
  border-radius: 16px;
  border: none;
  font-size: 16px;
  background: $color-apricot;
}

h3,
h4 {
  margin: 4px 0px;
}
.seasons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 16px 0px;
  width: 100%;
  h2 {
    margin: 8px 0px;
  }
}
.seasons_list {
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.season-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(254, 202, 126, 0.36);
  padding: 8px;
  margin: 16px 0px;
  border-radius: 10px;
  box-shadow: 0px 1px 4px #827e7e;
  h3 {
    background: black;
    width: 100%;
    padding: 8px;
    color: white;
    text-align: center;
    border-radius: 6px;
  }
}
.episode-wrapper {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding: 8px;
  margin: 16px 0px;
  border-radius: 10px;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
.season-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 240px;
  padding: 8px;
  margin: 8px 0px;
  background: rgba(254, 202, 126, 0.36);
  box-shadow: 0px 2px 4px #feca7e;
  border-radius: 8px;

  & img {
    height: auto;

    max-height: 100px;
    border-radius: 8px;
  }
}
@media screen and (max-width: 768px) {
  .seasons {
    align-items: center;
  }
  .seasons_list {
    justify-content: center;
  }
}
</style>