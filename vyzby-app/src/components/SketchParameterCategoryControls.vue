<template lang="pug">

  .parameter-category-group-wrapper

    .parameter-wrapper(
      v-for="(parameter, i) in numericAttributes"
      :key="i"
    )
      SketchParameterControlNumeric(
        :sketchIndexSelected="sketchIndexSelected"
        :RegisteredSketches="RegisteredSketches"
        :parameter="parameter"
      )

</template>

<script>
import SketchParameterControlNumeric from '@/components/SketchParameterControlNumeric.vue';

export default {
  data: () => ({
    SketchParameterControlNumeric: '',
    numericAttributes: null,
  }),

  props: {
    sketchIndexSelected: {
      type: Number,
    },
    category: {
      type: String,
    },
    RegisteredSketches: {
      type: Array,
    },
  },

  components: {
    SketchParameterControlNumeric,
  },

  mounted() {
    this.numericAttributes = this.getCategoryParameters('numeric');
    this.booleanAttributes = this.getCategoryParameters('boolean');
    this.variableAttributes = this.getCategoryParameters('variable');
  },

  methods: {
    getCategoryParameters(attributeType) {
      let properties = [];
      const validPropTypes = ['numeric', 'variable', 'boolean'];

      for (let parameter in this.RegisteredSketches[this.sketchIndexSelected]) {
        let thisParameter = this.RegisteredSketches[this.sketchIndexSelected][parameter];

        if (
          thisParameter.category !== this.category ||
          !validPropTypes.includes(thisParameter.attrType) ||
          thisParameter.attrType !== attributeType
        ) {
          continue;
        }

        properties.push(thisParameter);
      }

      return properties;
    },
  },

  watch: {
    sketchIndexSelected(newValue, oldValue) {
      // this.numericAttributes = this.getCategoryParameters('numeric');
      // this.booleanAttributes = this.getCategoryParameters('boolean');
      // this.variableAttributes = this.getCategoryParameters('variable');
    },
  },
};
</script>
