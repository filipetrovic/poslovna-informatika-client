<template>
  <div id="app">
    <header class="header-container">
      <header-component class="header"></header-component>
    </header>

    <router-view></router-view>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import HeaderComponent from "./components/HeaderComponent";

export default {
  name: "App",
  components: {
    HelloWorld,
    HeaderComponent
  }
};
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  position: relative;
  z-index: 0;
}

.header-container {
  height: 109px;
}

.header {
  position: fixed;
  z-index: 110;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

button {
  margin: 5px;
}
</style>
