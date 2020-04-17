<template lang="pug">
  #playlist-container.custom-thin-scrollbar
    v-container
      v-row.song-item(
        v-show="playlist.length"
        v-for="(song, i) in playlist"
        :class="{ 'active': currentTrackIndex === i}"
        :key="i"
        @click="setSong(i)"
        cols="12"
        dense
      )

        v-col.artist(
          :md="mdArtist(song)"
          v-show="song.artist"
        )
          Trunquee( :text="song.artist" )
        v-col.song-title(
          :md="mdTitle(song)"
        ) {{ song.title }}
        v-spacer(
          v-show="song.duration"
        )
        v-col.duration(
          :md="mdDuration(song)"
          v-show="song.duration"
        )
          Trunquee( :text="song.duration" )
        v-col(
          md="1"
        )
          v-icon.remove-song(
            @click.stop.prevent="removeSong(i)"
          ) close
    v-container( v-show="!playlist.length")
      v-row
        v-col( align="center" ) Empty
      v-row
        v-col( align="center") Try uploading some music!


</template>

<script>
import Trunquee from '@/components/Trunquee.vue';
// import AudioPlayerService from '@/js/services/AudioPlayerService';
import Utils from '@/js/services/Utils';

export default {
  components: {
    Trunquee,
  },

  props: {
    p5: {
      defualt: null,
    },
  },

  methods: {
    setSong(index) {
      const selectedSound = this.$store.state.audio.tracks[index];
      this.$store.commit('updateCurrentTrackIndex', index);
      // AudioPlayerService.setupAudioAnalysis(selectedSound, true, this.p5);
    },

    removeSong(index) {
      const tracks = this.$store.state.audio.tracks;
      tracks.splice(index, 1);
      this.$store.commit('updateTracks', tracks);

      if (this.$store.state.audio.currentTrackIndex === index) {
        if (tracks.length === 0) {
          this.$store.commit('updateCurrentTrackIndex', -1);
          // AudioPlayerService.audio.stop();
          // AudioPlayerService.audio.disconnect();
        } else {
          this.setSong(index);
        }
      }
    },

    mdArtist(songData) {
      return !songData.artist ? 0 : 4;
    },

    mdTitle(songData) {
      if (!songData.duration && !songData.artist) {
        return 11;
      }
      if (!songData.artist && songData.duration) {
        return 9;
      }
      if (!songData.duration && songData.artist) {
        return 7;
      }

      return 7;
    },

    mdDuration(songData) {
      return !songData.duration ? 0 : 2;
    },
  },

  computed: {
    currentTrackIndex() {
      return this.$store.state.audio.currentTrackIndex;
    },

    playlist() {
      const tracks = this.$store.state.audio.tracks;
      const playlist = [];

      for (const file of tracks) {
        const formattedFilename = Utils.formatAudioFilename(file);
        playlist.push(formattedFilename);
      }

      return playlist;
    },
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

  &.custom-thin-scrollbar {
    &.scrollbar__thick::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background-color: #000;
    }
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

  .remove-song {
    color: $color-off-white;

    &:hover {
      color: $color-primary-blue-hover;
    }
  }

  .song-details {
    padding: 0.3rem;
  }
}
</style>
