export type Effect = (
  analyser: AnalyserNode,
  options?: {
    container: HTMLElement;
  },
) => {
  visualize: () => void;
  resize: () => void;
};
import { Canvas, Circle, Line } from '@antv/g-lite';
import { Renderer } from '@antv/g-canvas';

const WIDTH = document.body.clientWidth;
const HEIGHT = 2 * 150;

const DotEffect: Effect = (analyser) => {
  analyser.fftSize = 512; //  默认值2018 必须是2的n次冥, 值越大越细腻
  const dataArray = new Uint8Array(analyser.frequencyBinCount); // 512 /2
  const canvas = new Canvas({
    container: 'container',
    width: WIDTH,
    height: HEIGHT,
    renderer: new Renderer(),
  });

  const resize = () => {};
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry !== canvas) {
        continue;
      }
      const { width, height } = entry.contentRect;
      // resize canvas
      canvas.resize(width, height);
    }
  });

  resizeObserver.observe(document.querySelector('#container'));

  const DOT_R = 2;
  const DOT_COLOR = '#e9dcf7';

  const visualize = () => {
    canvas.removeChildren();
    analyser.getByteFrequencyData(dataArray);

    const barWidth = WIDTH / dataArray.length;

    for (let i = 0; i < dataArray.length; i++) {
      const data = dataArray[i];
      const barHeight = (data / 255) * HEIGHT;

      const x = barWidth * i;
      const y = HEIGHT - barHeight;

      const dot = new Circle({
        style: {
          cx: x,
          cy: y,
          r: DOT_R,
          fill: DOT_COLOR,
        },
      });

      const line = new Line({
        style: {
          x1: x,
          y1: y,
          x2: x,
          y2: HEIGHT,
          lineWidth: DOT_R * 1.4,
          stroke: `l(90) 0.3:rgba(255,255,255,0) 1:${DOT_COLOR}`,
        },
      });

      canvas.appendChild(dot);
      canvas.appendChild(line);
    }
  };

  return {
    visualize,
    resize,
  };
};

export { DotEffect };
