<template>
  <div class="test-app">
    <avatar-component
      indicatorStyle="bulge"
      avatar="https://i.pravatar.cc/50"
      :radialPosition="firstAngle"
    />
    <avatar-component
      indicatorStyle="dot"
      color="#eb7d7f"
      webcam
      :radialPosition="secondAngle"
    />
    <avatar-component
      indicatorStyle="arrow"
      color="#f6dc4a"
      :radialPosition="thirdAngle"
    />
    <avatar-component
      :media="media"
      :radialPosition="230"
      indicatorStyle="bulge"
      isSound
      avatar="https://i.pravatar.cc/50"
    />
  </div>
</template>

<script>
import AvatarComponent from "./components/AvatarComponent/AvatarComponent.vue";

export default {
  name: "App",
  components: {
    AvatarComponent,
  },
  data() {
    return {
      media: null,
      firstAngle: -45,
      secondAngle: 0,
      thirdAngle: 235,
    };
  },
  mounted() {
    const constraints = { audio: true, video: false };
    navigator.mediaDevices.getUserMedia(constraints).then((media) => {
      this.media = media;
    });
    setInterval(() => {
      this.firstAngle += 10;
      this.secondAngle -= 10;
      this.thirdAngle += 10;
    }, [1000]);
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
  display: flex;
  gap: 40px;
}
</style>
