import Lenis from "lenis";

export const lenis = new Lenis({
  duration: 1.1,
  smoothWheel: true,
  syncTouch: false,
  anchors: {
    offset: -72,
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 4),
  },
});
