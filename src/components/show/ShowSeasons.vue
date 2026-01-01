<template>
  <div class="seasons" v-if="seasons">
    <h2>Seasons & Episodes</h2>
    <div class="seasons_list">
      <button v-for="season in seasons" :key="season.id" @click="selectSeason(season.id)">
        Season {{ season.number }}
      </button>
    </div>
    <div class="season-wrapper" v-if="selectedSeason && episodes">
      <h3>
        Season {{ seasons[selectedSeason].number }} -
        {{ seasons[selectedSeason].premiereDate.split("-")[0] }}
      </h3>

      <p v-html="seasons[selectedSeason].summary"></p>

      <div class="episode-wrapper" v-if="episodes">
        <div class="episode-item" v-for="episode in episodes" :key="episode.id">
          <img
            v-if="episode.image?.medium"
            :src="episode.image.medium"
            :alt="episode.name + '-img'"
          />

          <div>
            <h4>{{ episode.name }}</h4>

            <p v-html="episode.summary"></p>
          </div>
        </div>
      </div>
    </div>
    <p v-else-if="!episodes && loaded">Couldn't load episode information</p>
  </div>
</template>

<script>
export default {
  name: "ShowSeasons",
  props: { id: String },
  data() {
    return {
      seasons: null,
      episodes: null,
      selectedSeason: null,
      loaded: false
    };
  },
  created() {
    this.getShowSeasons();
  },
  methods: {
    selectSeason(id) {
      this.selectedSeason = this.selectedSeason === id ? null : id;
      if (!this.selectedSeason) this.episodes = null;
    },
    async getEpisodes() {
      try {
        this.episodes = await this.$store.dispatch("getShowEpisodesBySeason", this.selectedSeason);
      } catch (error) {
        this.episodes = null;
      } finally {
        this.loaded = true;
      }
    },
    async getShowSeasons() {
      try {
        this.seasons = await this.$store.dispatch("getShowSeasons", this.id);
      } catch (error) {}
    }
  },
  watch: {
    selectedSeason(val) {
      if (val) this.getEpisodes();
      else this.episodes = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.episode-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
  background: black;
  border-radius: 10px 10px 0px 0px;
  min-height: 180px;
}
h4 {
  width: 100%;
  padding: 8px;
  text-align: center;
}
button {
  padding: 8px 24px;
  border-radius: 16px;
  border: none;
  font-size: 16px;
  background: $color-apricot;
}

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
}
.episode-wrapper {
  display: flex;
  flex-direction: column;
  padding: 8px;
  margin: 16px 0px;
  border-radius: 10px;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
.episode-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  width: 100%;
  margin: 8px 0px;
  background: rgba(254, 202, 126, 0.36);
  box-shadow: 0px 2px 4px #feca7e;
  border-radius: 8px;
}
img {
  height: 120px;
  width: auto;
  border-radius: 8px;
}
p {
  margin: 8px 0px;
}
@media screen and (max-width: 768px) {
  .seasons {
    align-items: center;
  }
  .seasons_list {
    justify-content: center;
  }
  .episode-wrapper {
    align-items: center;
  }
}
@media screen and (max-width: 620px) {
  .episode-item {
    width: 100%;
    flex-direction: column;
    padding: 8px 0px;
  }
  img {
    width: auto;
    height: 80px;
  }
}
</style>
