<template>
  <div id="splash-container">
    <div class="title-bar">
      <h1>{{ title }}</h1>
      <h2>{{ tagline}}</h2>
    </div>
    <div class="btn-wrapper">
      <v-btn outlined color="white">{{ buttonText }}</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    title: 'VYZBY',
    tagline: 'A visceral interactive digital canvas to play and create in.',
    buttonText: 'Go Play',
  }),
};
</script>

<style lang="scss" scoped>
#splash-container {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: #000;
}

.title-bar {
  margin-top: 20%;
  color: $color-primary-blue;
  text-align: center;
}

h1 {
  font-family: 'Montserrat', 'sans-serif';
  font-weight: 900;
  font-size: 6.5rem;
  line-height: 1.5em;
}

h2 {
  font-family: 'Roboto', 'sans-serif';
  font-weight: 300;
  font-size: 1.5rem;
  line-height: 1.15em;
}

.btn-wrapper {
  margin-top: 20%;
  text-align: center;
}
</style>
