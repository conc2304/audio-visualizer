const path = require('path');

module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      // mutate config for production...
    } else {
      // mutate for development...
    }
  },
  transpileDependencies: ["vuetify"],
  css: {
    loaderOptions: {
      // sass: {
      //   sassOptions: {
      //     includePaths: [path.resolve(__dirname, "src/core/")],
      //     indentedSyntax: true,
      //   },
      //   prependData: `@import "~@/scss/_variables.sass";`,
      // },
      scss: {
        // Here we can use the newer SCSS flavor of Sass.
        // Note that there *is* a semicolon at the end of the below line
        prependData: `@import "@/scss/_variables.scss"; $test: red;`
      }
    },
  },
  assetsDir: "@/scss/",
};
