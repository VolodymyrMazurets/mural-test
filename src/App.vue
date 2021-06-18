<template>
  <div class="test-app">
    <avatar-component
      indicatorStyle="bulge"
      avatar="https://i.pravatar.cc/50"
    />
    <avatar-component indicatorStyle="dot" color="#eb7d7f" webcam />
    <avatar-component indicatorStyle="arrow" color="#f6dc4a" />
  </div>
</template>

<script>
import AvatarComponent from "./components/AvatarComponent/AvatarComponent.vue";

export default {
  name: "App",
  components: {
    AvatarComponent,
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-size: 100%;
}
.test-app {
  padding: 24px;
}
</style>
