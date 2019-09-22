<template>
  <div class="about">
    <AboutDetails />
  </div>
</template>


<script>
// @ is an alias to /src
import AboutDetails from "@/components/AboutDetails.vue";

export default {
  name: "home",
  components: {
    AboutDetails
  }
};
</script>