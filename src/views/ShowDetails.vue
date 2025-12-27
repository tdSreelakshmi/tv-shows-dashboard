<template>
  <div v-if="showInfo && images" class="show-details">
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
        <div class="flex-row">
          <h1>
            {{ showInfo.name }}
          </h1>
          <p class="flex-row">
            <img src="../assets/star.svg" alt="rating" />
            {{ showInfo.rating.average }}/10
          </p>
        </div>
      </div>
      <div class="info-wrapper" v-if="selectedTab == 'info'">
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

      <div
        v-else-if="selectedTab == 'info' && casts.length > 0"
        class="cast-container"
      >
        <div
          v-for="cast in casts"
          :key="cast.person.id"
          @click="selectPerson(cast.person.id)"
        >
          <img
            class="cast-img"
            :src="cast?.character.image?.medium ?? cast?.person.image?.medium"
            alt="cast"
          />

          <p class="cast-text">
            {{ cast?.person.name }} <span>as {{ cast?.character.name }}</span>
          </p>
        </div>
      </div>
    </div>
    <ShowsByPerson v-if="selectedPerson" :id="selectedPerson" />
  </div>
</template>

<script>
import ShowsByPerson from '@/components/show/ShowsByPerson.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  components: { ShowsByPerson },
  name: 'ShowDetails',
  props: {
    id: String
  },
  data () {
    return {
      showInfo: null,
      images: null,
      currentImage: 1,
      casts: [],
      akas: null,
      selectedPerson: null,
      selectedTab: 'info'
    }
  },
  computed: {
    ...mapGetters(['getShowById']),
    ...mapState(['loaded'])
  },
  created () {
    this.$store.commit('SET_SEARCH', false)

    if (this.loaded) {
      this.showInfo = this.getShowById(this.id)
      if (!this.showInfo) {
        this.getShow()
      }
    } else {
      this.getShow()
    }
    this.getShowImages()
    this.getShowCast()
    this.getShowAkas()
  },
  methods: {
    openOfficialSite () {
      window.open(this.showInfo.officialSite)
    },
    selectPerson (id) {
      this.selectedPerson = id
    },
    async getShowAkas () {
      try {
        this.akas = await this.$store.dispatch('showAkas', this.id)
      } catch (error) {}
    },
    async getShow () {
      try {
        this.showInfo = this.casts = await this.$store.dispatch(
          'getShow',
          this.id
        )
      } catch (error) {}
    },
    async getShowCast () {
      try {
        this.casts = await this.$store.dispatch('getShowCast', this.id)
      } catch (error) {}
    },
    async getShowImages () {
      try {
        this.images = await this.$store.dispatch('getShowImages', this.id)
        this.imageTimer()
      } catch (error) {}
    },
    imageTimer () {
      if (!this.images) return
      setInterval(() => {
        const next =
          this.currentImage < this.images.length ? this.currentImage + 1 : 1
        this.currentImage = null
        const img = new Image()
        img.src = this.images[next - 1]

        img.onload = () => {
          setTimeout(() => {
            this.currentImage = next
          }, 400)
        }
      }, 5000)
    }
  },
  watch: {
    loaded (value) {
      if (value) {
        this.showInfo = this.getShowById(this.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.info-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.cast-container div {
  display: flex;
  flex-direction: row;
  font-size: x-small;
  margin: 4px;
  gap: 4px;
  align-items: center;
  background: $color-yellow-alpha;
  border-radius: 10px;
  box-shadow: 0px 0px 6px 1px $color-mint;
  transition: all 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95);
  cursor: pointer;
  &:hover {
    scale: 1.3;
    background: $color-yellow;
  }
}
.names:not(:last-child)::after {
  content: "|";
  margin-left: 10px;
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
.cast-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.cast-img {
  height: 60px;
  border-radius: 10px;
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
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 20px 5%;
}
.img-container {
  width: 30vw;
  height: 100%;
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
  overflow: auto;
}
.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
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
}
</style>
