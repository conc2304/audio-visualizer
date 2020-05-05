<template lang="pug">
  #threejs-tut-wrapper
    h1 {{ pageTitle}}
    Navigation( :navType="'threejs'")
    #threejs-canvas
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Navigation from "@/components/Navigation.vue";

@Component({
  components: {
    Navigation,
  }
})
export default class ThreeJsCanvasWrapper extends Vue {
  constructor() {
    super();
  }
  // PROPS
  @Prop({ type: String, default: "Page Title"}) pageTitle!: String;

  // COMPONENT DATA

  // LIFECYCLE HOOKS
  mounted(): void {}
  created(): void {}
  beforeUpdate(): void {}

  // PRIVATE PROPERTIES

  // PRIVATE METHODS
}
</script>
