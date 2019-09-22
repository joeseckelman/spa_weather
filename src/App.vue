<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <a class="logo" href="/">
          <span>Weather</span>
          <span class="font-weight-light">App</span>
        </a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div id="nav" class="d-none d-md-inline">
        <router-link to="/">Home</router-link> | 
        <router-link to="/about">About</router-link>
      </div>
      <v-btn
        color=""
        href="https://github.com/joeseckelman/spa_weather"
        target="_blank"
        class="d-none d-md-inline"
      >
        <span class="mr-2">Git Hub Repo</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <v-menu offset-y color="white">
        <template v-slot:activator="{on}">
          <v-btn
              color="primary"
              dark
              v-on="on" 
              class="d-inline d-md-none"
            >
              Menu
            </v-btn>
        </template>
        <v-divider></v-divider>
        <router-link to="/">Home</router-link><br />
        <router-link to="/about">About</router-link>
        <v-divider></v-divider>
        <v-btn
          color=""
          href="https://github.com/joeseckelman/spa_weather"
          target="_blank"
        >
          <span class="mr-2">Git Hub Repo</span>
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </v-menu>
    </v-app-bar>
    <div id="app" class="site-content mt-3">
      <div class="content-block">
        <router-view/>
      </div>
    </div>
  </v-app>
</template>

<style lang="scss">
.bolded {
  font-weight:bold;
  text-decoration: none;
}
@mixin nav-behaviors{
  a {   
    font-weight: bold;
    color: #2c3e50;
    @extend .bolded;
    &.router-link-exact-active {
      color: #42b983;
    }  
  }
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  > .content-block {
    margin-top:3em;
  }
  a {
    &.logo{
      color:inherit;
      font-weight: inherit;
      text-decoration: none;
    }
  }
}
.v-menu__content{
  background-color:white;
  @include nav-behaviors;
}
#nav {
  padding: 30px;
  @include nav-behaviors;
}
</style>

<script>
  export default {
    data () {
      return {
        drawer: null,
        items: [
          { title: 'Home', icon: 'dashboard' },
          { title: 'About', icon: 'question_answer' },
        ],
      }
    },
  }
</script>