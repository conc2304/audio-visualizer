<template lang="pug">
  .about
    h1( v-if="title") {{ title }}
    h3( v-if="subtitle") {{ subtitle }}

    p sorry this page is boring

    nav
      ul
        li( v-for='link in links' :key='link')
          router-link( :to="paths[link]" exact) {{ link }}
    router-view
</template>

<script>
const axios = require('axios');

export default {
  data: () => ({
    title: '',
    subtitle: '',
    links: ['home', 'playground'],
    paths: {
      home: '/',
      visualizer: '/playground',
    },
  }),

  mounted() {
    this.title = axios
      .get('https://my-json-server.typicode.com/conc2304/test-api/db')
      .then(response => {
        let data = response.data.about;
        this.title = data.title;
        this.subtitle = data.subtitle;
      });
  },
};
</script>
