// By James Furey at https://github.com/furey -  https://github.com/furey/vue-trunquee/blob/master/src/components/Trunquee.vue

<template lang="pug">
  .trunquee(
    ref="text"
    :style="styles"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    v-html="displayText"
  )
</template>

<script>
export default {
  props: {
    text: {
    },
    speed: {
      type: Number,
      default: 85,
    },
    cursor: {
      type: String,
      default: 'help',
    },
  },
  data: () => ({
    displayText: '',
    interval: null,
  }),
  computed: {
    styles() {
      return {
        cursor: this.interval ? this.cursor : 'default',
      };
    },
  },
  watch: {
    text: {
      immediate: true,
      handler() {
        if (!this.interval) this.resetText();
      },
    },
  },
  mounted() {
    this.$text = this.$refs.text;
  },
  methods: {
    onEnter() {
      if (this.interval || !this.isTruncated()) return;
      this.interval = setInterval(() => {
        if (!this.isTruncated()) return clearInterval(this.interval);
        this.displayText = this.displayText.slice(1);
        while (this.displayText.charAt() === ' ') {
          this.displayText = this.displayText.slice(1);
        }
      }, this.speed);
    },
    onLeave() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = false;
      }
      this.resetText();
    },
    isTruncated() {
      return this.getTruncatedDistance() > 0;
    },
    getTruncatedDistance() {
      return this.$text.scrollWidth - this.$text.clientWidth;
    },
    resetText() {
      this.displayText = this.text;
    },
  },
};
</script>

<style scoped>
.trunquee {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
