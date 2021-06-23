const props = {
  media: {
    type: MediaStream,
    required: false,
    default: null,
  },
  canvWidth: {
    type: Number,
    default: 300,
  },
  canvClass: {
    type: String,
    default: null,
  },
  canvHeight: {
    type: Number,
    default: 80,
  },
  fftSize: {
    type: Number,
    default: null,
  },
  frequLnum: {
    type: Number,
    default: 60,
  },
  frequLineCap: {
    type: Boolean,
    default: false,
  },
  lineColor: {
    type: String,
    default: "lime",
  },
  lineWidth: {
    type: Number,
    default: null,
  },
  radius: {
    type: Number,
    default: 4,
  },
  connectDestination: {
    type: Boolean,
    default: false,
  },
};

const AudioComponent = {
  name: "AudioComponent",
  data() {
    return {
      ctx: null,
      audioCtx: null,
      analyser: null,
    };
  },
  props,
  render: (h) => h("div"),
  mounted() {
    window.AudioContext =
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.msAudioContext;
    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame;
    this.createCanvas();
  },
  watch: {
    async media(newVal) {
      if (newVal) this.setAnalyser();
      this.draw();
    },
  },
  methods: {
    createCanvas() {
      const canv = document.createElement("canvas");
      canv.width = this.canvWidth;
      canv.height = this.canvHeight;
      if (this.canvClass) canv.setAttribute("class", this.canvClass);
      this.ctx = canv.getContext("2d");
      this.$el.appendChild(canv);
    },
    setAnalyser() {
      this.audioCtx = new AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
      const src = this.audioCtx.createMediaStreamSource(this.media);
      src.connect(this.analyser);
      if (this.fftSize) {
        this.analyser.fftSize = this.fftSize;
      } else {
        this.analyser.fftSize = 8192;
      }
    },
    draw() {
      const data = new Uint8Array(this.analyser.fftSize);
      this.ctx.clearRect(0, 0, this.canvWidth, this.canvHeight);
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.lineColor;
      this.analyser.getByteFrequencyData(data);
      this.circle(data);
      requestAnimationFrame(this.draw);
    },
    circle(data) {
      const cx = this.canvWidth / 2;
      const cy = this.canvHeight / 2;
      const r = this.radius || 4;
      const lineWidth = this.lineWidth;
      const lineSpace = 10;
      const arcStep = Math.ceil(lineWidth + lineSpace);
      const step = ((lineWidth + lineSpace) / data.length) * (2 * Math.PI);
      const barLen = this.canvWidth / 1.2 - r;
      let angle = Math.PI;

      this.ctx.lineWidth = this.lineWidth || 0.5;

      data.forEach((_, index) => {
        angle += step;
        if (index % arcStep) {
          return;
        }

        const bits = Math.round(
          data.slice(index, index + arcStep).reduce((v, t) => t + v, 0) /
            arcStep
        );

        const blen = r + (bits / 255.0) * barLen;
        this.ctx.beginPath();
        this.ctx.lineCap = "round";
        this.ctx.moveTo(r * Math.cos(angle) + cx, r * Math.sin(angle) + cy);
        this.ctx.lineTo(
          blen * Math.cos(angle) + cx,
          blen * Math.sin(angle) + cy
        );
        this.ctx.stroke();
      });
    },
  },
};
export default AudioComponent;
