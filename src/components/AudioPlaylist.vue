<template lang="pug">
  #playlist-container.custom-thin-scrollbar
    v-container
      v-row.song-item(
        v-show="playlist.length"
        v-for="(song, i) in playlist"
        :class="{ 'active': activeSongIndex === i}"
        :key="i"
        @click="setSong(song, i)"
        cols="12"
        dense
      )
        v-col.song-title(md="4") {{ song.title }}
        v-col.artist(md="6") {{ song.artist }}
        v-spacer
        v-col.duration(md="2") {{ song.duration }}

</template>

<script>
const axios = require('axios');

export default {
  data: () => ({
    activeSongIndex: -1,
    playlist: [],
  }),

  methods: {
    setSong(songObj, index) {
      this.activeSongIndex = index;
      this.$emit('active_song', songObj);
    },
  },

  mounted() {
    axios
      .get('https://my-json-server.typicode.com/conc2304/test-api/db')
      .then(response => {
        this.playlist = response.data.playlist ? response.data.playlist : [];
      });
  },
};
</script>

<style lang="scss" scoped>
#playlist-container {
  text-align: left;
  color: $color-off-white;
  max-height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;

  &.custom-thin-scrollbar::-webkit-scrollbar-track {
    background-color: #000;
  }

  .song-title,
  .artist {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .song-item {
    padding: 5px 10px 0;
    border: 1px solid #000;
    border-radius: 8px;

    &:hover {
      border-color: $subtle-border;
    }

    &.active {
      border-color: $color-primary-blue;
    }

    &:active {
      border-color: $color-secondary-blue;
    }
  }

  .song-details {
    padding: 0.3rem;
  }
}
</style>
