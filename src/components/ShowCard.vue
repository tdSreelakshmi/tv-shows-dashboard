<template>
  <div class="show-card" @focus="console.log('focus')">
    <img :src="showInfo.image.medium" alt="" />
    <p>
      {{ showInfo.name }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ShowCard",
  props: {
    id: Number,
  },
  data() {
    return {
      showInfo: null,
    };
  },
  computed: {
    ...mapGetters(["getShowById"]),
  },
  created() {
    this.showInfo = this.getShowById(this.id);
  },
};
</script>

<style lang="scss" scoped>
.show-card {
  display: flex;
  flex-direction: column;
  width: 120px;
  background: black;
  box-shadow: 0px 0px 6px 1px $color-accent-pale;
  border-radius: 8px;
  height: fit-content;
  align-items: center;
  margin: 16px 4px;
}
img {
  border-radius: 8px 8px 0px 0px;
  width: 120px;
  height: auto;
}
p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 120px;
  margin: 16px 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 120px;
  margin: 16px 4px;
  text-align: center;
}
</style>