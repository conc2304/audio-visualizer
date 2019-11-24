<template lang="pug">

  .parameter-category-group-wrapper
    .parameter-wrapper(
      v-for="(parameter, i) in sketchCategoryParameters"
      :key="i"
    )
      span {{ parameter.displayLabel }}-
      span {{ parameter.currentValue }}


</template>

<script>
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

  mounted() {
    this.sketchCategoryParameters = this.getCategoryParameters();
  },

  methods: {
    getCategoryParameters() {
      let properties = [];
      const validPropTypes = ['numeric', 'variable', 'boolean'];

      console.log(this.category);
      console.log(this.sketchSelected);
      for (let parameter in this.sketchSelected) {
        let thisParameter = this.sketchSelected[parameter];

        if (
          thisParameter.category !== this.category ||
          !validPropTypes.includes(thisParameter.attrType)
        ) {
          continue;
        }

        properties.push(thisParameter);

        console.log(parameter);
        console.log(thisParameter);
      }

      return properties;
    },
  },
};
</script>
