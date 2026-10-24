"use client";

import { useEffect, useRef } from "react";

const VS = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.0-1.0,0,1);}`;

const FS = `#version 300 es
precision highp float; out vec4 O; uniform vec2 R; uniform float T; uniform vec2 MO;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.0,a=0.5;for(int i=0;i<4;i++){s+=a*vn(p);p*=2.07;a*=0.5;}return s;}
float grid(vec2 p,float s){vec2 q=abs(fract(p*s)-0.5)/s;float d=min(q.x,q.y);
  return 1.0-smoothstep(0.0,0.0016+fwidth(d)*1.3,d);}
void main(){
  vec2 uv=gl_FragCoord.xy/R;
  vec2 P=(gl_FragCoord.xy*2.0-R)/R.y;
  float t=T*0.05;
  vec3 BLU=vec3(0.106,0.294,0.651);
  vec3 col=vec3(0.918,0.902,0.859);
  col-=fbm(gl_FragCoord.xy*0.0085)*0.040;
  col-=h21(gl_FragCoord.xy*0.41)*0.019;
  col+=vn(gl_FragCoord.xy*0.0022)*0.022;
  vec2 gp=P+vec2(t*0.10,0.0);
  col=mix(col,BLU,grid(gp,7.0)*0.11);
  col=mix(col,BLU,grid(gp,1.4)*0.21);
  float sweep=fract(T*0.030);
  float sx=(sweep*2.6-1.3)*R.x/R.y;
  float sd=abs(P.x-sx);
  col=mix(col,BLU,smoothstep(0.0035,0.0,sd)*0.34);
  col=mix(col,BLU,exp(-sd*26.0)*0.045);
  float ml=length(P-MO*vec2(R.x/R.y,1.0));
  col=mix(col,BLU,exp(-ml*3.4)*0.030);
  col*=1.0-0.115*pow(length(uv-0.5)*1.26,2.1);
  O=vec4(col,1.0);}`;

/** Drafting-paper substrate: stock mottle, tooth, grid, a travelling plotter rail
 *  and a lamp glow that tracks the pointer. One fullscreen triangle, no geometry. */
export default function PaperCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shaders: WebGLShader[] = [];
    const mk = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      shaders.push(s);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindVertexArray(gl.createVertexArray());

    const uR = gl.getUniformLocation(prog, "R");
    const uT = gl.getUniformLocation(prog, "T");
    const uM = gl.getUniformLocation(prog, "MO");

    let W = 0, H = 0, mx = 0, my = 0, tx = 0, ty = 0, visible = true, raf = 0;

    const resize = () => {
      const d = Math.min(devicePixelRatio || 1, 1.5);
      W = Math.round(innerWidth * d);
      H = Math.round(innerHeight * d);
      cv.width = W; cv.height = H;
      cv.style.width = innerWidth + "px";
      cv.style.height = innerHeight + "px";
      gl.viewport(0, 0, W, H);
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / innerWidth) * 2 - 1;
      ty = 1 - (e.clientY / innerHeight) * 2;
      (window as Window & { __mx?: number; __my?: number }).__mx = tx;
      (window as Window & { __mx?: number; __my?: number }).__my = ty;
    };
    const onVis = () => { visible = !document.hidden; };

    resize();
    addEventListener("resize", resize, { passive: true });
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    const T0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      gl.uniform2f(uR, W, H);
      gl.uniform1f(uT, reduced ? 12 : (now - T0) / 1000);
      gl.uniform2f(uM, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      /* Free the program but keep the context alive. Losing it here would kill the
         canvas permanently: getContext() on a remount returns the same lost context,
         every shader then fails to compile, and the paper never renders again —
         which is exactly what Strict Mode's double-invoke triggers in development. */
      gl.deleteProgram(prog);
      shaders.forEach((sh) => gl.deleteShader(sh));
    };
  }, []);

  return <canvas id="paper" ref={ref} aria-hidden="true" />;
}
