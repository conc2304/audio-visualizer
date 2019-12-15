<template lang="pug">
  #audio-control-panel
    #audio-player
      .song-info
        p#song-name {{ currentSong.name }}
        p#song-time  {{ currentSong.time }}
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
        v-btn#open-playlist( text icon)
          v-icon.menu-icon queue_music

        v-btn( text icon)
          v-icon.menu-icon skip_previous
        v-btn( text icon)
          v-icon.menu-icon play_arrow
        v-btn( text icon)
          v-icon.menu-icon skip_next


        v-btn#upload-file-button(
          @click="triggerFileInput"
          text icon
        )
          v-icon.menu-icon unarchive
        input(
          v-show="false"
          type="file"
          ref="fileInput"
          accept="audio/*"
        )




</template>

<script>
export default {
  data: () => ({
    currentSong: {
      name: 'Song Name',
      time: 'Duration',
    },
  }),

  methods: {
    triggerFileInput() {
      console.log('trigger');
      console.log(this.$refs);
      this.$refs.fileInput.click();
    },

    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      console.log(files);
    },
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
  width: 350px;
  min-height: 67px;
  text-align: center;
  padding-bottom: 10px;
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
