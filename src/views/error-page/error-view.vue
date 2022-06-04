<template>
    <section class="vh-100 gradient-custom ">
      <div class="error-container">
        <h1>{{errorCode + " - " + errorMessage}}</h1>
      </div>
    </section>
</template>
<script>
  import './error-view.css'
  export default {
    name: 'ErrorView',
    props: {
      errorCode: Number,
      errorMessage: String
    }
  }
</script>