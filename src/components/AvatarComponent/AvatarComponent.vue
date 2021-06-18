<template>
  <div class="AvatarComponent" :style="{ color: color }">
    <div class="AvatarComponent__image-wrapper">
      <img
        :src="avatar"
        alt="user"
        v-if="avatar"
        class="AvatarComponent__image"
      />
      <web-cam
        class="AvatarComponent__webcam"
        ref="webcam"
        :device-id="deviceId"
        :width="56"
        :style="{ borderRadius: '50%' }"
        @cameras="onCameras"
        v-else-if="webcam"
      />
      <shrimp-icon v-else class="AvatarComponent__icon" />
    </div>
    <arrow-avatar-component
      v-if="getIndicatorType('arrow')"
      class="AvatarComponent__arrow"
      :radialPosition="-45"
    />
    <dot-avatar-component
      v-if="getIndicatorType('dot')"
      class="AvatarComponent__arrow"
      :radialPosition="235"
    />
    <bulge-avatar-component
      v-if="getIndicatorType('bulge')"
      class="AvatarComponent__arrow"
      :radialPosition="45"
    />
  </div>
</template>
<script>
import ArrowAvatarComponent from "../common/ArrowAvatarComponent/ArrowAvatarComponent.vue";
import BulgeAvatarComponent from "../common/BulgeAvatarComponent/BulgeAvatarComponent.vue";
import DotAvatarComponent from "../common/DotAvatarComponent/DotAvatarComponent.vue";
import ShrimpIcon from "../icons/ShrimpIcon.vue";
import { WebCam } from "vue-web-cam";

export default {
  components: {
    ArrowAvatarComponent,
    DotAvatarComponent,
    BulgeAvatarComponent,
    ShrimpIcon,
    WebCam,
  },
  name: "AvatarComponent",
  props: {
    color: {
      type: String,
      default: "#5bb251",
    },
    indicatorStyle: {
      validator: function(value) {
        return ["arrow", "dot", "bulge"].indexOf(value) !== -1;
      },
    },
    avatar: {
      type: String,
    },
    webcam: {
      type: Boolean,
    },
  },
  data() {
    return {
      img: null,
      camera: null,
      deviceId: null,
      devices: [],
    };
  },
  computed: {
    device: function() {
      return this.devices.find((n) => n.deviceId === this.deviceId);
    },
  },
  methods: {
    getIndicatorType(type) {
      return this.indicatorStyle === type;
    },
    onCameras(cameras) {
      this.devices = cameras;
      console.log("On Cameras Event", cameras);
    },
  },
  watch: {
    camera(id) {
      this.deviceId = id;
    },
    devices() {
      // Once we have a list select the first one
      const [first] = this.devices;
      if (first) {
        this.camera = first.deviceId;
        this.deviceId = first.deviceId;
      }
    },
  },
};
</script>
<style lang="scss">
$size: 50px;
$offset: 8px;
.AvatarComponent {
  background-color: currentColor;
  width: $size;
  height: $size;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  &__image-wrapper {
    width: $size - $offset;
    height: $size - $offset;
    border-radius: 50%;
    overflow: hidden;
    z-index: 2;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__image {
    width: 100%;
    object-fit: cover;
  }
  &__arrow {
    position: absolute;
  }
  &__icon {
    width: 50%;
  }
}
</style>
