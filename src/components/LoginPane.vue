<template lang="pug">
  v-form( @submit.prevent="submit")
    .form-group(:class="{ 'form-group--error': $v.username.$error }")
      .login-pane( v-if="loginPane === 'userLogin'")
        v-text-field(
          label="Userame"
          required
          :rules="usernameRules"
          :counter=25
          v-model.trim="$v.username.$model"
        )
        v-text-field(
          type="password"
          label="Password"
          required
          v-model.trim="$v.username.$model"
        )

        h5.text-center Don't Have an Account?
        h6#account-creation(
          @click="loginPane = 'createAccount'"
          class="text-center"
        ) create account

      #account-creation-pane( v-if="loginPane === 'createAccount'")
        v-text-field(
          label="First Name"
          required
          :rules="usernameRules"
          :counter=25
          v-model.trim="$v.firstName.$model"
        )
        v-text-field(
          label="Last Name"
          required
          :rules="usernameRules"
          :counter=25
          v-model.trim="$v.lastName.$model"
        )
        v-text-field(
          label="Email"
          type="email"
          required
          :rules="usernameRules"
          :counter=25
          v-model.trim="$v.email.$model"
        )
        v-text-field(
          label="Userame"
          required
          :rules="usernameRules"
          :counter=25
          v-model.trim="$v.password.$model"
        )
        v-text-field(
          type="password"
          label="Password"
          required
          v-model.trim="$v.confirmPassword.$model"
        )

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
      username: '',
      usernameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 6) || 'Name must be at least 6 characters',
      ],
      passwordRules: [
        v => v === 'VYZBY' || 'Password must be "VYZBY"'
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
          this.submitStatus = null,
          this.username = '';
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
