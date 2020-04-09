<template lang="pug">

  .nav-wrapper
    nav
      ul
        li( v-for='route in routes' :key='route.name')
          router-link(:to="route.path" exact) {{ route.name }}
    router-view
</template>

<script>
import Router from '@/router/index.js';

export default {
  data: () => ({
    routes: Router.options.routes,
  }),
};
</script>

<style lang="scss" scoped>
  li {
    list-style-type: none;
    display: inline-block;
    margin-right: 1rem;;
  }
</style>
