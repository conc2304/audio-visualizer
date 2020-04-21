<template lang="pug">
  #audio-control-panel
    #audio-sketch-container

    .close-audio-player
      v-icon(
        @click="audioPlayerClose"
      ) close


    #audio-player
      .song-info( v-if="currentSound !== false")
        p#song-artist(
          v-show="currentSound.artist"
        ) {{ currentSound.artist }}
        p#song-name  {{ currentSound.title }}
        p#song-time  {{ currentTrackTime}}
      .upload-btn-wrapper( v-else)
        v-btn(
          @click="uploadAudioDialog = true"
          large color="color_primary_blue"
        ) Choose Music
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
          v-icon.menu-icon skip_next

        v-tooltip( right)
          template( v-slot:activator= "{ on }")
            v-btn#upload-file-button(
              @click="uploadAudioDialog = true"
              text icon
            )
              v-icon.menu-icon(
                v-on="on"
              ) unarchive
          span  Choose Music

      AudioPlaylist(
        v-show="playlistOpen"
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
import AudioPlaylist from "@/components/AudioPlaylist.vue";
import AudioLocalList from "@/components/AudioLocalList.vue";
import AudioAnalyzer from "@/js/sketches/SketchBaseAudioAnalyzer";
import APS from "@/js/services/AudioPlayerService";
import Utils from "@/js/services/Utils";
import p5 from "p5";
import "p5/lib/addons/p5.sound";

export default {
  data: () => ({
    playlistOpen: false,
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
      APS.toggleAudioState(this.p5);
    },

    toSongPosition(e) {
      if (!APS.audio) return;

      const percent = e.offsetX / e.target.offsetWidth;
      APS.audio.jump(APS.audio.duration() * percent);
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

      this.$store.commit("updateCurrentTrackIndex", nextIndex);
      APS.setupAudioAnalysis(tracks[nextIndex], true, this.p5);
    },

    audioPlayerClose() {
      this.$store.commit("updateAudioPlayerOpen", false);
    },
  },

  mounted() {
    console.log("mounted sound");
    APS.p5 = new p5(AudioAnalyzer, "audio-sketch-container");
    console.log(APS.p5.hasOwnProperty("loadSound"));
    APS.songTimeElem = document.getElementById("song-time");
    APS.songProgressElem = document.getElementById("song-progress-bar");
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

      if (formattedFilename === false) {
        return false;
      }

      const currentSound = {};
      currentSound.title = formattedFilename.title;
      currentSound.artist = formattedFilename.artist;
      currentSound.duration = Utils.formatTime(duration) || "Duration";

      return currentSound;
    },
  },
};
</script>

<style lang="scss" scoped>
#audio-control-panel {
  position: absolute;
  left: $master-menu-width;
  top: 0;
  border-left: 1px solid $color-std-grey;
  border-bottom: 1px solid $subtle-border;
  border-right: 1px solid $subtle-border;
  z-index: 1;
  background-color: #000;
  width: 450px;
  min-height: 67px;
  text-align: center;
  padding: 10px;
}

.upload-btn-wrapper {
  margin: 1rem auto;
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

.close-audio-player {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
