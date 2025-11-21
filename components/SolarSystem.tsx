
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { PLANETS } from '../constants';
import { PlanetData } from '../types';

// Add type definitions for React Three Fiber elements
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      ringGeometry: any;
      ambientLight: any;
      pointLight: any;
      color: any;
    }
  }
}

interface Props {
  selectedPlanetId: string | null;
  onPlanetSelect: (id: string) => void;
}

// --- Advanced Procedural Texture Generation ---

const createRingTexture = (id: string): THREE.Texture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64; // 1D gradient essentially
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    const w = 512;
    const h = 64;
    
    // Radial gradient logic simulated linearly for the ring mapping
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    
    if (id === 'saturn') {
        grad.addColorStop(0.0, 'rgba(244, 208, 63, 0)'); // Inner gap
        grad.addColorStop(0.1, 'rgba(244, 208, 63, 0.6)'); 
        grad.addColorStop(0.3, 'rgba(244, 208, 63, 0.8)');
        grad.addColorStop(0.5, 'rgba(244, 208, 63, 0.1)'); // Cassini division (gap)
        grad.addColorStop(0.55, 'rgba(212, 172, 13, 0.7)');
        grad.addColorStop(1.0, 'rgba(183, 149, 11, 0)'); // Outer fade
    } else {
        // Uranus - Pale, thin rings
        grad.addColorStop(0.0, 'rgba(200, 230, 255, 0)');
        grad.addColorStop(0.4, 'rgba(200, 230, 255, 0.2)');
        grad.addColorStop(0.5, 'rgba(200, 230, 255, 0.1)'); // Gap
        grad.addColorStop(0.6, 'rgba(200, 230, 255, 0.2)');
        grad.addColorStop(1.0, 'rgba(200, 230, 255, 0)');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0,0,w,h);

    // Add noise (dust)
    for(let i=0; i<500; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.2})`;
        ctx.fillRect(Math.random()*w, 0, 1, h);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.rotation = Math.PI / 2; 
    texture.center.set(0.5, 0.5);
    return texture;
}

const createPlanetTexture = (type: string, colorHex: string, id: string): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512; // 2:1 Aspect Ratio for sphere mapping
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const width = 1024;
  const height = 512;
  
  // Helper function for noise
  const noise = (scale: number) => (Math.random() * scale) - (scale / 2);

  // Helper to draw irregular shapes (continents/patches)
  const drawIrregularShape = (cx: number, cy: number, avgRadius: number, color: string, roughness: number = 0.4) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    const points = 12;
    for(let i=0; i<=points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const r = avgRadius * (1 - roughness/2 + Math.random() * roughness);
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  // Base Fill defaults
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, width, height);

  if (id === 'sun') {
      // Fiery Sun
      const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
      grad.addColorStop(0, '#FFF176');
      grad.addColorStop(0.2, '#F57F17');
      grad.addColorStop(0.8, '#BF360C');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,width,height);
      
      // Plasma turbulence
      for(let i=0; i<200; i++) {
        ctx.fillStyle = `rgba(255, 200, 0, ${Math.random() * 0.4})`;
        const s = Math.random() * 80 + 10;
        ctx.beginPath();
        ctx.arc(Math.random()*width, Math.random()*height, s, 0, Math.PI*2);
        ctx.fill();
      }
  }
  else if (id === 'jupiter') {
      // Jupiter: Turbulence and Bands
      const bands = [
          { y: 0.1, color: '#6D4C41', width: 40 },
          { y: 0.3, color: '#D7CCC8', width: 60 },
          { y: 0.45, color: '#8D6E63', width: 50 },
          { y: 0.6, color: '#EFEBE9', width: 40 },
          { y: 0.8, color: '#5D4037', width: 50 },
      ];

      // Draw bands with waviness
      bands.forEach(band => {
          const yBase = band.y * height;
          ctx.fillStyle = band.color;
          ctx.beginPath();
          ctx.moveTo(0, yBase);
          for (let x = 0; x <= width; x+=20) {
              const wave = Math.sin(x * 0.02) * 15 + noise(10);
              ctx.lineTo(x, yBase + wave);
          }
          ctx.lineTo(width, yBase + band.width);
          for (let x = width; x >= 0; x-=20) {
             const wave = Math.sin(x * 0.02) * 15 + noise(10);
             ctx.lineTo(x, yBase + band.width + wave);
          }
          ctx.fill();
      });
      
      // Great Red Spot
      ctx.fillStyle = '#8D6E63';
      ctx.beginPath();
      ctx.ellipse(width * 0.7, height * 0.6, 80, 50, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 4;
      ctx.stroke();
  }
  else if (id === 'saturn') {
      // Saturn: Smooth Gold/Cream Gradients
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#C8A355'); // Darker gold top
      grad.addColorStop(0.2, '#F4D03F'); // Gold
      grad.addColorStop(0.5, '#FCF3CF'); // Cream equator
      grad.addColorStop(0.8, '#F4D03F');
      grad.addColorStop(1, '#C8A355');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,width,height);

      // Subtle bands
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      for(let y=0; y<height; y+=10) {
          if (Math.random() > 0.5) {
              ctx.fillRect(0, y, width, 2);
          }
      }
  }
  else if (id === 'earth') {
      // REBOOTED EARTH: Super Clean, No atmospheric noise
      // 1. Solid Ocean Base
      ctx.fillStyle = '#1565C0'; // Deep blue
      ctx.fillRect(0,0,width,height);
      
      // 2. Continents - Simple Green shapes
      const continentColor = '#4CAF50';
      const desertColor = '#D4E157';

      // Draw some random large continents
      for(let i=0; i<6; i++) {
          const cx = Math.random() * width;
          const cy = height * 0.2 + Math.random() * (height * 0.6); // Avoid poles
          const size = 50 + Math.random() * 120;
          
          // Main landmass
          drawIrregularShape(cx, cy, size, continentColor, 0.8);
          
          // Maybe add a desert patch inside
          if (Math.random() > 0.5) {
             drawIrregularShape(cx, cy, size * 0.4, desertColor, 0.5);
          }
      }

      // 3. Poles (Pure white caps) - Clean lines
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, 40); // North
      ctx.fillRect(0, height-40, width, 40); // South
  }
  else if (id === 'venus') {
      // Venus: Thick swirling clouds (Yellowish)
      ctx.fillStyle = '#FBC02D';
      ctx.fillRect(0,0,width,height);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      for(let i=0; i<100; i++) {
         const x = Math.random() * width;
         const y = Math.random() * height;
         const s = 100 + Math.random() * 200;
         ctx.beginPath();
         ctx.ellipse(x, y, s, s/2, Math.random()*Math.PI, 0, Math.PI*2);
         ctx.fill();
      }
  }
  else if (id === 'mars') {
      // Mars: Red/Rust with irregular dark patches
      ctx.fillStyle = '#D84315';
      ctx.fillRect(0,0,width,height);
      
      // Dark Patches
      for(let i=0; i<20; i++) {
          drawIrregularShape(
              Math.random() * width, 
              Math.random() * height, 
              30 + Math.random() * 50, 
              'rgba(62, 39, 35, 0.6)', 
              0.5
          );
      }
      // Ice Caps
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.ellipse(width/2, 20, 150, 30, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(width/2, height-20, 150, 30, 0, 0, Math.PI*2); ctx.fill();
  }
  else if (id === 'neptune') {
      // Neptune: Deep Blue, Wispy
      const grad = ctx.createLinearGradient(0,0,0,height);
      grad.addColorStop(0, '#1A237E');
      grad.addColorStop(0.5, '#2979FF');
      grad.addColorStop(1, '#1A237E');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,width,height);
      
      // Dark Spot
      ctx.fillStyle = 'rgba(0,0,50, 0.3)';
      ctx.beginPath();
      ctx.ellipse(width*0.7, height*0.5, 80, 50, 0, 0, Math.PI*2);
      ctx.fill();
      
      // Clouds
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      for(let i=0; i<10; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          ctx.fillRect(x, y, 60, 5);
      }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

interface MoonProps {
  planetSize: number;
  index: number;
  globalPaused: boolean;
}

const Moon: React.FC<MoonProps> = ({ planetSize, index, globalPaused }) => {
  const moonGroupRef = useRef<THREE.Group>(null);
  const speed = useMemo(() => 0.5 + Math.random() * 1.0, []);
  const distance = useMemo(() => planetSize + 0.8 + (index * 0.6), [planetSize, index]);
  const size = useMemo(() => 0.15 + Math.random() * 0.1, []);
  
  useFrame((state, delta) => {
    if (globalPaused) return;
    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.y += speed * delta;
    }
  });

  return (
    <group ref={moonGroupRef} rotation={[0, Math.random() * Math.PI * 2, 0]}>
      <mesh position={[distance, 0, 0]}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial color="#bdc3c7" roughness={0.8} />
      </mesh>
    </group>
  );
};

interface PlanetMeshProps {
  data: PlanetData;
  isSelected: boolean;
  isAnySelected: boolean;
  onClick: (id: string) => void;
  registerRef: (id: string, obj: THREE.Object3D | null) => void;
}

const PlanetMesh: React.FC<PlanetMeshProps> = ({ data, isSelected, isAnySelected, onClick, registerRef }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);
  const [hovered, setHovered] = useState(false);
  
  const texture = useMemo(() => createPlanetTexture(data.textureType, data.color, data.id), [data]);
  const ringTexture = useMemo(() => data.ringColor ? createRingTexture(data.id) : null, [data.ringColor, data.id]);

  // IMPORTANT: Dispose textures on unmount to avoid Context Lost due to memory leaks
  useEffect(() => {
    return () => {
      texture.dispose();
      if (ringTexture) ringTexture.dispose();
    };
  }, [texture, ringTexture]);

  useEffect(() => {
      if (orbitGroupRef.current) {
          orbitGroupRef.current.rotation.y = initialAngle;
      }
  }, [initialAngle]);

  useEffect(() => {
      if (meshRef.current) {
          registerRef(data.id, meshRef.current);
      }
      return () => registerRef(data.id, null);
  }, [data.id, registerRef]);

  useFrame((state, delta) => {
    if (!isAnySelected && orbitGroupRef.current && data.id !== 'sun') {
      orbitGroupRef.current.rotation.y += data.speed * delta * 20; 
    }
    const shouldRotateSelf = data.id === 'sun' || isSelected || !isAnySelected;
    if (shouldRotateSelf && meshRef.current) {
         meshRef.current.rotation.y += 0.005;
    }

    if (meshRef.current && data.id !== 'sun') {
      const targetScale = hovered ? 1.1 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  // Correct rotation for Uranus rings (Vertical)
  let ringRotation: [number, number, number] = [Math.PI / 2.2, 0, 0]; 
  if (data.id === 'uranus') {
     ringRotation = [0, 0, Math.PI / 2]; 
  }

  const showGlow = isSelected || hovered;
  const isSun = data.id === 'sun';

  return (
    <group ref={orbitGroupRef}>
      <group position={[data.distance, 0, 0]}>
        {/* Orbit Path */}
        {data.id !== 'sun' && !isSelected && !isAnySelected && (
           <mesh rotation={[Math.PI/2, 0, 0]} position={[-data.distance, 0, 0]}>
             <ringGeometry args={[data.distance - 0.05, data.distance + 0.05, 128]} />
             <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
           </mesh>
        )}

        <group>
            {/* Main Planet Body */}
            <mesh 
                ref={meshRef} 
                onClick={(e) => { e.stopPropagation(); onClick(data.id); }}
                onPointerOver={(e) => { 
                    e.stopPropagation();
                    document.body.style.cursor = 'pointer';
                    setHovered(true);
                }}
                onPointerOut={(e) => { 
                    document.body.style.cursor = 'auto';
                    setHovered(false);
                }}
            >
              <sphereGeometry args={[data.size, 64, 64]} />
              {isSun ? (
                 <meshBasicMaterial map={texture} color="#fff" />
              ) : (
                 <meshStandardMaterial 
                    map={texture}
                    roughness={0.8}
                    metalness={0.1}
                 />
              )}
            </mesh>

            {/* Resplendent Glow (Enhanced) */}
            {(isSun || showGlow) && (
                <mesh scale={isSun ? 1.3 : 1.2}>
                    <sphereGeometry args={[data.size, 32, 32]} />
                    <meshBasicMaterial 
                        color={isSun ? "#FFAB00" : data.color} 
                        transparent 
                        opacity={isSun ? 0.4 : 0.45} 
                        side={THREE.BackSide} 
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* Rings with Texture */}
            {data.ringColor && ringTexture && (
                <mesh rotation={ringRotation}>
                    <ringGeometry args={[data.size * 1.3, data.size * 2.2, 128]} />
                    <meshStandardMaterial 
                        map={ringTexture} 
                        transparent 
                        opacity={0.8} 
                        side={THREE.DoubleSide}
                        roughness={0.8} 
                    />
                </mesh>
            )}

            {/* Moons */}
            {Array.from({length: data.moons}).map((_, i) => (
                 <Moon key={i} index={i} planetSize={data.size} globalPaused={isAnySelected} />
            ))}
        </group>

        {/* Label */}
        {!isAnySelected && hovered && (
             <Html distanceFactor={15} position={[0, data.size + 1.5, 0]} style={{ pointerEvents: 'none' }}>
                <div className="text-white text-xl font-bold whitespace-nowrap bg-indigo-900/80 px-4 py-1 rounded-lg border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] space-font tracking-wider backdrop-blur-sm">
                    {data.name}
                </div>
            </Html>
        )}
      </group>
    </group>
  );
};

const CameraController: React.FC<{ 
    selectedPlanetId: string | null, 
    planetRefs: React.MutableRefObject<Record<string, THREE.Object3D>>
}> = ({ selectedPlanetId, planetRefs }) => {
    const isTransitioning = useRef(false);
    const prevSelectedId = useRef<string | null>(null);
    const targetPosRef = useRef(new THREE.Vector3(0, 50, 90));
    const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

    useEffect(() => {
        if (selectedPlanetId !== prevSelectedId.current) {
            isTransitioning.current = true;
            prevSelectedId.current = selectedPlanetId;
        }
    }, [selectedPlanetId]);

    useFrame((state) => {
        const controls = state.controls as any;
        let desiredLookAt = new THREE.Vector3(0, 0, 0);
        let desiredCamPos = new THREE.Vector3(0, 60, 100);

        if (selectedPlanetId && planetRefs.current[selectedPlanetId]) {
            const planetObj = planetRefs.current[selectedPlanetId];
            planetObj.getWorldPosition(desiredLookAt);
            const planet = PLANETS.find(p => p.id === selectedPlanetId);
            if (planet) {
                 const direction = desiredLookAt.clone().normalize();
                 if (direction.lengthSq() < 0.0001) direction.set(0, 0, 1);
                 const offsetDist = planet.size * 3.5 + 3.0; 
                 const heightOffset = planet.size * 0.5;
                 const sideOffset = planet.size * 0.5;
                 const sideVector = new THREE.Vector3(-direction.z, 0, direction.x).normalize().multiplyScalar(sideOffset);
                 desiredCamPos = desiredLookAt.clone()
                    .sub(direction.multiplyScalar(offsetDist))
                    .add(new THREE.Vector3(0, heightOffset, 0))
                    .add(sideVector);
            }
        }
        targetPosRef.current.copy(desiredCamPos);
        targetLookAtRef.current.copy(desiredLookAt);

        if (isTransitioning.current) {
            state.camera.position.lerp(targetPosRef.current, 0.04);
            if (controls) {
                controls.target.lerp(targetLookAtRef.current, 0.04);
                controls.update();
            }
            const posDist = state.camera.position.distanceTo(targetPosRef.current);
            const lookDist = controls ? controls.target.distanceTo(targetLookAtRef.current) : 0;
            if (posDist < 0.5 && lookDist < 0.5) {
                isTransitioning.current = false;
            }
        } else {
            if (controls) {
                controls.target.lerp(targetLookAtRef.current, 0.1);
                controls.update();
            }
        }
    });
    return null;
}

const SolarSystem: React.FC<Props> = ({ selectedPlanetId, onPlanetSelect }) => {
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const planetRefs = useRef<Record<string, THREE.Object3D>>({});

  const handleRegisterRef = (id: string, obj: THREE.Object3D | null) => {
      if (obj) planetRefs.current[id] = obj;
      else delete planetRefs.current[id];
  };

  useEffect(() => {
      const ambient = new Audio('https://assets.mixkit.co/active_storage/sfx/2658/2658-preview.mp3'); 
      ambient.loop = true;
      ambient.volume = 0.3;
      ambientAudioRef.current = ambient;
      if (!selectedPlanetId) {
          ambient.play().catch(e => {});
      }
      return () => {
          ambient.pause();
          ambient.src = "";
      };
  }, []);

  useEffect(() => {
      const audio = ambientAudioRef.current;
      if (!audio) return;
      if (selectedPlanetId) {
          audio.pause();
      } else {
          audio.volume = 0.3;
          audio.play().catch(e => {});
      }
  }, [selectedPlanetId]);

  const selectedPlanet = useMemo(() => PLANETS.find(p => p.id === selectedPlanetId), [selectedPlanetId]);
  const minDistance = useMemo(() => {
      if (selectedPlanet) return selectedPlanet.size * 1.3 + 1;
      return 10;
  }, [selectedPlanet]);

  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-black">
      <Canvas 
        camera={{ position: [0, 50, 90], fov: 40 }}
        dpr={[1, 1.5]} // Limit pixel ratio to prevent GPU crashes
        gl={{ 
          antialias: true, 
          powerPreference: "default", // Avoid forcing high-performance which can lead to context loss
          preserveDrawingBuffer: false 
        }}
      >
        <color attach="background" args={['#020205']} />
        
        {/* Richer Star Background */}
        <Stars radius={150} depth={50} count={7000} factor={4} saturation={0} fade speed={0.5} />
        <Sparkles count={500} scale={100} size={2} speed={0.4} opacity={0.5} color="#fff" />

        {/* Lighting for StandardMaterial */}
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={3} color="#FFD54F" distance={300} decay={1} />
        
        <group>
            {PLANETS.map((planet) => (
                <PlanetMesh 
                    key={planet.id} 
                    data={planet} 
                    isSelected={selectedPlanetId === planet.id}
                    isAnySelected={!!selectedPlanetId}
                    onClick={onPlanetSelect}
                    registerRef={handleRegisterRef}
                />
            ))}
        </group>

        <CameraController 
            selectedPlanetId={selectedPlanetId} 
            planetRefs={planetRefs}
        />
        
        <OrbitControls 
            makeDefault 
            enablePan={false} 
            enableZoom={true}
            enableRotate={true}
            minDistance={minDistance} 
            maxDistance={200} 
            enableDamping={true}
            dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default SolarSystem;
