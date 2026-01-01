<template>
  <DashboardHeader />
  <router-view />
</template>
<script>
import DashboardHeader from "./components/DashboardHeader.vue";

export default {
  components: { DashboardHeader }
};
</script>
<style lang="scss">
#app {
  height: 100dvh;
  width: 100%;
  padding-top: 80px;
  background: $gradient-soft-spectrum;
  overflow: auto;
  // color: $color-text-light;
}
</style>
