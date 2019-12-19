<template lang="pug">
  .user-login-pane
    v-form(
      @submit.prevent="submit"
      class="ma-2"
    )
      v-row
        v-col(md="6")
          v-text-field(
            label="First Name"
            v-model.trim="firstName"
            :error-messages="firstNameErrors"
            @input="$v.firstName.$touch()"
            @blur="$v.firstName.$touch()"
            required
          )
        v-col(md="6")
          v-text-field(
            label="Last Name"
            v-model.trim="lastName"
            :error-messages="lastNameErrors"
            @input="$v.lastName.$touch()"
            @blur="$v.lastName.$touch()"
            required
          )

      v-row
        v-col(md="12")
          v-text-field(
            type="email"
            label="Email"
            :error-messages="emailErrors"
            required
            validate-on-blur
            v-model="email"
          )

      v-row
        v-col(md="12")
          v-text-field(
            label="Userame"
            :error-messages="usernameErrors"
            required
            @blur="$v.username.$touch()"
            v-model="username"
          )

      v-row
        v-col(md="12")
          v-text-field(
            type="password"
            label="Password"
            :error-messages="passwordErrors"
            validate-on-blur
            required
            v-model.trim="password"
          )
      v-row
        v-col(md="12")
          v-text-field(
            type="password"
            label="Confirm Password"
            :error-messages="passwordConfirmErrors"
            @blur="$v.passwordConfirm.$touch()"
            required
            v-model.trim="passwordConfirm"
          )



      h5.text-center Already have an account?
      p.account-creation(
        @click="updateLoginPane('userLogin')"
        class="text-center"
      ) login

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
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';

export default {
  validations: {
    username: { required, minLength: minLength(6) },
    password: { required },
    passwordConfirm: { required, sameAsPassword: sameAs('password') },
    firstName: { required, minLength: minLength(2) },
    lastName: { required, minLength: minLength(2) },
    email: { required, email },
  },

  data: () => ({
    username: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
    email: '',
    submitStatus: '',
    isLoggedIn: false,
  }),

  computed: {
    firstNameErrors() {
      const errors = [];
      if (!this.$v.firstName.$dirty) return errors;
      !this.$v.firstName.required && errors.push('First name is required.');
      !this.$v.firstName.minLength && errors.push('First name must be at least 2 characters long.');
      return errors;
    },

    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;
      !this.$v.lastName.required && errors.push('Last name is required.');
      !this.$v.lastName.minLength && errors.push('Last name must be at least 2 characters long.');
      return errors;
    },

    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.required && errors.push('Email is required.');
      !this.$v.email.email && errors.push('Must be a valid email.');
      return errors;
    },

    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.required && errors.push('Userame is required.');
      !this.$v.username.minLength && errors.push('Userame must be at least 6 characters long.');
      return errors;
    },

    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push('Password is required.');
      this.password !== 'VYZBY' && errors.push('Password must be "VYZBY".');
      return errors;
    },

    passwordConfirmErrors() {
      const errors = [];
      if (!this.$v.passwordConfirm.$dirty) return errors;
      !this.$v.passwordConfirm.required && errors.push('Password confirmation is required.');
      !this.$v.passwordConfirm.sameAsPassword && errors.push("Passwords don't match");
      return errors;
    },
  },

  methods: {
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR';
      } else {
        this.submitStatus = 'PENDING';
        setTimeout(() => {
          this.submitStatus = 'OK';
          const userObj = {
            loggedIn: true,
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName
          };
          localStorage.setItem('user', JSON.stringify(userObj));

          this.$v.$reset();
          this.isLoggedIn = true;
          (this.submitStatus = null), (this.username = '');
        }, 500);
      }
    },

    updateLoginPane(toLocation) {
      this.$emit('update_login_pane', toLocation);
    },

    clear() {
      this.$v.$reset();
      this.username = '';
      this.email = '';
    },
  },
};
</script>
