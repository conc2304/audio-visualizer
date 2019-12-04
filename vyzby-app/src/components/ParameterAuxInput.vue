<template lang="pug">
  .aux-input-wrapper
    .keyboard-wrapper
      v-text-field(
        v-model="keyboardKey"
        autocomplete="off"
        validate-on-blur
        hint="Keystroke to trigger parameter change"
        placeholder="Keyboard Key"
        clearable
        clear-icon="close"
        color="blue"
        maxlength="1"
        @change="setKey()"
        @click:clear="clear"
        outlined
        dark
        dense
      )
      v-text-field(
        v-model="parameterValue"
        autocomplete="off"
        validate-on-blur
        hint="Parameter Value to set on keystroke"
        type="number"
        placeholder="Value"
        clearable
        clear-icon="close"
        color="blue"
        @change="setKey()"
        @click:clear="clear"
        outlined
        dark
        dense
      )
</template>

<script>
import KeyboardControlsService from '@/js/services/KeyboardControlsService';

export default {
  data: () => ({
    keyboardKey: null,
    parameterValue: null,
  }),

  props: {
    sketchIndexSelected: {
      type: Number,
    },
    parameter: {
      type: Object,
    },
    parameterName: {
      type: String,
    },
  },

  mounted() {

  },

  methods: {
    setKey() {
      KeyboardControlsService.setKeyboardControl(
        this.keyboardKey,
        this.parameterValue,
        this.parameter.attrName,
        this.sketchIndexSelected,
      );
    },

    testMin(value) {
      console.log(this.parameter);
      return value >= this.parameter.min;
    },

    setValue(event) {
      console.log(event);
      console.log(this.sketchSelected);
    },

    clear() {
      console.log('clear');
    },
  },
};
</script>

<style lang="scss" scoped>
.v-input {
}
</style>
