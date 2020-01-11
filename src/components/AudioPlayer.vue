<template lang="pug">
  #audio-control-panel
    #audio-sketch-container
    #audio-player
      .song-info
<<<<<<< HEAD
        p#song-name {{ currentSong.title }} - {{ currentSong.artist }}
        p#song-time  {{ currentSong.duration }}
=======
        p#song-artist(
          v-show="currentSound.artist"
        ) {{ currentSound.artist }}
        p#song-name  {{ currentSound.title }}
        p#song-time  {{ currentTrackTime}}
>>>>>>> vyzby-app
    .song-progress
      v-progress-linear#loading-bar(
        v-show="audioIsLoading"
        indeterminate
        striped
        rounded
      )
      #progress-click-wrapper(
        @click="toSongPosition($event)"
      )
        v-progress-linear#song-progress-bar(
          v-show="!audioIsLoading"
          :value="songProgress"
          max="100"
          rounded
        )
    .audio-controls
      #playback-controls.ctrl-buttons
<<<<<<< HEAD
        v-btn#open-playlist(
          @click="playlistOpen = !playlistOpen"
          text icon
        )
          v-icon.menu-icon queue_music

        v-btn( @click="" text icon)
          v-icon.menu-icon skip_previous
        v-btn( @click="" text icon)
          v-icon.menu-icon play_arrow
        v-btn( @click="" text icon)
=======
        v-tooltip( right)
          template( v-slot:activator = "{ on }")
            v-btn#open-playlist(
              @click="playlistOpen = !playlistOpen"
              text icon
            )
              v-icon.menu-icon(
                v-on="on"
              ) queue_music
          span {{ playlistOpen ? 'Close' : 'Open' }} Playlist

        v-btn( @click="setSong(-1)" text icon)
          v-icon.menu-icon skip_previous
        v-btn( @click="toggleAudioState()" text icon)
          v-icon.menu-icon {{ isPlaying ? 'pause' : 'play_arrow' }}
        v-btn( @click="setSong(1)" text icon)
>>>>>>> vyzby-app
          v-icon.menu-icon skip_next

        v-tooltip( right)
          template( v-slot:activator= "{ on }")
            v-btn#upload-file-button(
<<<<<<< HEAD
              @click="triggerFileInput"
=======
              @click="uploadAudioDialog = true"
>>>>>>> vyzby-app
              text icon
            )
              v-icon.menu-icon(
                v-on="on"
              ) unarchive
<<<<<<< HEAD
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
=======
          span  Upload Music

      AudioPlaylist(
        v-show="playlistOpen"
>>>>>>> vyzby-app
      )

      v-dialog(
        v-model="uploadAudioDialog"
        max-width="600"
        scrollable
      )
        AudioLocalList(
          @close_modal="uploadAudioDialog = false"
        )

</template>

<script>
import AudioPlaylist from '@/components/AudioPlaylist.vue';
<<<<<<< HEAD

=======
import AudioLocalList from '@/components/AudioLocalList.vue';
import AudioAnalyzer from '@/js/sketches/SketchBaseAudioAnalyzer';
import AudioPlayerService from '@/js/services/AudioPlayerService';
import Utils from '@/js/services/Utils';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
>>>>>>> vyzby-app

export default {
  data: () => ({
    playlistOpen: false,
<<<<<<< HEAD
    currentSong: {
      title: 'Song Name',
      artist: 'Artist',
      duration: 'Duration',
    },
  }),

  components: {
    AudioPlaylist
  },

  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    setActiveSong(songObj) {
      this.currentSong = songObj;
=======
    uploadAudioDialog: false,
  }),

  components: {
    AudioPlaylist,
    AudioLocalList,
  },

  methods: {
    triggerFileUpload() {
      this.$refs.file.click();
    },

    toggleAudioState() {
      AudioPlayerService.toggleAudioState(this.p5);
    },

    toSongPosition(e) {
      if (!AudioPlayerService.audio) return;

      const percent = e.offsetX / e.target.offsetWidth;
      AudioPlayerService.audio.jump(AudioPlayerService.audio.duration() * percent);
    },

    setSong(direction) {
      const currentIndex = this.$store.state.audio.currentTrackIndex;
      const tracks = this.$store.state.audio.tracks;

      // if its the last song loop to start of playlist
      const nextIndex =
        direction === 1
          ? currentIndex === tracks.length - 1
            ? 0
            : Math.min(currentIndex + 1, tracks.length - 1)
          : Math.max(currentIndex - 1, 0);

      this.$store.commit('updateCurrentTrackIndex', nextIndex);
      AudioPlayerService.setupAudioAnalysis(tracks[nextIndex], true, this.p5);
    },
  },

  mounted() {
    AudioPlayerService.p5 = new p5(AudioAnalyzer, 'audio-sketch-container');

    AudioPlayerService.songTimeElem = document.getElementById('song-time');
    AudioPlayerService.songProgressElem = document.getElementById('song-progress-bar');
  },

  watch: {},

  computed: {
    songProgress() {
      return this.$store.state.audio.songProgress;
    },

    currentTrackTime() {
      return this.$store.state.audio.currentTrackTime;
    },

    isPlaying() {
      return this.$store.state.audio.isPlaying;
    },

    audioIsLoading() {
      return this.$store.state.audio.audioIsLoading;
    },

    currentSound() {
      const soundFile = this.$store.state.audio.currentSound;
      const duration = this.$store.state.audio.duration;
      const formattedFilename = Utils.formatAudioFilename(soundFile);

      const currentSound = {};
      currentSound.title = formattedFilename.title;
      currentSound.artist = formattedFilename.artist;
      currentSound.duration = Utils.formatTime(duration) || 'Duration';

      return currentSound;
>>>>>>> vyzby-app
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
<<<<<<< HEAD
  width: $secondary-menu-width;
  min-height: 67px;
  text-align: center;
  padding: 10px;
=======
  width: 450px;
  min-height: 67px;
  text-align: center;
  padding: 10px;
}

#song-progress-bar {
  margin: 3px 0;
}

#progress-click-wrapper {
  width: 100%;
  height: 10px;
  cursor: pointer;
}

#song-artist {
  margin-bottom: initial;
}

#song-name {
  font-weight: bold;
}

#audio-sketch-container {
  display: none;
>>>>>>> vyzby-app
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
