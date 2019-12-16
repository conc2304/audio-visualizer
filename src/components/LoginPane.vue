<template lang="pug">
  v-container#login-container
    v-form( @submit.prevent="submit")
      .form-group(:class="{ 'form-group--error': $v.username.$error }")
        .login-pane( v-if="loginPane === 'userLogin'")
          v-text-field(
            label="Userame"
            required
            :rules="usernameRules"
            v-model.trim="$v.username.$model"
          )

          v-text-field(
            type="password"
            label="Password"
            required
            validate-on-blur
            :rules="passwordRules"
            v-model="password"
          )

          h5.text-center Don't Have an Account?
          h6#account-creation(
            @click="loginPane = 'createAccount'"
            class="text-center"
          ) create account

        #account-creation-pane( v-if="loginPane === 'createAccount'")
          v-row
            v-col(md="6")
              v-text-field(
                label="First Name"
                required
                :rules="nameRules"
                v-model.trim="firstName"
              )
            v-col(md="6")
              v-text-field(
                label="Last Name"
                required
                :rules="nameRules"
                v-model.trim="lastName"
              )
          v-row
            v-col(md="12")
              v-text-field(
                label="Email"
                type="email"
                required
                :rules="emailRules"
                v-model.trim="email"
              )
          v-row
            v-col(md="12")
              v-text-field(
                label="Userame"
                required
                :rules="nameRules"
                v-model.trim="username"
              )
          v-row
            v-col(md="12")
              v-text-field(
                type="password"
                label="Password"
                :rules="passwordRules"
                validate-on-blur
                required
                v-model.trim="password"
              )
          v-row
            v-col(md="12")
              v-text-field(
                type="password"
                label="Confirm Password"

                required
                v-model.trim="passwordConfirm"
              )

              h5.text-center Already have an account?
              h6#account-creation(
                @click="loginPane = 'userLogin'"
                class="text-center"
              ) login

      .submission-wrapper
        v-btn(
          type="submit"
          :disabled="submitStatus === 'PENDING'"
          dark large color="#0e83cd" outlined
        ) Submit

        p.submit-status(v-if="submitStatus === 'OK'") Thanks for your submission!
        p.submit-status(v-if="submitStatus === 'ERROR'") Please fill the form correctly.
        p.submit-status(v-if="submitStatus === 'PENDING'") Sending...
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      loginPane: 'userLogin',
      password: '',
      passwordConfirm: '',
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      usernameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 6) || 'Name must be at least 6 characters',
      ],

      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 3) || 'Name must be at least 3 characters',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v === 'VYZBY' || 'Password must be "VYZBY"',
      ],
      passwordConfirmRules: [
        v => !!v || 'Password confirmation required',
        v => v === this.password || 'Passwords do not match',
      ],

      emailRules: [
        v =>
          v.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          ) || 'Invalid Email address',
      ],

      submitStatus: null,
    };
  },

  props: {
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },

  validations: {
    username: {
      required,
      minLength: minLength(6),
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
          };
          localStorage.setItem('user', JSON.stringify(userObj));

          this.$emit('user_login_event', userObj);

          this.$v.$reset();
          (this.submitStatus = null), (this.username = '');
        }, 500);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#account-creation:hover {
  text-decoration: underline;
}
.error {
  text-align: center;
}

.submission-wrapper {
  margin: 20px auto 0;
  text-align: center;
}

.submit-status {
  margin-top: 10px;
}
</style>

<style lang="scss">
/* Change Autocomplete styles in Chrome*/

#login-container {
  input:-internal-autofill-selected,
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    background-color: transparent;
    -webkit-box-shadow: 0 0 0px 1000px #000 inset;
    -webkit-text-fill-color: #fff;
  }
}
</style>
