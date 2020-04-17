<template lang="pug">
  .user-login-pane
    v-form(
      @submit.prevent="submit"
      class="ma-2"
    )
      v-text-field(
        label="Userame"
        v-model.trim="username"
        :error-messages="usernameErrors"
        @input="$v.username.$touch()"
        @blur="$v.username.$touch()"
        required
      )
      v-text-field(
        type="password"
        label="Password"
        :error-messages="passwordErrors"
        required
        @blur="$v.password.$touch()"
        v-model="password"
      )

      h5.text-center Don't have an account?
      p.account-creation(
        @click="updateLoginPane('registration')"
        class="text-center"
      ) Create Account

      .submission-wrapper
        v-btn(
          v-if="!isLoggedIn"
          type="submit"
          :disabled="submitStatus === 'PENDING'"
           large color="color_primary_blue" outlined
        ) Submit

        v-btn(
          v-else
          to="/playground"
           large color="color_primary_blue" outlined
        ) Go Play

        p.submit-status(v-if="submitStatus === 'OK'") Thanks for your submission!
        p.submit-status(v-if="submitStatus === 'ERROR'") Please fill the form correctly.
        p.submit-status(v-if="submitStatus === 'PENDING'") Sending...

</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";

export default {
  validations: {
    username: { required, minLength: minLength(6) },
    password: { required },
  },

  data: () => ({
    username: "",
    password: "",
    submitStatus: "",
    isLoggedIn: false,
  }),

  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      const minLengthValid =
        !this.$v.username.minLength &&
        errors.push("Name must be at least 6 characters long");
      const requiredValid =
        !this.$v.username.required && errors.push("Name is required.");
      return errors;
    },

    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      const requiredValid =
        !this.$v.password.required && errors.push("Password is required.");
      const passwordValid =
        this.password !== "VYZBY" &&
        errors.push('TESTING Password must be "VYZBY".');
      return errors;
    },
  },

  methods: {
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
      } else {
        this.submitStatus = "PENDING";
        setTimeout(() => {
          this.submitStatus = "OK";
          const userObj = {
            loggedIn: true,
            username: this.username,
          };
          localStorage.setItem("user", JSON.stringify(userObj));

          this.$v.$reset();
          this.isLoggedIn = true;
          (this.submitStatus = null), (this.username = "");
        }, 500);
      }
    },

    updateLoginPane(toLocation) {
      this.$emit("update_login_pane", toLocation);
    },

    clear() {
      this.$v.$reset();
      this.username = "";
      this.email = "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
