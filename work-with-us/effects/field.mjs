// Original WebGL motion fields. No external renderer, shader or runtime asset.
const vertex=`attribute vec2 position;varying vec2 uv;void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment=`precision mediump float;
varying vec2 uv;uniform sampler2D image;uniform vec2 resolution,imageSize,pointer;uniform float time,energy,scroll,mode,impulse,contain;
void main(){
 float aspect=resolution.x/resolution.y,photo=imageSize.x/imageSize.y;
 vec2 crop=vec2(min(aspect/photo,1.),min(photo/aspect,1.));
 if(contain>.5)crop=vec2(max(aspect/photo,1.),max(photo/aspect,1.));
 vec2 sampleUv=(uv-.5)*crop+.5;if(contain>.5&&(sampleUv.x<0.||sampleUv.x>1.||sampleUv.y<0.||sampleUv.y>1.)){gl_FragColor=vec4(.929,.945,.914,1.);return;}
 vec2 p=uv,delta=(p-pointer)*vec2(aspect,1.);float radius=length(delta);
 float lens=exp(-radius*5.5);float ripple=sin(radius*38.-time*2.2)*lens;
 vec2 distortion=normalize(delta+vec2(.0001))*ripple*.006*(.15+impulse);
 if(mode<1.5){
  // Heat and glass refraction around the visitor's point of interest.
  distortion+=vec2(sin(p.y*12.+time*.28),cos(p.x*10.-time*.22))*.0014;
  p+=distortion;
 }else{
  // A structured travelling highlight, following architectural diagonals.
  float route=p.x*.72+p.y*.46;
  float packet=pow(max(0.,sin(route*8.-time*1.3)),18.);
  p+=distortion*.25;
  vec3 c=texture2D(image,(p-.5)*crop+.5).rgb;
  float lighting=.52+energy*.5;
  c*=lighting;c+=vec3(1.,.63,.29)*packet*.09*energy;
  float thin=exp(-abs(p.y-(.15+p.x*.58))*(180.));
  c+=vec3(1.,.69,.36)*thin*.12*energy;
  gl_FragColor=vec4(c,1.);return;
 }
 vec3 colour=texture2D(image,(p-.5)*crop+.5).rgb;
 float warm=exp(-length((uv-vec2(.83,.64))*vec2(1.,.9))*5.);
 colour+=vec3(.06,.025,.004)*warm*(.6+.4*sin(time*.6));
 gl_FragColor=vec4(colour,1.);
}`;
function compile(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw new Error('motion_shader_unavailable');}return shader;}
function rig(host,vs,fs){
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 if(preference.matches||navigator.connection?.saveData)return null;
 const canvas=document.createElement('canvas');canvas.className='motion-field';canvas.setAttribute('aria-hidden','true');
 const gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'});if(!gl){host.dataset.motionState='fallback';return null;}
 let program;
 try{program=gl.createProgram();gl.attachShader(program,compile(gl,gl.VERTEX_SHADER,vs));gl.attachShader(program,compile(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('motion_link_unavailable');}
 catch{host.dataset.motionState='fallback';return null;}
 gl.useProgram(program);host.append(canvas);
 const uniforms=new Map();const loc=name=>{if(!uniforms.has(name))uniforms.set(name,gl.getUniformLocation(program,name));return uniforms.get(name);};
 let frame=0,visible=false,last=0,disposed=false,contextLost=false,draw=()=>{};
 const stop=()=>{cancelAnimationFrame(frame);frame=0;};
 const tick=stamp=>{frame=0;if(disposed||contextLost||!visible||document.hidden||preference.matches)return;if(stamp-last>30){last=stamp;draw(stamp/1000);}frame=requestAnimationFrame(tick);};
 const start=()=>{if(!frame&&!disposed&&!contextLost&&visible&&!document.hidden&&!preference.matches)frame=requestAnimationFrame(tick);};
 const resize=()=>{const r=host.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,innerWidth<700?1.25:1.5);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));gl.viewport(0,0,canvas.width,canvas.height);};
 const size=new ResizeObserver(resize);size.observe(host);resize();
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?start():stop();});observer.observe(host);
 const visibility=()=>document.hidden?stop():start();document.addEventListener('visibilitychange',visibility);
 const motion=()=>{canvas.hidden=preference.matches;if(preference.matches)stop();else start();};preference.addEventListener('change',motion);
 const lost=event=>{event.preventDefault();contextLost=true;stop();canvas.hidden=true;host.dataset.motionState='fallback';};canvas.addEventListener('webglcontextlost',lost);
 return {gl,canvas,program,loc,start,setDraw(fn){draw=fn;start();},dispose(){disposed=true;stop();size.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',visibility);preference.removeEventListener('change',motion);canvas.removeEventListener('webglcontextlost',lost);gl.deleteProgram(program);canvas.remove();host.dataset.motionState='fallback';}};
}
export async function imageField(host,{mode=1}={}){
 const state=rig(host,vertex,fragment);if(!state)return null;
 const {gl,canvas,program,loc}=state,buffer=gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
 let texture=null,version=0,disposed=false,ready=false,px=.6,py=.5,tx=.6,ty=.5,velocity=0,currentEnergy=1,targetEnergy=1;
 const image=host.querySelector('img');if(!image){state.dispose();return null;}
 async function source(url){
  const thisVersion=++version;ready=false;canvas.hidden=true;
  if(url)image.src=url;
  try{await image.decode();}catch{host.dataset.motionState='fallback';return;}
  if(disposed||version!==thisVersion)return;
  const next=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,next);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  if(texture)gl.deleteTexture(texture);texture=next;gl.uniform2f(loc('imageSize'),image.naturalWidth,image.naturalHeight);gl.uniform1i(loc('image'),0);gl.uniform1f(loc('mode'),mode);
  gl.uniform1f(loc('contain'),getComputedStyle(image).objectFit==='contain'?1:0);ready=true;canvas.hidden=matchMedia('(prefers-reduced-motion: reduce)').matches;host.dataset.motionState='ready';state.start();
 }
 const move=event=>{const r=host.getBoundingClientRect();const nx=(event.clientX-r.left)/r.width,ny=1-(event.clientY-r.top)/r.height;velocity=Math.min(2,Math.hypot(nx-tx,ny-ty)*12);tx=nx;ty=ny;};
 const leave=()=>{tx=.6;ty=.5;};host.addEventListener('pointermove',move,{passive:true});host.addEventListener('pointerleave',leave);
 state.setDraw(time=>{if(!ready)return;px+=(tx-px)*.09;py+=(ty-py)*.09;velocity*=.94;currentEnergy+=(targetEnergy-currentEnergy)*.045;gl.uniform2f(loc('resolution'),canvas.width,canvas.height);gl.uniform2f(loc('pointer'),px,py);gl.uniform1f(loc('time'),time);gl.uniform1f(loc('impulse'),velocity);gl.uniform1f(loc('energy'),currentEnergy);gl.drawArrays(gl.TRIANGLES,0,6);});
 await source();
 return {setSource:source,setEnergy(value){targetEnergy=Math.max(0,Math.min(1,value));},dispose(){disposed=true;host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);if(texture)gl.deleteTexture(texture);gl.deleteBuffer(buffer);state.dispose();}};
}
const pointVertex=`precision mediump float;attribute vec3 target,scatter,colour;uniform vec2 resolution,pointer;uniform float time,morph;varying vec3 tint;varying float alpha;
void main(){
 float phase=clamp(morph,0.,1.);vec3 p=mix(target,scatter,phase);
 float d=length(target.xy-pointer*2.);p.x+=sin(time*.65+target.y*4.)*.012*(1.-phase);p.y+=cos(time*.42+target.x*4.)*.01;
 p.z+=sin(time*.35+target.x*3.)*.06;float angle=phase*.26;mat2 rotation=mat2(cos(angle),-sin(angle),sin(angle),cos(angle));p.xz=rotation*p.xz;
 float aspect=resolution.x/resolution.y;gl_Position=vec4(p.x/aspect,p.y,p.z*.04,1.);gl_PointSize=3.3+phase*.7;
 tint=colour*.65;alpha=.95-phase*.15;
}`;
const pointFragment=`precision mediump float;varying vec3 tint;varying float alpha;void main(){float radius=length(gl_PointCoord-.5);if(radius>.5)discard;gl_FragColor=vec4(tint,alpha*smoothstep(.5,.22,radius));}`;
export async function movementField(host){
 const state=rig(host,pointVertex,pointFragment);if(!state)return null;
 const {gl,program,canvas,loc}=state,image=host.querySelector('img');
 try{await image.decode();}catch{state.dispose();return null;}
 const sampler=document.createElement('canvas');sampler.width=200;sampler.height=134;const ctx=sampler.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,200,134);const pixels=ctx.getImageData(0,0,200,134).data;
 const positions=[],random=[],colours=[];const rand=i=>{const n=Math.sin(i*127.1+31.7)*43758.5453;return n-Math.floor(n);};
 for(let y=0;y<134;y++)for(let x=0;x<200;x++){
  const i=(y*200+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];
  if(r>214&&g>216&&b>207)continue;if(Math.abs(g-r)<3&&Math.max(r,g,b)>190)continue;
  positions.push((x/200-.5)*3,.9-y/134*1.8,(g-r)/255*.16);
  const index=positions.length;const theta=rand(index)*Math.PI*2,radius=.3+rand(index+1)*1.2;
  random.push(Math.cos(theta)*radius,Math.sin(theta)*radius*.62,(rand(index+2)-.5));colours.push(r/255,g/255,b/255);
 }
 const buffers=[];
 for(const [name,data]of [['target',positions],['scatter',random],['colour',colours]]){const buffer=gl.createBuffer();buffers.push(buffer);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const attribute=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,3,gl.FLOAT,false,0,0);}
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);let morph=.06,targetMorph=.06;
 state.setDraw(time=>{morph+=(targetMorph-morph)*.035;gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform2f(loc('resolution'),canvas.width,canvas.height);gl.uniform2f(loc('pointer'),.5,.5);gl.uniform1f(loc('time'),time);gl.uniform1f(loc('morph'),morph);gl.drawArrays(gl.POINTS,0,positions.length/3);});host.dataset.motionState='ready';
 return {setMorph(value){targetMorph=Math.max(0,Math.min(1,value));},dispose(){buffers.forEach(buffer=>gl.deleteBuffer(buffer));state.dispose();}};
}
