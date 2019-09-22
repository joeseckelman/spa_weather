<template>
  <div class="home">
    <WeatherProcess />
  </div>
</template>

<script>
// @ is an alias to /src
import WeatherProcess from "@/components/WeatherProcess.vue";

export default {
  name: "home",
  components: {
    WeatherProcess
  }
};
</script>
