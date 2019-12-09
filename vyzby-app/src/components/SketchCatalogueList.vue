

<template lang="pug">
  v-card#sketch-catalogue-list(
    max-width="500"
    class="mx-auto"
  )

    v-app-bar(
      dark
      color="black"
    )

      v-toolbar-title Sketch Catalogue

      v-spacer

      v-btn( icon)
        v-icon mdi-magnify

    v-container
      v-row( dense)
        v-col( cols="12")
          v-card(
            color="#385F73"
            dark
          )
            v-card-title.headline Unlimited music now

            v-card-subtitleListen to your favorite artists and albums whenever and wherever, online and offline.

            v-card-actions
              v-btn( text) SELECT

        v-col(
          v-for="(item, i) in 3"
          :key="i"
          cols="12"
        )
          v-card(
            :color="item.color"
            dark
          )
            .card-wrapper( class="d-flex flex-no-wrap justify-space-between")
              .card-inner-wrapper
                v-card-title(
                  class="headline"
                  v-text='test'
                )

                v-card-subtitle( v-text="subtext")
              </div>

              v-avatar(
                class="ma-3"
                size="125"
                tile
              )
                v-img( )
</template>

<script>

export default {
  components: {
  }
}
</script>

<style lang="scss" scoped>
#sketch-catalogue-list {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

</style>
