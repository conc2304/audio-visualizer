<template lang="pug">
  .nav-wrapper
    nav
      ul
        li( v-for='route in routesbyType' :key='route.name')
          router-link(:to="route.path" exact) {{ route.name }}
    router-view
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import routes from "@/router";

console.log(routes);
@Component<Navigation>({
  components: {},
})
export default class Navigation extends Vue {
  constructor() {
    super();
    // private routes: Object = Router.options.routes
    // private routes: Array<Object>
  }

  // PROPS
  @Prop({ type: String, default: "" }) navType!: String;

  // LIFECYCLE HOOKS
  mounted(): void {
    // this.routes = Router.options?.routes
  }
  // COMPONENT DATA
  // private routes: Array<any> = Router.

  // COMPUTED PROPERTIES
  private get routesByType() {
    // console.log("this.routes");
    // console.log(this.routes);
    // if (!this.navType) return this.routes;

    // return this.routes.filter(r => r.path.indexOf(`/${this.navType}`) === 0);
    return;
  }
}
</script>
