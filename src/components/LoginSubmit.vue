<template lang="pug">
  .submission-wrapper
    v-btn(
      type="submit"
      :disabled="submitStatus === 'PENDING'"
       large color="color_primary_blue" outlined
    ) Submit

    p.submit-status(v-if="submitStatus === 'OK'") Thanks for your submission!
    p.submit-status(v-if="submitStatus === 'ERROR'") Please fill the form correctly.
    p.submit-status(v-if="submitStatus === 'PENDING'") Sending...
</template>

<script>
export default {};
</script>
