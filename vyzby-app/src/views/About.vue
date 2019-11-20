<template lang="pug">
  .about
    h1( v-if="title") {{ title }}
    h3( v-if="subtitle") {{ subtitle }}
</template>

<script>
const axios = require('axios');

export default {
  data: () => ({
    title: '',
    subtitle: '',
  }),

  mounted() {
    this.title = axios.get(
      'https://my-json-server.typicode.com/conc2304/test-api/db',
    )
    .then(response => {
      console.log(response);
      let data = response.data.about;
      this.title = data.title;
      this.subtitle = data.subtitle;
    });
  },
};
</script>
