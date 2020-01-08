<template lang="pug">
  #audio-control-panel
    #audio-sketch-container
    #audio-player
      .song-info
        p#song-artist(
          v-show="currentSong.artist"
        ) {{ currentSong.artist }}
        p#song-name  {{ currentSong.title }}
        p#song-time  {{ currentTrackTime}}
    .song-progress
      v-progress-linear#loading-bar(
        v-show="audioIsLoading"
        indeterminate
        striped
        rounded
      )
      v-progress-linear#song-progress-bar(
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

        v-btn( @click="" text icon)
          v-icon.menu-icon skip_previous
        v-btn( @click="toggleAudioState()" text icon)
          v-icon.menu-icon {{ isPlaying ? 'pause' : 'play_arrow' }}
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
          id="file"
          ref="file"
          accept="audio/*"
          multiple
          @change="onFileChange"
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
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';

let p5i;

export default {
  data: () => ({
    playlistOpen: false,
  }),

  components: {
    AudioPlaylist,
  },

  methods: {
    triggerFileUpload() {
      this.$refs.file.click();
    },

    setActiveSong(songObj) {
      this.currentSong = songObj;
    },

    onFileChange() {
      this.tracks = this.$refs.file.files;
      if (!this.tracks.length) return;

      AudioPlayerService.audioUploaded(this.tracks, p5i);
    },

    toggleAudioState() {
      AudioPlayerService.toggleAudioState(p5i);
    },
  },

  mounted() {
    p5i = new p5(AudioAnalyzer, 'audio-sketch-container');

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

    currentSong() {
      let sound = this.$store.state.audio.currentSound;
      let duration = this.$store.state.audio.duration;
      let currentSound = {};

      if (!sound.size) {
        currentSound = {
          title: 'Song Name',
          artist: 'Artist',
          duration: 'Duration',
        };
      } else {
        if (sound.name) {
          const filename = sound.name.substring(0, sound.name.lastIndexOf('.'));

          currentSound.artist = filename.lastIndexOf('-')
            ? filename.substring(0, filename.lastIndexOf('-')).trim()
            : '';

          currentSound.title = filename.indexOf('-')
            ? filename.substring(filename.indexOf('-') + 1).trim()
            : filename;

          const seconds = Math.floor(duration % 60);
          const minutes = Math.floor(duration / 60);
          const time = ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);
          currentSound.duration = time || 'Duration';
        }
      }

      return currentSound;
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
  width: $secondary-menu-width;
  min-height: 67px;
  text-align: center;
  padding: 10px;
}

.progress {
  display: none;
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
</style>
