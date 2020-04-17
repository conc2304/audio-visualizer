<template lang="pug">

  v-card.local-audio-list(  color="#000" elevation="10")
    .container-header.text-center
      h1 Choose your tunes!
      v-btn.uploader(
        large
        raised
        color="color_primary_blue"
        @click="triggerFileUpload"
      )
        v-icon() unarchive
        .btn-text Upload a Song File

      input(
        v-show="false"
        type="file"
        id="file"
        ref="file"
        accept="audio/*"
        multiple
        @change="onFileChange"
      )

      .hero.text-center
        h3 Don't Have a Song?
        h4 Jam out to some of our favorite tunes!

    #song-list-wrapper.custom-thin-scrollbar
      v-row.song-item( v-for="(track, i) in songList" :key="i"
        @click="uploadServerFile(track)"
      )
        v-col() {{ track.artist }}
        v-col() {{ track.title }}
        v-col.genre() {{ track.genre }}

</template>

<script>
import AudioLocalData from '@/js/services/AudioLocalData';
// import APS from '@/js/services/AudioPlayerService';

export default {
  data: () => ({
    songList: AudioLocalData,
  }),

  methods: {
    triggerFileUpload() {
      this.$emit('close_modal');
      this.$refs.file.click();
    },

    uploadServerFile(track) {
      // APS.audioUploaded(track);
      this.$emit('close_modal');
    },

    onFileChange() {
      this.tracks = this.$refs.file.files;
      if (!this.tracks.length) return;

      // APS.audioUploaded(this.tracks);
    },
  },
};
</script>

<style lang="scss" scoped>
.container-header {
  padding-top: 2rem;
}

.uploader {
  margin-top: 1.5rem;
}
#song-list-wrapper {
  max-height: 400px;
  overflow-y: scroll;
  padding: 0rem 1.5rem 1.5rem;

  &.custom-thin-scrollbar {
    &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #000000;
    background-image: -webkit-gradient(
      linear,
      40% 0%,
      50% 80%,
      from(#000000),
      to($color-secondary-blue),
      color-stop(0.9, $color-primary-blue)
    );
  }
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background-color: #000;
    }
  }

}

.song-item {
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    border-color: $color-primary-blue;
  }
}

.btn-text {
  margin-left: 2rem;
}
.hero {
  margin-top: 2rem;
}

.genre {
  color: $color-primary-blue;
  font-weight: bold;
}
</style>
