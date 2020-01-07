<template lang="pug">
  #audio-control-panel
    #audio-sketch-container
    #audio-player
      .song-info
        p#song-name {{ currentSong.title }} - {{ currentSong.artist }}
        p#song-time  {{ currentSong.duration }}
    .song-progress
      v-progress-linear#loading-bar(
        value="0" max="100"
        striped
        rounded
      )
      v-progress-linear#progress-bar(
        value="0" max="100"
        rounded
      )
    .audio-controls
      #playback-controls.ctrl-buttons
        v-tooltip( right)
          template( v-slot:activator = "{ on }")
            v-btn#open-playlist(
              @click="playlistOpen = !playlistOpen"
              text icon
            )
              v-icon.menu-icon(
                v-on="on"
              ) queue_music
          span Open Playlist

        v-btn( @click="" text icon)
          v-icon.menu-icon skip_previous
        v-btn( @click="" text icon)
          v-icon.menu-icon play_arrow
        v-btn( @click="" text icon)
          v-icon.menu-icon skip_next

        v-tooltip( right)
          template( v-slot:activator= "{ on }")
            v-btn#upload-file-button(
              @click="triggerFileUpload"
              text icon
            )
              v-icon.menu-icon(
                v-on="on"
              ) unarchive
          span  Upload local music

        input(
          v-show="false"
          type="file"
          ref="fileInput"
          accept="audio/*"
        )
      AudioPlaylist(
        v-show="playlistOpen"
        @active_song="setActiveSong"
      )
</template>

<script>
import AudioPlaylist from '@/components/AudioPlaylist.vue';
import AudioAnalyzer from '@/js/sketches/SketchBaseAudioAnalyzer';
import AudioPlayerService from '@/js/services/AudioPlayerService';

let p5i;

export default {
  data: () => ({
    playlistOpen: false,
    currentSong: {
      title: 'Song Name',
      artist: 'Artist',
      duration: 'Duration',
    },
  }),

  components: {
    AudioPlaylist,
  },

  methods: {
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    setActiveSong(songObj) {
      this.currentSong = songObj;
    },

    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      console.log(files);
    },
  },

  mounted() {
    const P5 = require('p5');
    p5i = new P5(AudioAnalyzer, 'audio-sketch-container ');
  },
};
</script>

<style lang="scss" scoped>
#audio-control-panel {
  position: absolute;
  left: $master-menu-width;
  bottom: 0;
  border-left: 1px solid $color-std-grey;
  border-top: 1px solid $subtle-border;
  border-right: 1px solid $subtle-border;
  z-index: 1;
  background-color: #000;
  width: $secondary-menu-width;
  min-height: 67px;
  text-align: center;
  padding: 10px;
}

#audio-sketch-container {
  display: none;
}

#playback-controls.ctrl-buttons {
  margin: 0 auto;
}

p {
  color: $color-off-white;
}
.song-progress {
  padding: 0 10px 10px;
}

#open-playlist {
  position: absolute;
  left: 10px;
}
#upload-file-button {
  position: absolute;
  right: 10px;
}
</style>
