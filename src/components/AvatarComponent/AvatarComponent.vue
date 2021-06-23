<template>
  <div class="AvatarComponent" :style="{ color: color }">
    <div class="AvatarComponent__image-wrapper">
      <web-cam
        class="AvatarComponent__webcam"
        ref="webcam"
        :device-id="deviceId"
        :width="56"
        :height="56"
        :style="{ borderRadius: '50%' }"
        @cameras="onCameras"
        @camera-change="onCameraChange"
        v-if="webcam"
        @stopped="stoped"
        @started="started"
      />
      <img
        :src="avatar"
        alt="user"
        v-if="avatar && !webcam"
        class="AvatarComponent__image"
      />
      <shrimp-icon v-else class="AvatarComponent__icon" />
    </div>
    <template v-if="!isSound">
      <arrow-avatar-component
        v-if="getIndicatorType('arrow')"
        class="AvatarComponent__arrow"
        :color="color"
        :radialPosition="radialPosition"
      />
      <dot-avatar-component
        v-if="getIndicatorType('dot')"
        class="AvatarComponent__arrow"
        :color="color"
        :radialPosition="radialPosition"
      />
      <bulge-avatar-component
        :color="color"
        v-if="getIndicatorType('bulge')"
        class="AvatarComponent__arrow"
        :radialPosition="radialPosition"
      />
    </template>
    <template v-else>
      <audio-component
        v-if="!isMute"
        :media="media"
        connect-destination
        :radius="25"
        :canvWidth="80"
        :canvHeight="80"
        :lineColor="color"
        :lineWidth="2"
        canvClass="AvatarComponent__canvas"
      ></audio-component>
      <div v-else class="AvatarComponent__mute">
        <mute-icon class="AvatarComponent__mute-icon" />
      </div>
    </template>
  </div>
</template>
<script>
import ArrowAvatarComponent from "../common/ArrowAvatarComponent/ArrowAvatarComponent.vue";
import BulgeAvatarComponent from "../common/BulgeAvatarComponent/BulgeAvatarComponent.vue";
import DotAvatarComponent from "../common/DotAvatarComponent/DotAvatarComponent.vue";
import ShrimpIcon from "../icons/ShrimpIcon.vue";
import { WebCam } from "vue-web-cam";
import AudioComponent from "../common/AudioComponent/AudioComponent";
import MuteIcon from "../icons/MuteIcon.vue";

export default {
  components: {
    ArrowAvatarComponent,
    DotAvatarComponent,
    BulgeAvatarComponent,
    ShrimpIcon,
    WebCam,
    AudioComponent,
    MuteIcon,
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
    radialPosition: {
      type: Number,
      default: 0,
    },
    isSound: {
      type: Boolean,
    },
    media: {
      type: MediaStream,
    },
    deviceId: {
      type: String,
    },
    onCameras: {
      type: Function,
    },
    onCameraChange: {
      type: Function,
    },
    onError: {
      type: Function,
    },
    isMute: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    getIndicatorType(type) {
      return this.indicatorStyle === type;
    },
    stoped(e) {
      console.log("stoped", e);
    },
    started(e) {
      console.log("started", e);
    },
  },
  watch: {
    media() {
      if (this.isSound) {
        this.rerenderVar = false;
        this.rerenderVar = true;
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
  &__canvas {
    position: absolute;
    left: -15px;
    right: -15px;
    bottom: -15px;
    top: -15px;
    border-radius: 50%;
    overflow: hidden;
  }
  &__webcam {
    min-width: 56px;
    height: 56px;
  }
  &__mute {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 2;
    width: 14px;
    height: 14px;
    background-color: red;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__mute-icon {
    fill: white;
    width: 10px;
  }
}
</style>
