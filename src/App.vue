<template>
  <div class="test-app">
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column">
            <button class="button is-primary" @click="() => onRandomizeClick()">
              Randomize color
            </button>
          </div>
          <div class="column">
            <button
              class="button is-primary is-link"
              @click="() => onRandomizeAngleClick()"
            >
              Randomize indicator angle
            </button>
          </div>
          <div class="column">
            <div class="select">
              <select v-model="selectedIndicator">
                <option v-for="item in indicatorStyles" :key="item">{{
                  item
                }}</option>
              </select>
            </div>
          </div>
          <div class="column">
            <button
              class="button is-warning"
              @click="() => onWebcamTurnOnClick()"
            >
              Turn on webcam
            </button>
          </div>
          <div class="column">
            <button
              class="button is-warning"
              @click="() => onMicrophoneTurnOnClick()"
            >
              Turn on microphone
            </button>
          </div>
          <div
            class="column is-12 is-flex is-centered"
            :style="{ justifyContent: 'center' }"
          >
            <avatar-component
              ref="avatar"
              :indicatorStyle="selectedIndicator || 'arrow'"
              :radialPosition="angle"
              :color="color"
              :deviceId="deviceId"
              :onCameras="onCameras"
              :onCameraChange="onCameraChange"
              :webcam="isWebcamRunning"
              :isSound="isMicrophoneRunning"
              :media="media"
              avatar="https://i.pravatar.cc/300"
              :isMute="isMute"
            />
          </div>
        </div>
        <div v-if="isWebcamRunning" class="columns is-multiline">
          <div class="column">
            <div class="select">
              <select v-model="camera">
                <option
                  v-for="item in devices"
                  :key="item.deviceId"
                  :value="item.deviceId"
                  >{{ item.label }}</option
                >
              </select>
            </div>
          </div>
          <div class="column">
            <button
              class="button is-warning"
              @click="() => onWebcamTurnOfClick()"
            >
              Stop webcam
            </button>
          </div>
        </div>
        <div v-if="isMicrophoneRunning" class="columns is-multiline">
          <div class="column">
            <div class="select">
              <select v-model="microphone">
                <option
                  v-for="item in audioDevices"
                  :key="item.deviceId"
                  :value="item.deviceId"
                  >{{ item.label }}</option
                >
              </select>
            </div>
          </div>
          <div class="column">
            <button class="button is-warning" @click="() => (isMute = !isMute)">
              Toggle mute state
            </button>
          </div>
          <div class="column">
            <button
              class="button is-warning"
              @click="() => onMicrophoneTurnOfClick()"
            >
              Stop microphone
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AvatarComponent from "./components/AvatarComponent/AvatarComponent.vue";
import { isNull, filter } from "lodash";

export default {
  name: "App",
  components: {
    AvatarComponent,
  },
  data() {
    return {
      media: null,
      color: "#eb7d7f",
      angle: -45,
      isOpenIndicatorType: false,
      indicatorStyles: ["arrow", "dot", "bulge"],
      selectedIndicator: "arrow",
      camera: null,
      deviceId: null,
      devices: [],
      isWebcamRunning: false,
      isOpenCameras: false,
      isMicrophoneRunning: false,
      audioDevices: [],
      microphone: null,
      isMute: false,
    };
  },
  computed: {
    getIndicatorDropdownName() {
      return isNull(this.selectedIndicator)
        ? "Select indicator type"
        : this.selectedIndicator;
    },
    device() {
      return this.devices.find((n) => n.deviceId === this.deviceId);
    },
  },
  methods: {
    onRandomizeClick() {
      this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    },
    onRandomizeAngleClick() {
      this.angle = Math.floor(Math.random() * 361);
    },
    onCameras(cameras) {
      this.devices = cameras;
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
    },
    gotDevices(deviceInfos) {
      const audio = filter(deviceInfos, (item) => item.kind === "audioinput");
      this.audioDevices = audio;
    },
    async setUpMicrophoneMedia(constraints) {
      navigator.mediaDevices.getUserMedia(constraints).then((media) => {
        this.media = media;
      });
    },
    turnOnMicrophones(id) {
      navigator.mediaDevices.enumerateDevices().then(this.gotDevices);
      if (id) {
        const constraints = {
          audio: { deviceId: { exact: id } },
          video: false,
        };
        this.setUpMicrophoneMedia(constraints);
      } else {
        const constraints = { audio: true, video: false };
        this.setUpMicrophoneMedia(constraints);
      }
    },
    async onWebcamTurnOnClick() {
      this.isWebcamRunning = true;
      await this.$forceUpdate();
      this.$refs.avatar.$refs.webcam.start();
    },
    onWebcamTurnOfClick() {
      this.$refs.avatar.$refs.webcam.stop();
      this.isWebcamRunning = false;
    },
    async onMicrophoneTurnOnClick() {
      this.turnOnMicrophones(this.microphone);
      this.isMicrophoneRunning = true;
    },
    async onMicrophoneTurnOfClick() {
      this.isMicrophoneRunning = false;
    },
  },
  watch: {
    camera(id) {
      this.deviceId = id;
    },
    devices() {
      const [first] = this.devices;
      if (first) {
        this.camera = first.deviceId;
        this.deviceId = first.deviceId;
      }
    },
    microphone(newId) {
      if (!isNull(newId)) this.turnOnMicrophones(newId);
    },
  },
};
</script>
