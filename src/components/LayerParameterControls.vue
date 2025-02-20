<template lang="pug">

  .parameter-category-group-wrapper
    .numeric-parameters-wrapper
      .parameter-wrapper(
        v-for="(parameter, i) in numericAttributes"
        :key="`numeric-${i}`"
      )
        ParameterControlNumeric(
          :parameter="parameter"
          :parameterIndex="i"
          :categoryIndex="categoryIndex"
        )

    v-divider
    .variable-parameters-wrapper
      .parameter-wrapper(
        v-for="(parameter, i) in variableAttributes"
        :key="`variable-${i}`"
      )
        ParameterControlVariable(
          :parameter="parameter"
        )

</template>

<script>
import ParameterControlNumeric from '@/components/ParameterControlNumeric.vue';
import ParameterControlVariable from '@/components/ParameterControlVariable.vue';

export default {
  data: () => ({
    numericAttributes: null,
    variableAttributes: null,
  }),

  props: {
    category: {
      type: String,
    },

    categoryIndex: {
      type: Number,
    },
  },

  components: {
    ParameterControlNumeric,
    ParameterControlVariable,
  },

  mounted() {
    this.numericAttributes = this.getCategoryParameters('numeric');
    this.booleanAttributes = this.getCategoryParameters('boolean');
    this.variableAttributes = this.getCategoryParameters('variable');
  },

  updated() {
    console.log('UPDATED', 'Layer Parameter Control');
  },

  methods: {
    getCategoryParameters(attributeType) {
      console.log('getCategoryParameters');
      const properties = [];
      const validPropTypes = ['numeric', 'variable', 'boolean'];
      const { RegisteredSketches, sketchIndexSelected, category } = this;

      for (const parameter in RegisteredSketches[this.sketchIndexSelected]) {
        if (
          !RegisteredSketches[sketchIndexSelected].hasOwnProperty(parameter)
        ) {
          continue;
        }
        const thisParameter =
          RegisteredSketches[sketchIndexSelected][parameter];

        if (
          thisParameter.category !== category ||
          !validPropTypes.includes(thisParameter.attrType) ||
          thisParameter.attrType !== attributeType
        ) {
          continue;
        }

        thisParameter.attrName = parameter;
        properties.push(thisParameter);
      }

      return properties;
    },
  },

  computed: {
    sketchIndexSelected() {
      return this.$store.state.sketchIndexSelected;
    },

    RegisteredSketches() {
      return this.$store.state.RegisteredSketches;
    },
  },
};
</script>

<style lang="scss">
.numeric-parameters-wrapper {
  margin-bottom: 2rem;
}

p.parameter-title {
  margin: 25px auto 15px;
}
.v-input--radio-group {
  margin-top: initial;

  .v-input__slot {
    margin-bottom: 0;
  }
}

.noUi-target {
  margin: 10px 0;
}
</style>
