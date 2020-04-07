<template lang="pug">

  .three-tut-wrapper
    nav
      ul
        li( v-for='route in routes' :key='route.name')
          router-link(:to="route.path" exact) {{ route.name }}
    router-view

    h1 Three test

</template>

<script>
// const axios = require('axios');
import * as THREE from 'three';
import Router from '@/router/index.js';

export default {
  data: () => ({
    title: '',
    subtitle: '',
    routes: Router.options.routes,
  }),

  mounted() {
    console.log(Router);
  },
};
</script>
