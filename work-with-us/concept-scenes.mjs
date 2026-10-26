// Original, bounded Three.js scenes. Existing local runtime, no CDN or copied shader.
export async function mountScene(host,kind){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches||navigator.connection?.saveData)return ()=>{};
 const THREE=await import('/assets/vendor/three/three.module.min.js');
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return ()=>{};}
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.25:1.5));
 renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
 renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,0,8);
 const environment=new THREE.Scene();
 const walls=new THREE.Mesh(new THREE.BoxGeometry(20,20,20),new THREE.MeshBasicMaterial({color:0x77847b,side:THREE.BackSide}));environment.add(walls);
 for(const [x,y,z,scale] of [[-5,3,2,6],[5,1,-2,4],[0,7,0,5]]){const panel=new THREE.Mesh(new THREE.PlaneGeometry(scale,scale*2),new THREE.MeshBasicMaterial({color:0xffffff}));panel.position.set(x,y,z);panel.lookAt(0,0,0);environment.add(panel);}
 const pmrem=new THREE.PMREMGenerator(renderer),environmentTarget=pmrem.fromScene(environment,.03);scene.environment=environmentTarget.texture;pmrem.dispose();environment.traverse(object=>{if(object.isMesh){object.geometry.dispose();object.material.dispose();}});
 const group=new THREE.Group();scene.add(group);
 scene.add(new THREE.HemisphereLight(0xffffff,kind==='volt'?0x586845:0x456c5c,3));
 const light=new THREE.DirectionalLight(0xffffff,5);light.position.set(-3,5,6);scene.add(light);
 const rim=new THREE.DirectionalLight(kind==='volt'?0xe8f3a0:0xb6d1c3,8);rim.position.set(4,-2,-1);scene.add(rim);
 const materials=[],geometries=[];
 const add=(geometry,material)=>{geometries.push(geometry);materials.push(material);const mesh=new THREE.Mesh(geometry,material);group.add(mesh);return mesh;};
 if(kind==='volt'){
  const shape=new THREE.Shape();const w=.92,h=1.08,r=.28;
  shape.moveTo(-w+r,-h);shape.lineTo(w-r,-h);shape.quadraticCurveTo(w,-h,w,-h+r);shape.lineTo(w,h-r);shape.quadraticCurveTo(w,h,w-r,h);shape.lineTo(-w+r,h);shape.quadraticCurveTo(-w,h,-w,h-r);shape.lineTo(-w,-h+r);shape.quadraticCurveTo(-w,-h,-w+r,-h);
  const body=add(new THREE.ExtrudeGeometry(shape,{depth:.5,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.12,bevelThickness:.12}),new THREE.MeshPhysicalMaterial({color:0xe2e6d5,metalness:.15,roughness:.2,clearcoat:1}));body.position.z=-.3;
  const pinMaterial=new THREE.MeshStandardMaterial({color:0xb8a772,metalness:.85,roughness:.2});
  for(const [x,y]of [[0,.6],[-.5,-.35],[.5,-.35]]){const pin=add(new THREE.BoxGeometry(.17,.28,.65),pinMaterial.clone());pin.position.set(x,y,.75);}
  const screw=add(new THREE.CylinderGeometry(.07,.07,.03,20),new THREE.MeshStandardMaterial({color:0x5c655c,metalness:.8,roughness:.2}));screw.rotation.x=Math.PI/2;screw.position.set(0,0,.35);
  const path=new THREE.CatmullRomCurve3([new THREE.Vector3(0,-1,0),new THREE.Vector3(.1,-1.9,-.2),new THREE.Vector3(1.5,-2,-.2),new THREE.Vector3(2,-.5,-.5),new THREE.Vector3(1.8,1.4,-.6),new THREE.Vector3(.2,2,-.7),new THREE.Vector3(-1.8,1.2,-.7)]);
  add(new THREE.TubeGeometry(path,100,.1,14,false),new THREE.MeshPhysicalMaterial({color:0x364b3c,metalness:.15,roughness:.35,clearcoat:1}));
  group.rotation.set(.2,-.45,-.5);group.scale.setScalar(.85);
 }

 const resize=()=>{const r=host.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();};
 const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(host);resize();
 let visible=false,frame=0,last=0,elapsed=0,x=0,y=0,tx=0,ty=0;
 const move=e=>{const r=host.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;};
 host.addEventListener('pointermove',move);host.addEventListener('pointerleave',()=>{tx=0;ty=0;});
 const tick=time=>{
  frame=0;if(!visible||document.hidden||reduced.matches)return;
  const dt=Math.min((time-(last||time))/1000,.05);last=time;elapsed+=dt;
  x+=(tx-x)*(1-Math.exp(-7*dt));y+=(ty-y)*(1-Math.exp(-7*dt));
  group.rotation.y=-.35+x*.5+Math.sin(elapsed*.23)*.09;group.rotation.x=(kind==='volt'?.2:.75)+y*.35;
  if(kind==='volt'){const powered=host.closest('[data-power]')?.dataset.power==='on';light.intensity+=( (powered?8:4)-light.intensity)*.06;group.rotation.z=-.5+Math.sin(elapsed*.18)*.025;}
  group.position.y=Math.sin(elapsed*.6)*.06;
  renderer.render(scene,camera);host.classList.add('scene-ready');frame=requestAnimationFrame(tick);
 };
 const stop=()=>{cancelAnimationFrame(frame);frame=0;last=0;};
 const start=()=>{if(visible&&!document.hidden&&!reduced.matches&&!frame)frame=requestAnimationFrame(tick);};
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?start():stop();});observer.observe(host);
 const visibility=()=>document.hidden?stop():start();document.addEventListener('visibilitychange',visibility);
 const motion=()=>{if(reduced.matches){stop();host.classList.remove('scene-ready');}else start();};reduced.addEventListener('change',motion);
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();stop();host.classList.remove('scene-ready');});
 renderer.domElement.addEventListener('webglcontextrestored',start);
 return ()=>{stop();observer.disconnect();sizeObserver.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',motion);host.removeEventListener('pointermove',move);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());environmentTarget.dispose();renderer.dispose();renderer.domElement.remove();};
}
