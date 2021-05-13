<template lang="pug">

  .nav-wrapper
    nav
      ul
        li( v-for='route in routesbyType' :key='route.name')
          router-link(:to="route.path" exact) {{ route.name }}
    router-view
</template>

<script>
import Router from "@/router/index.js";

export default {
  data: () => ({
    routes: Router.options.routes,
  }),

  props: {
    navType: {
      default: "",
      type: String,
    },
  },

  computed: {
    routesbyType() {
      if (!this.navType) return this.routes;
      return this.routes.filter(r => r.path.indexOf(`/${this.navType}`) === 0);
    },
  },
};
</script>

<style lang="scss" scoped>
li {
  list-style-type: none;
  display: inline-block;
  margin-right: 1rem;
}
</style>
