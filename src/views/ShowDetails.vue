<template>
  <div v-if="showInfo && images" class="show-details">
    <div class="basic-info">
      <div class="img-container">
        <Transition name="fade"
          ><img
            class="show-image"
            v-if="currentImage"
            :src="images[currentImage - 1]"
            alt=""
        /></Transition>
      </div>

      <div class="show-description">
        <div>
          <div class="title">
            <h1>
              {{ showInfo.name }}
            </h1>
            <p class="rating">
              <img src="../assets/star.svg" alt="rating" />
              {{ showInfo.rating.average }}/10
            </p>
          </div>
        </div>
        <div class="genres">
          <p class="names" v-for="(name, idx) in akas" :key="idx">
            {{ name }}
          </p>
        </div>

        <div class="genres">
          <button
            class="chips pink"
            v-for="genre in showInfo.genres"
            :key="genre"
          >
            {{ genre }}
          </button>
        </div>
        <div class="genres">
          <p class="chips blue" v-if="showInfo.network">
            {{ showInfo.network?.name }}
          </p>
          <p class="chips blue" v-if="showInfo.webChannel">
            {{ showInfo.webChannel?.name }}
          </p>

          <p class="chips blue" v-if="showInfo.dvdCountry">
            {{ showInfo.dvdCountry?.name }}
          </p>
          <p class="chips blue">
            {{ showInfo.language }}
          </p>
          <p class="chips blue">{{ getShowYearRange }}</p>

          <p class="chips blue">{{ showInfo.averageRuntime }} mins</p>
        </div>

        <p v-html="showInfo.summary"></p>

        <button
          class="watch"
          v-if="showInfo.officialSite"
          @click="openOfficialSite()"
        >
          Watch Now
        </button>
      </div>
    </div>
    <ShowSeasons :id="id" />
    <ShowCast :id="id" />

    <ShowsByPerson v-if="selectedPerson" :id="selectedPerson" />
  </div>
</template>

<script>
import ShowsByPerson from "@/components/show/ShowsByPerson.vue";
import ShowSeasons from "@/components/ShowSeasons.vue";
import { mapGetters, mapState } from "vuex";
import ShowCast from "@/components/ShowCast.vue";

export default {
  components: { ShowsByPerson, ShowSeasons, ShowCast },
  name: "ShowDetails",
  props: {
    id: String,
  },
  data() {
    return {
      showInfo: null,
      images: null,
      currentImage: 0,
      akas: null,
      selectedPerson: null,
      imageInterval: null,
    };
  },
  unmounted() {
    clearInterval(this.imageInterval);
  },
  computed: {
    ...mapGetters(["getShowById"]),
    ...mapState(["loaded"]),
    getShowYearRange() {
      const startYear = this.showInfo.premiered
        ? this.showInfo.premiered.split("-")[0]
        : null;

      if (!startYear) return null;

      const endYear = this.showInfo.ended
        ? this.showInfo.ended.split("-")[0]
        : "Present";

      return `${startYear} - ${endYear}`;
    },
  },
  created() {
    if (this.loaded) {
      this.showInfo = this.getShowById(this.id);
      if (!this.showInfo) {
        this.getShow();
      }
    } else {
      this.getShow();
    }
    this.getShowImages();
    this.getShowAkas();
  },
  methods: {
    openOfficialSite() {
      window.open(this.showInfo.officialSite);
    },
    selectPerson(id) {
      this.selectedPerson = id;
    },
    async getShowAkas() {
      try {
        this.akas = await this.$store.dispatch("showAkas", this.id);
      } catch (error) {}
    },
    async getShow() {
      try {
        this.showInfo = this.casts = await this.$store.dispatch(
          "getShow",
          this.id
        );
      } catch (error) {}
    },

    async getShowImages() {
      try {
        this.images = await this.$store.dispatch("getShowImages", this.id);
        this.imageTimer();
      } catch (error) {}
    },
    setAndGetImage() {
      const next =
        this.currentImage < this.images.length ? this.currentImage + 1 : 1;
      this.currentImage = null;
      const img = new Image();
      img.src = this.images[next - 1];

      img.onload = () => {
        this.currentImage = next;
      };
    },
    imageTimer() {
      if (!this.images) return;
      this.setAndGetImage();
      this.imageInterval = setInterval(() => {
        this.setAndGetImage();
      }, 5000);
    },
  },
};
</script>

<style lang="scss" scoped>
.basic-info {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.names:not(:last-child)::after {
  content: "|";
  margin-left: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.7s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.show-details {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 20px 5%;
}
.img-container {
  width: 30vw;
  height: 50vh;
}
.show-image {
  width: auto;
  max-width: 30vw;
  max-height: 100%;
  border-radius: 20px;
  box-shadow: 0px 4px 4px grey;
}
.show-description {
  padding-left: 20px;
  max-width: 1024px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.title,
.rating {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.title {
  gap: 16px;
  & .rating {
    gap: 4px;
  }
}
.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}
.chips {
  padding: 4px 12px;
  border-radius: 16px;
  border: none;
  font-size: 16px;
}
.pink {
  background: $color-peach;
}
.blue {
  background: $color-mint;
}
.watch {
  padding: 8px 16px;
  border-radius: 16px;
  border: none;
  font-size: 16px;
  width: 240px;
  place-self: center;
  background: $color-green;
}

@media screen and (max-width: 1024px) {
  .basic-info {
    flex-direction: column;
    align-items: center;
  }
  .show-description {
    align-items: center;
  }
  .show-details {
    flex-direction: column;
    height: auto;
    width: auto;
    gap: 16px;
    align-items: center;
  }
  .img-container {
    height: 50vh;
    width: auto;
  }
  .show-image {
    width: auto;
    max-width: 90vw;
    max-height: 100%;
  }
  .show-description {
    padding: 20px 0px;
  }
  .info-wrapper {
    align-items: center;
  }
  .title {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
