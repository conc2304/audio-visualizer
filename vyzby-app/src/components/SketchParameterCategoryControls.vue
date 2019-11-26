<template lang="pug">

  .parameter-category-group-wrapper

    .parameter-wrapper(
      v-for="(parameter, i) in numericAttributes"
      :key="i"
    )
      SketchParameterControlNumeric(
        :sketchSelected="sketchSelected"
        :parameter="parameter"
      )

</template>

<script>
import SketchParameterControlNumeric from "@/components/SketchParameterControlNumeric.vue";

export default {
  data: () => ({
    SketchParameterControlNumeric: '',
    numericAttributes: null,
  }),

  props: {
    sketchSelected: {
      type: Object,
    },
    category: {
      type: String,
    },
  },

  components: {
    SketchParameterControlNumeric
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

      for (let parameter in this.sketchSelected) {
        let thisParameter = this.sketchSelected[parameter];

        console.log('TESETING');
        console.log(this.sketchSelected.constructor.name);
        console.log(parameter);

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
};
</script>
