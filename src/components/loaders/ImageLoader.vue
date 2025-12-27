<template>
  <div class="image-loader"></div>
</template>

<script>
export default {
  name: 'ImageLoader'
}
</script>

<style lang="scss" scoped>
.image-loader {
  width: 100%;
  height: 100%;
  background-size: 400% 400%;

  border-radius: 8px 8px 0 0;
  background: $gradient-spectrum;
  background-size: 200% 200%;
  animation: gradient-move 2s linear infinite;
}

@keyframes gradient-move {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>>

>
