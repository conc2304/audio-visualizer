<template lang="pug">
  .aux-input-wrapper
    v-form.keyboard-wrapper(
      @submit.prevent="submit"
      lazy-validation
    )
      v-text-field(
        v-model="keyboardKey"
        autocomplete="off"
        hint="Keystroke to trigger parameter change (A-Z & 0-9)"
        placeholder="Keyboard Key"
        clearable
        clear-icon="close"
        color="blue"
        maxlength="1"
        @click:clear="clear('key')"
        @change="updateKeyValue()"
        :rules="[val => { return (testKeyStroke(val)) }]"
        :prepend-inner-icon="keyboardKeyUpdated ? 'check': ''"
        :disabled="parameter.lockOn"
        prepend-icon="keyboard"
        outlined
        dense
      )

      v-text-field(
        v-model="parameterValue"
        autocomplete="off"
        :hint="hint()"
        type="number"
        placeholder="Value"
        clearable
        clear-icon="close"
        color="blue"
        @click:clear="clear('value')"
        @change="updateParamValue()"
        :rules="[val => { return (testValueMinMax(val, parameter)) }]"
        :prepend-inner-icon="parameterValueUpdated ? 'check': ''"
        :disabled="parameter.lockOn"
        prepend-icon="keyboard"
        outlined
        dense
      )
</template>

<script>
import KeyboardControlsService from '@/js/services/KeyboardControlsService';

export default {
  data: () => ({
    valid: true,
    keyboardKey: null,
    parameterValue: null,
    keyboardKeyUpdated: false,
    parameterValueUpdated: false,
  }),

  props: {
    parameter: {
      type: Object,
    },
    parameterName: {
      type: String,
    },
  },

  mounted() {},

  methods: {
    submit() {
      const keyvalid = this.keyboardKey && this.testKeyStroke(this.keyboardKey);
      const paramValid =
        this.parameterValue && this.testValueMinMax(this.parameterValue, this.parameter);

      this.keyboardKeyUpdated = keyvalid === true;
      this.parameterValueUpdated = paramValid === true;

      setTimeout(() => {
        this.keyboardKeyUpdated = false;
        this.parameterValueUpdated = false;
      }, 700);
    },

    updateParamValue() {
      const paramValid =
        this.parameterValue && this.testValueMinMax(this.parameterValue, this.parameter);

      this.parameterValueUpdated = paramValid === true;

      setTimeout(() => {
        this.parameterValueUpdated = false;
      }, 700);
    },

    updateKeyValue() {
      const keyvalid = this.keyboardKey && this.testKeyStroke(this.keyboardKey);

      this.keyboardKeyUpdated = keyvalid === true;

      setTimeout(() => {
        this.keyboardKeyUpdated = false;
      }, 700);
    },

    setKey() {
      if (!this.keyboardKey || !this.parameterValue) {
        return;
      }
      KeyboardControlsService.setKeyboardControl(
        this.keyboardKey,
        this.parameterValue,
        this.parameter.attrName,
        this.sketchIndexSelected,
      );
    },

    testKeyStroke(value) {
      // alphabet charcodes fo A-Z = [65 - 90]
      // alphabet charcodes fo a-z = [97 - 122]
      // number 0-9 = [49 - 57]
      if (!value) {
        return true;
      }

      this.keyboardKey = value.toUpperCase();
      const keyVal = value.toUpperCase().charCodeAt(0);
      const validKey =
        this.isBetween(keyVal, 65, 90) ||
        this.isBetween(keyVal, 49, 57) ||
        this.isBetween(keyVal, 97, 122);

      if (validKey) {
        this.setKey();
        return true;
      } else {
        return 'Key must be either A-Z, or 0-9';
      }
    },

    testValueMinMax(value, parameter) {
      if (!value || !parameter) {
        return true;
      }
      if (value < parseFloat(parameter.min)) {
        return `Value must be more than ${parameter.min}`;
      }
      if (value > parseFloat(parameter.max)) {
        return `Value must be less than ${parameter.max}`;
      }

      this.setKey();

      return true;
    },

    isBetween(x, min, max) {
      return x >= min && x <= max;
    },

    hint() {
      return `Parameter Value to set on keystroke (${this.parameter.min} - ${this.parameter.max})`;
    },

    clear(type) {
      this.setKey();
    },
  },

  computed: {
    sketchIndexSelected() {
      return this.$store.state.sketchIndexSelected;
    },
  },
};
</script>

<style lang="scss">
.aux-input-wrapper .v-input__icon--prepend .v-icon {
  color: $color-std-grey
}
</style>
