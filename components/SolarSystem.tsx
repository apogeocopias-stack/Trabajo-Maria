import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Outlines } from '@react-three/drei';
import * as THREE from 'three';
import { PLANETS } from '../constants';
import { PlanetData } from '../types';

interface Props {
  selectedPlanetId: string | null;
  onPlanetSelect: (id: string) => void;
}

// --- Procedural Texture Generation ---
// Creates consistent, crisp vector-style textures in memory without external URLs

const createPlanetTexture = (type: string, colorHex: string, id: string): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const baseColor = new THREE.Color(colorHex);
  
  // Background
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 512, 512);

  if (id === 'sun') {
      // Bright radiant center
      const grad = ctx.createRadialGradient(256,256, 100, 256,256, 500);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.2, '#FDB813');
      grad.addColorStop(1, '#e67e22');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,512,512);
  }
  else if (type === 'gaseous') {
      // Stripes
      const darker = baseColor.clone().multiplyScalar(0.8).getStyle();
      const lighter = baseColor.clone().offsetHSL(0,0,0.1).getStyle();
      
      for(let i=0; i<10; i++) {
          ctx.fillStyle = i % 2 === 0 ? darker : lighter;
          const y = (i * 50) + (Math.random() * 10);
          const h = 40 + Math.random() * 20;
          ctx.fillRect(0, y, 512, h);
      }
      
      // Storm (Jupiter spot)
      if (id === 'jupiter') {
          ctx.beginPath();
          ctx.fillStyle = '#c0392b';
          ctx.ellipse(350, 350, 60, 40, 0, 0, Math.PI*2);
          ctx.fill();
      }
  } else if (type === 'rocky') {
      // Craters / Continents
      const darker = baseColor.clone().multiplyScalar(0.7).getStyle();
      const lighter = baseColor.clone().offsetHSL(0,0,0.15).getStyle();
      
      ctx.fillStyle = darker;
      
      // Draw random craters/blobs
      for(let i=0; i<15; i++) {
         const x = Math.random() * 512;
         const y = Math.random() * 512;
         const r = Math.random() * 40 + 10;
         ctx.beginPath();
         ctx.arc(x,y,r,0,Math.PI*2);
         ctx.fill();
      }
      
      if (id === 'earth') {
          // Blue water background already set (from planet color)
          // Draw green continents
          ctx.fillStyle = '#2ecc71';
          // Simple blobby shapes for continents
          for(let k=0; k<5; k++) {
              const x = Math.random() * 512;
              const y = Math.random() * 512;
              const s = Math.random() * 100 + 50;
              ctx.beginPath();
              ctx.arc(x,y,s,0,Math.PI*2);
              ctx.fill();
          }
          // Clouds
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          for(let k=0; k<8; k++) {
              const x = Math.random() * 512;
              const y = Math.random() * 512;
              const w = Math.random() * 100 + 20;
              ctx.fillRect(x,y,w,20);
          }
      }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

// --- Gradient Map for Toon Shading ---
const createGradientMap = () => {
    const colors = new Uint8Array([64, 128, 192, 255]);
    const texture = new THREE.DataTexture(colors, 4, 1, THREE.RedFormat);
    texture.needsUpdate = true;
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
  const initialRotation = useMemo(() => Math.random() * Math.PI * 2, []);
  
  useFrame((state, delta) => {
    if (globalPaused) return;
    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.y += speed * delta;
    }
  });

  return (
    <group ref={moonGroupRef} rotation={[0, initialRotation, 0]}>
      <mesh position={[distance, 0, 0]}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshToonMaterial color="#bdc3c7" />
        <Outlines thickness={1} color="black" />
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
  
  // Generate persistent textures
  const texture = useMemo(() => createPlanetTexture(data.textureType, data.color, data.id), [data]);
  const gradientMap = useMemo(() => createGradientMap(), []);

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
    // Orbit
    if (!isAnySelected && orbitGroupRef.current && data.id !== 'sun') {
      orbitGroupRef.current.rotation.y += data.speed * delta * 20; 
    }

    // Rotation
    const shouldRotateSelf = data.id === 'sun' || isSelected || !isAnySelected;
    if (shouldRotateSelf && meshRef.current) {
         meshRef.current.rotation.y += 0.005;
    }

    // Hover Animation (Scale + Highlight)
    if (meshRef.current) {
      const targetScale = hovered ? 1.25 : 1.0;
      const lerpSpeed = 0.1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), lerpSpeed);
    }
  });

  return (
    <group ref={orbitGroupRef}>
      <group position={[data.distance, 0, 0]}>
        {/* Orbit Track */}
        {data.id !== 'sun' && !isSelected && !isAnySelected && (
           <mesh rotation={[Math.PI/2, 0, 0]} position={[-data.distance, 0, 0]}>
             <ringGeometry args={[data.distance - 0.15, data.distance + 0.15, 64]} />
             <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
           </mesh>
        )}

        {/* Planet Body */}
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
          
          {data.id === 'sun' ? (
             // Sun glows and doesn't have outlines
             <meshBasicMaterial map={texture} color="#fff" />
          ) : (
             // Toon Shader for everyone else
             <meshToonMaterial 
                color={data.color}
                map={texture}
                gradientMap={gradientMap}
                emissive={data.color}
                emissiveIntensity={hovered ? 0.4 : 0.2} // Increased base emissive slightly
             />
          )}
          
          {/* Vector-style Outline - Skip for Sun */}
          {data.id !== 'sun' && (
              <Outlines thickness={1.5} color="#000000" screenspace opacity={1} transparent={false} angle={0} />
          )}
        </mesh>

        {/* Rings (Saturn/Uranus) */}
        {data.ringColor && (
            <mesh rotation={[Math.PI / 2.3, 0, 0]}>
                <ringGeometry args={[data.size * 1.4, data.size * 2.3, 64]} />
                <meshToonMaterial color={data.ringColor} transparent opacity={0.9} side={THREE.DoubleSide} />
                <Outlines thickness={0.02} color="black" />
            </mesh>
        )}

        {/* Moons */}
        {Array.from({length: data.moons}).map((_, i) => (
             <Moon key={i} index={i} planetSize={data.size} globalPaused={isAnySelected} />
        ))}

        {/* Name Label */}
        {!isAnySelected && hovered && (
             <Html distanceFactor={15} position={[0, data.size + 1.5, 0]} style={{ pointerEvents: 'none' }}>
                <div className="text-white text-xl font-bold whitespace-nowrap bg-black px-4 py-1 rounded-lg border-2 border-white shadow-lg space-font tracking-wider">
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
    playZoomSound: () => void,
    planetRefs: React.MutableRefObject<Record<string, THREE.Object3D>>
}> = ({ selectedPlanetId, playZoomSound, planetRefs }) => {
    const isTransitioning = useRef(false);
    const prevSelectedId = useRef<string | null>(null);
    
    // Refs to hold the target values to lerp towards
    const targetPosRef = useRef(new THREE.Vector3(0, 50, 90));
    const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

    useEffect(() => {
        // Trigger transition animation when selection changes
        if (selectedPlanetId !== prevSelectedId.current) {
            isTransitioning.current = true;
            prevSelectedId.current = selectedPlanetId;
            if (selectedPlanetId) {
                playZoomSound();
            }
        }
    }, [selectedPlanetId, playZoomSound]);

    useFrame((state) => {
        const controls = state.controls as any;
        
        // 1. Calculate Desired Target Coordinates based on current selection
        // We do this every frame because even though planets are paused, robust logic is better.
        let desiredLookAt = new THREE.Vector3(0, 0, 0);
        let desiredCamPos = new THREE.Vector3(0, 60, 100); // Overview default

        if (selectedPlanetId && planetRefs.current[selectedPlanetId]) {
            const planetObj = planetRefs.current[selectedPlanetId];
            planetObj.getWorldPosition(desiredLookAt);
            
            const planet = PLANETS.find(p => p.id === selectedPlanetId);
            if (planet) {
                 // Calculate position: "Lit Side" (between Sun and Planet)
                 const direction = desiredLookAt.clone().normalize();
                 if (direction.lengthSq() < 0.0001) direction.set(0, 0, 1);
                 
                 // Distance logic
                 const offsetDist = planet.size * 3.5 + 3.0; 
                 const heightOffset = planet.size * 0.5;
                 const sideOffset = planet.size * 0.5;

                 // Sideways shift for composition
                 const sideVector = new THREE.Vector3(-direction.z, 0, direction.x).normalize().multiplyScalar(sideOffset);

                 desiredCamPos = desiredLookAt.clone()
                    .sub(direction.multiplyScalar(offsetDist)) // Move towards sun
                    .add(new THREE.Vector3(0, heightOffset, 0))
                    .add(sideVector);
            }
        }

        targetPosRef.current.copy(desiredCamPos);
        targetLookAtRef.current.copy(desiredLookAt);

        // 2. Transition Logic
        if (isTransitioning.current) {
            // Autopilot Mode: Fly camera to target
            state.camera.position.lerp(targetPosRef.current, 0.04);
            
            if (controls) {
                controls.target.lerp(targetLookAtRef.current, 0.04);
                controls.update();
            }

            // Check for arrival
            const posDist = state.camera.position.distanceTo(targetPosRef.current);
            const lookDist = controls ? controls.target.distanceTo(targetLookAtRef.current) : 0;
            
            // If close enough, disable autopilot
            if (posDist < 0.5 && lookDist < 0.5) {
                isTransitioning.current = false;
            }
        } else {
            // Manual Mode: User has control
            // We ONLY update the control target so rotation happens around the planet
            if (controls) {
                // Use a soft lerp to keep the target centered on the planet 
                // (in case it was moving, though it's paused now)
                controls.target.lerp(targetLookAtRef.current, 0.1);
                controls.update();
            }
            // CRITICAL: We DO NOT update state.camera.position here. 
            // OrbitControls handles position based on user mouse input.
        }
    });

    return null;
}

const SolarSystem: React.FC<Props> = ({ selectedPlanetId, onPlanetSelect }) => {
  const zoomAudioRef = useRef<HTMLAudioElement | null>(null);
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
      
      // Only start playing if we are in space initially
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
          // Stop melody when on a planet
          audio.pause();
      } else {
          // Resume melody when back in space
          audio.volume = 0.3;
          audio.play().catch(e => {});
      }
  }, [selectedPlanetId]);

  const playZoomSound = () => {
      if (!zoomAudioRef.current) {
          zoomAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1407/1407-preview.mp3'); 
          zoomAudioRef.current.volume = 0.5;
      }
      zoomAudioRef.current.currentTime = 0;
      zoomAudioRef.current.play().catch(e => {});
  };

  // Dynamic minDistance calculation
  const selectedPlanet = useMemo(() => PLANETS.find(p => p.id === selectedPlanetId), [selectedPlanetId]);
  const minDistance = useMemo(() => {
      if (selectedPlanet) return selectedPlanet.size * 1.3 + 1;
      return 10; // Overview min distance
  }, [selectedPlanet]);

  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 50, 90], fov: 40 }}>
        <color attach="background" args={['#050510']} />
        <Stars radius={150} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        
        <ambientLight intensity={0.8} />
        <pointLight position={[0, 0, 0]} intensity={2.5} color="#fff" distance={300} />
        
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
            playZoomSound={playZoomSound}
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