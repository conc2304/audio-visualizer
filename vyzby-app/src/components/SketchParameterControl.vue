<template lang="pug">
  .sketch-parameter-control

    span {{ parameter.displayLabel }}

    v-radio-group(
      row
      v-if="parameter.attrType === 'variable'"
      dark
    )
      v-radio(
        v-for="(option, i) in parameter.options"
        :label="option"
        :value="option"
        color="#0e83cd"
        dark
        :key="i"
      )
    v-switch(
      v-if="parameter.attrType === 'boolean'"
    )



</template>
