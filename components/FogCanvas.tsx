"use client";

import { useEffect, useRef } from "react";

const vertexSrc = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const fragmentSrc = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform vec2 u_trail0;
  uniform vec2 u_trail1;
  uniform vec2 u_trail2;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                   dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                   dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 p = uv * aspect;
    vec2 m = u_mouse * aspect;

    vec2 flow = vec2(u_time * 0.03, u_time * 0.015);
    float n = fbm(p * 3.0 + flow);
    float n2 = fbm(p * 6.0 - flow * 2.0);

    float d = length(p - m);
    float core = exp(-d * 9.0) * 0.55;
    float glow = exp(-d * 4.0) * 0.12;

    float t0 = exp(-length(p - u_trail0 * aspect) * 6.0) * 0.18;
    float t1 = exp(-length(p - u_trail1 * aspect) * 5.0) * 0.10;
    float t2 = exp(-length(p - u_trail2 * aspect) * 4.0) * 0.05;

    float plume = smoothstep(0.28, 0.0, d - n * 0.12 - n2 * 0.05) * 0.12;
    float ambient = fbm(p * 2.0 + flow * 0.5) * 0.03;

    float total = clamp(core + glow + t0 + t1 + t2 + plume + ambient, 0.0, 1.0);
    vec3 bg = vec3(0.122, 0.133, 0.157);
    gl_FragColor = vec4(mix(bg, vec3(1.0), total), 1.0);
  }
`;

export default function FogCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: true });
    if (!gl) return;

    function createShader(type: number, src: string) {
      const sh = gl!.createShader(type);
      if (!sh) return null;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      return sh;
    }

    const vs = createShader(gl.VERTEX_SHADER, vertexSrc);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uT0 = gl.getUniformLocation(program, "u_trail0");
    const uT1 = gl.getUniformLocation(program, "u_trail1");
    const uT2 = gl.getUniformLocation(program, "u_trail2");

    let target = [0.5, 0.5];
    const mouse = [0.5, 0.5];
    const trail0 = [0.5, 0.5];
    const trail1 = [0.5, 0.5];
    const trail2 = [0.5, 0.5];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.parentElement!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      canvas!.style.width = rect.width + "px";
      canvas!.style.height = rect.height + "px";
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    window.addEventListener("resize", resize);
    resize();

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      target = [
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height,
      ];
    }
    window.addEventListener("mousemove", onMouseMove);

    let raf = 0;
    const start = performance.now();
    function render() {
      mouse[0] += (target[0] - mouse[0]) * 0.025;
      mouse[1] += (target[1] - mouse[1]) * 0.025;
      trail0[0] += (mouse[0] - trail0[0]) * 0.05;
      trail0[1] += (mouse[1] - trail0[1]) * 0.05;
      trail1[0] += (trail0[0] - trail1[0]) * 0.04;
      trail1[1] += (trail0[1] - trail1[1]) * 0.04;
      trail2[0] += (trail1[0] - trail2[0]) * 0.03;
      trail2[1] += (trail1[1] - trail2[1]) * 0.03;

      const t = (performance.now() - start) / 1000;
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform2f(uMouse, mouse[0], mouse[1]);
      gl!.uniform2f(uT0, trail0[0], trail0[1]);
      gl!.uniform2f(uT1, trail1[0], trail1[1]);
      gl!.uniform2f(uT2, trail2[0], trail2[1]);
      gl!.uniform1f(uTime, t);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(render);
    }
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      gl!.deleteProgram(program);
      gl!.deleteShader(vs);
      gl!.deleteShader(fs);
      gl!.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
