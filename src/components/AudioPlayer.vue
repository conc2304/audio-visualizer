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

        input( type="file" id="upload-file" name="upload-file")
        label( for="upload-file" id="upload-file-label")
          v-btn( text icon)
            v-icon.menu-icon( id="upload-file-icon" title="Upload a local sound file") unarchive




</template>

<script>
export default {
  data: () => ({
    currentSong: {
      name: 'Song Name',
      time: 'Duration',
    },
  }),
};
</script>

<style lang="scss" scoped>
#audio-control-panel {
  position: absolute;
  left: 61px;
  bottom: 0;
  border-top: 1px solid $subtle-border;
  border-right: 1px solid $subtle-border;
  z-index: 1;
  background-color: #000;
  width: 300px;
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
#upload-file {
  width: 0;
  height: 0;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
#open-playlist {
  position: absolute;
  left: 10px;
}
#upload-file-label {
  position: absolute;
  right: 10px;
}
</style>
