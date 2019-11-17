<template lang="pug">
  div#visualizer-wrapper
    #sketch-container

    #settings-open.helper(
      title="Open Menu"
      data-helper="Open the Master menu"
      v-show="menuOpen"
    ) ☰
    SettingsMenu
</template>

<script>
import SettingsMenu from '@/components/SettingsMenu.vue';
export default {
  name: 'visualizer',
  data: () => ({
    menuOpen = true
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

<style lang="scss">

i.material-icons {
  z-index: 2;
  font-size: 24px;
  padding: 15px;
  display: inline-block;
  color: #0e83cd;
  vertical-align: middle;
  cursor: pointer;
}

i.material-icons.inactive {
  color: #6f0000;
}

i.material-icons.inactive:hover {
  color: #aa0000;
}

i.material-icons:hover {
  color: #0eb1ff;
}

i.material-icons:active, i.material-icons.inactive:active {
  color: #0ecd78;
}

</style>
