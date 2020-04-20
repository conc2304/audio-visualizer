import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        color_primary_blue: "#0e83cd",
        color_secondary_blue: "#0eb1ff",

        error: "#aa0000",
        color_inactive_red_hover: "#aa0000",
        color_inactive_red: "#6f0000",

        color_active_green: "#0ecd78",

        color_off_white: "#b6b6b6",
        color_std_grey: "#424242",
        color__grey: "#242424",

      },
    },
  },
});
