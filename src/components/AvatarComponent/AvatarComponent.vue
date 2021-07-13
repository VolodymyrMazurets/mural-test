<template>
  <div class="AvatarComponent" :style="{ color: color }" ref="avatar">
    <div
      ref="avatarWrapper"
      class="AvatarComponent__image-wrapper"
      @contextmenu.prevent="openMenu"
    >
      <radial-context-menu
        class="AvatarComponent__radial-menu"
        ref="radialMenu"
        @clicked="menuClicked"
        v-click-outside="closeMenu"
        :menu-items="menuItems"
        :size="100"
        close-on-click
      />
      <div class="AvatarComponent__connection" ref="connection" />
      <div class="AvatarComponent__image-block">
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
    </div>
    <div ref="arrow">
      <arrow-avatar-component
        v-if="getIndicatorType('arrow')"
        class="AvatarComponent__arrow"
        :color="color"
        :radialPosition="angle"
        :offset="this.offset"
      />
      <dot-avatar-component
        v-if="getIndicatorType('dot')"
        class="AvatarComponent__arrow"
        :color="color"
        :radialPosition="angle"
      />
      <bulge-avatar-component
        :color="color"
        v-if="getIndicatorType('bulge')"
        class="AvatarComponent__arrow"
        :radialPosition="angle"
      />
    </div>
    <template v-if="isSound">
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
import RadialContextMenu from "../common/RadialContextMenu/RadialContextMenu.vue";
import ClickOutside from "vue-click-outside";
import LeaderLine from "leader-line-vue";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export default {
  components: {
    ArrowAvatarComponent,
    DotAvatarComponent,
    BulgeAvatarComponent,
    ShrimpIcon,
    WebCam,
    AudioComponent,
    MuteIcon,
    RadialContextMenu,
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
    return {
      menuItems: [
        {
          id: "walk",
          title: "Walk",
          icon: "#shrimb",
        },
        {
          id: "run",
          title: "Run",
          icon: "#shrimb",
        },
        {
          id: "drive",
          title: "Drive",
          icon: "#shrimb",
        },
        {
          id: "figth",
          title: "Fight",
          icon: "#shrimb",
        },
        {
          id: "walk1",
          title: "Walk1",
          icon: "#shrimb",
        },
        {
          id: "run1",
          title: "Run1",
          icon: "#shrimb",
        },
        {
          id: "drive1",
          title: "Drive1",
          icon: "#shrimb",
        },
        {
          id: "figth1",
          title: "Fight1",
          icon: "#shrimb",
        },
      ],
      angle: 0,
      offset: 10,
      line: null,
    };
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
    menuClicked: function(menuItem) {
      console.log("Menu item click:", menuItem.id);
    },
    openMenu: function() {
      this.$refs.radialMenu.open();
    },
    closeMenu: function() {
      this.$refs.radialMenu.close();
    },
    updatePath(firstRef, secondRef, lineRef, e) {
      if (e.target.className === "AvatarComponent__arrow") {
        gsap.to(firstRef, {
          duration: 1,
          x: e.layerX - 10,
          y: e.layerY - 10,
          onUpdate: () => this.line.position(),
        });
      }
      if (e.target.className === "AvatarComponent__image-block") {
        gsap.to(secondRef, {
          duration: 0,
          x: e.layerX + 10,
          y: e.layerY + 10,
          onUpdate: () => this.line.position(),
        });
      }

      this.line.position();

      const rectAvatar = firstRef.getBoundingClientRect();
      const centerX = rectAvatar.x + rectAvatar.width / 2;
      const centerY = rectAvatar.y + rectAvatar.bottom / 2;
      const rectArrow = secondRef.getBoundingClientRect();
      const centerArrowX = rectArrow.x + rectArrow.width / 2;
      const centerArrowY = rectArrow.y + rectArrow.bottom / 2;

      const dx = centerArrowX - centerX;
      const dy = centerArrowY - centerY;
      this.angle = Math.atan2(dy, dx);
    },
    onKeydown(e) {
      if (e.key === "ArrowUp" || e.key === "w") this.angle += 1;
      if (e.key === "ArrowDown" || e.key === "s") this.angle -= 1;
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
  directives: {
    ClickOutside,
  },
  mounted() {
    const { avatarWrapper, arrow, line, connection } = this.$refs;

    Draggable.create([avatarWrapper, arrow], {
      onDrag: (e) => this.updatePath(avatarWrapper, arrow, line, e),
      allowContextMenu: true,
    });

    this.line = new LeaderLine.setLine(connection, arrow, {
      startPlug: "behind",
      endPlug: "behind",
      color: this.color,
      size: 2,
      startSocket: "center",
      endSocket: "center",
      startSocketGravity: [0, 0],
      endSocketGravity: [0, 0],
      allowContextMenu: true,
    });
    document.addEventListener("keydown", this.onKeydown);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.onKeydown);
  },
};
</script>
<style lang="scss">
$size: 50px;
$offset: 8px;
.AvatarComponent {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  &__image-wrapper {
    background-color: currentColor;
    width: $size;
    height: $size;
    border-radius: 50%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__image-block {
    width: $size - $offset;
    height: $size - $offset;
    border-radius: 50%;
    overflow: hidden;
    z-index: 2;
  }
  &__image {
    width: 100%;
    object-fit: cover;
    pointer-events: none;
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
  &__radial-menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
  &__line {
    fill: none;
    stroke: red;
    stroke-width: 6;
  }
  &__svg {
    position: fixed;
    width: 100%;
    height: 100%;
  }
  &__connection {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }
}
.leader-line {
  z-index: 0;
}
</style>
