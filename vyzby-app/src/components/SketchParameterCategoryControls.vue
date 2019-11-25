<template lang="pug">

  .parameter-category-group-wrapper
    .parameter-wrapper(
      v-for="(parameter, i) in sketchCategoryParameters"
      :key="i"
    )

      SketchParameterControl(
        :sketchSelected="sketchSelected"
        :parameter="parameter"
      )



</template>

<script>
import SketchParameterControl from "@/components/SketchParameterControl.vue";

export default {
  data: () => ({
    sketchCategoryParameters: '',
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
    SketchParameterControl
  },

  mounted() {
    this.sketchCategoryParameters = this.getCategoryParameters();
  },

  methods: {
    getCategoryParameters() {
      let properties = [];
      const validPropTypes = ['numeric', 'variable', 'boolean'];

      for (let parameter in this.sketchSelected) {
        let thisParameter = this.sketchSelected[parameter];

        if (
          thisParameter.category !== this.category ||
          !validPropTypes.includes(thisParameter.attrType)
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
