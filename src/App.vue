<template lang="pug">
  v-app
    v-content
      router-view
</template>

<script>
export default {
  name: 'App',
  components: {},
  data: () => ({}),
  events: {},
};
</script>

<style lang="scss">
html {
  overflow-y: hidden !important ;
}

#settings-menubar {
  i.menu-icon {
    color: $color-primary-blue;
    cursor: pointer;

    &.off {
      color: $color-std-grey;
    }
  }

  i.menu-icon:hover {
    color: $color-secondary-blue;
  }

  .active {
    border: 1px solid $color-secondary-blue;
  }

  i.menu-icon.inactive {
    color: $color-inactive-red-hover;
  }

  .inactive {
    i {
      color: $color-inactive-red;

      &:hover {
        color: $color-inactive-red-hover;
      }
    }
  }
}

.slider-wrapper {
  .noUi-tooltip {
    border-radius: 0 50% 50%;
  }
  .noUi-horizontal .noUi-tooltip {
    bottom: initial;
    top: 32px;

    &::after {
      background-color: black;
      position: absolute;
      top: 21px;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      right: -23px;
      font-size: 0.9rem;
      padding: 2px 5px;
      border-radius: 2px;
    }
  }

  .noUi-base :nth-child(2) .noUi-tooltip::after {
    content: 'min';
  }

  .noUi-base :nth-child(4) .noUi-tooltip::after {
    content: 'max';
  }

  .noUi-handle-draggable-tooltip-overlay {
    top: 22px;
  }

  &.color-slider .noUi-connects::after {
    content: '';
    background: linear-gradient(
      to right,
      red,
      orange,
      yellow,
      lime,
      cyan,
      cyan,
      blue,
      indigo,
      magenta,
      red
    );
    width: 100%;
    height: 2px;
    position: absolute;
    z-index: 2;
  }

  &.saturation-slider .noUi-connects::after {
    content: '';
    background: linear-gradient(
      to right,
      white,
      $color-primary-blue
    );
    width: 100%;
    height: 2px;
    position: absolute;
    z-index: 2;
  }
}
</style>
