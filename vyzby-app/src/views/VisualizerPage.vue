<template lang="pug">
  div#visualizer-wrapper
    #sketch-container

    #settings-open.helper(
      title="Open Menu"
      data-helper="Open the Master menu"
      v-show="menuOpen"
    )
      v-icon menu
    SettingsMenu
</template>

<script>
import SettingsMenu from '@/components/SettingsMenu.vue';
export default {
  name: 'visualizer',
  data: () => ({
    menuOpen : true
  }),
  components: {
    SettingsMenu,
  },
  methods: {},
  mounted() {},
};
</script>

<style lang="scss" scoped>
#visualizer-wrapper {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: #000;
}

* {
  font-family: 'Montserrat', sans-serif;
}

#settings-open {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 24px;
  color: #ffffff;
  padding: 15px;
  float: left;
}
</style>
