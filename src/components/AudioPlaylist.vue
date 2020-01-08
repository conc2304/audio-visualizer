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
        v-col.artist(
          :md="mdArtist(song)"
        ) {{ song.artist }}
        v-col.song-title(
          :md="mdTitle(song)"
        ) {{ song.title }}
        v-spacer
        v-col.duration(
          :md="mdDuration(song)"
          v-show="song.duration"
        ) {{ song.duration }}
    v-container( v-show="!playlist.length")
      v-row
        v-col( align="center" ) Empty
      v-row
        v-col( align="center") Try uploading some songs!


</template>

<script>
import Utils from '@/js/services/Utils';

export default {
  data: () => ({
    activeSongIndex: -1,
  }),

  methods: {
    setSong(songObj, index) {
      this.activeSongIndex = index;
      this.$emit('active_song', songObj);
    },

    mdArtist(songData) {

      if (!songData.artist) return 0;

      let colsLeft = 12;
      colsLeft -= (!songData.duration) ? 0 : 2;


      let mdArtist = 4;

      return mdArtist;
    },

    mdTitle(songData) {
      const totalCols = 12;
      let mdTitle = 6;

      // if
      return mdTitle;
    },

    mdDuration(songData) {
      return !songData.duration ? 0 : 2;
    },
  },

  computed: {
    playlist() {
      const tracks = this.$store.state.audio.tracks;
      console.log(tracks);

      const playlist = [];
      for (let file of tracks) {
        const formattedFilename = Utils.formatAudioFilename(file);
        playlist.push(formattedFilename);
      }

      return playlist;
    },

    // md to equal a total
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
