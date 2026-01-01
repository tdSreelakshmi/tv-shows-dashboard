<template>
  <router-link
    :id="`card-${genre}-${id}`"
    class="show-card"
    :to="'/show/' + (id ?? this.showInfo.id)"
  >
    <img
      v-if="showImage"
      loading="lazy"
      width="160"
      @load="loaded = true"
      @error="loaded = false"
      :src="showInfo.image['medium']"
      :alt="showInfo?.name + '-img'"
    />
    <ImageLoader v-else />
    <span v-if="showInfo.rating.average">
      {{ showInfo.rating.average }}
      <img src="../assets/star.svg" alt="rating" />
    </span>
    <div class="text">
      <p>
        {{ showInfo?.name }}
      </p>
    </div>
  </router-link>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import ImageLoader from "./loaders/ImageLoader.vue";

export default {
  components: { ImageLoader },
  name: "ShowCard",
  props: {
    id: Number,
    show: Object,
    genre: String
  },
  data() {
    return {
      showInfo: null,
      expandDetails: false,
      position: 0,
      loaded: false
    };
  },
  computed: {
    ...mapGetters(["getShowById"]),
    ...mapState(["scrollPosition", "screenHeight"]),
    showImage() {
      return (
        this.showInfo?.image?.medium &&
        this.position > this.scrollPosition - 400 &&
        this.position < this.scrollPosition + this.screenHeight
      );
    }
  },
  created() {
    if (this.id) this.showInfo = this.getShowById(this.id);
    else this.showInfo = this.show;
  },
  mounted() {
    const card = document.getElementById(`card-${this.genre}-${this.id}`);
    this.position = card.offsetTop;
  }
};
</script>

<style lang="scss" scoped>
.show-card {
  display: flex;
  flex-direction: column;
  height: fit-content;
  justify-content: space-between;
  background: black;
  box-shadow: 0px 0px 6px 1px $color-mint-alpha;
  border-radius: 8px;
  align-items: center;
  margin: 16px 4px;
  position: relative;
  width: 160px;
  min-width: 160px;
  min-height: 275px;
  height: auto;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95);
  &:hover {
    scale: 1.1;
  }
}

img {
  border-radius: 8px 8px 0px 0px;
  width: 160px;

  height: auto;
}
.text {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
p {
  color: white;
  text-align: center;
}
span {
  position: absolute;
  height: auto;
  background: white;
  padding: 4px;
  width: auto;
  border-radius: 0px 6px 0px 6px;
  right: 0;
  font-size: 12px;
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  & img {
    height: 10px;
    width: 10px;
  }
}
@media screen and (max-width: 768px) {
  .show-card {
    margin: 4px;
    min-width: 100px;

    width: 100px;
    min-height: 180px;
  }
  .text {
    margin: 8px 4px;
  }
  img {
    width: 100px;
  }
}
</style>
