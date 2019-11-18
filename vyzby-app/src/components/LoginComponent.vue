<template lang="pug">
  v-form( @submit.prevent="submit")
    .form-group(:class="{ 'form-group--error': $v.username.$error }")
      v-text-field(
        label="Userame"
        required
        :rules="usernameRules"
        :counter=25
        v-model.trim="$v.username.$model"
      )
    //- .error(v-if="!$v.username.required") Username is required
    //- .error(v-if="!$v.username.minLength")
    //-   | Username must have at least {{$v.username.$params.minLength.min}} letters.

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
      username: '',
      usernameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 6) || 'Name must be at least 6 characters',
      ],
      submitStatus: null,
    };
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
        // do your submit logic here
        this.submitStatus = 'PENDING';
        setTimeout(() => {
          this.submitStatus = 'OK';
          localStorage.setItem('user', JSON.stringify(this.username));
        }, 500);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
