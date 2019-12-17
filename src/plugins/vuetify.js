import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        color_primary_blue: '#0e83cd',
        color_secondary_blue: '#0eb1ff',
        color_primary_blue_hover: '#0eb1ff',

        color_inactive_red_hover: '#aa0000',
        color_inactive_red: '#6f0000',

        color_active_green: '#0ecd78',

        color_off_white: '#b6b6b6',
        color_std_grey: '#424242',
        color__grey: '#242424',

        color_transparent_black: '#000000bd;',
      },
    },
  },
});


// primary: '#1976D2',
// secondary: '#424242',
// accent: '#82B1FF',
// error: '#FF5252',
// info: '#2196F3',
// success: '#4CAF50',
// warning: '#FFC107',
