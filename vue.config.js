const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: "warning",
  devServer: {
    client: {
      overlay: false
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "@/styles/global.scss";'
      }
    }
  }
});
