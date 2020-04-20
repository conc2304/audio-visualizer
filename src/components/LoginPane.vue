<template lang="pug">
  v-container#login-container
    LoginUserPane(
      v-if="loginPane === 'userLogin'"
      @update_login_pane="updateLoginPane"
    )
    LoginRegistrationPane(
      v-if="loginPane === 'registration'"
      @update_login_pane="updateLoginPane"
    )

</template>

<script>
import LoginUserPane from "@/components/LoginUserPane.vue";
import LoginRegistrationPane from "@/components/LoginRegistrationPane.vue";

export default {
  data: () => ({
    loginPane: "userLogin",
  }),

  components: {
    LoginUserPane,
    LoginRegistrationPane,
  },

  methods: {
    updateLoginPane(paneLocation) {
      this.loginPane = paneLocation;
    },
  },
};
</script>

<style lang="scss">
/* Change Autocomplete styles in Chrome*/

#login-container {
  padding: 2rem 4rem;

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  input:-internal-autofill-selected,
  select:-webkit-autofill:focus {
    background-color: transparent;
    box-shadow: 0 0 0px 1000px #000 inset;
    -webkit-box-shadow: 0 0 0px 1000px #000 inset;
    -webkit-text-fill-color: #fff;
  }

  .account-creation {
    margin: 0 auto;
    &:hover {
      text-decoration: underline;
    }
  }
  .error {
    text-align: center;
  }

  .submission-wrapper {
    margin: 2rem auto 0;
    text-align: center;
  }

  .submit-status {
    margin-top: 10px;
  }
}
</style>
