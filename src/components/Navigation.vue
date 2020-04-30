<template lang="pug">
  .nav-wrapper
    nav
      ul
        li( v-for="route in routesByType" :key="route.name")
          router-link(:to="route.path" exact) {{ route.name }}
    router-view
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as Routing from "@/router";

@Component<Navigation>({
  components: {},
})
export default class Navigation extends Vue{
  constructor() {
    super();
  }

  // PROPS
  @Prop({ type: String, default: "" }) navType!: String;

  // LIFECYCLE HOOKS
  mounted(): void {
  }
  // COMPONENT DATA

  // COMPUTED PROPERTIES
  get routesByType() {
    if (!this.navType) return Routing.routes;
    return Routing.routes.filter(r => r.path.indexOf(`/${this.navType}`) === 0);
  }
}
</script>
