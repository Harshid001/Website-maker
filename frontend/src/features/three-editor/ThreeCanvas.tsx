import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Mesh } from 'three';
import { defaultThreeScene, type ThreeSceneObject, type ThreeScenePreset } from './defaultThreeScene';

function SceneObjectMesh({ object }: { object: ThreeSceneObject }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && object.animation === 'rotate') {
      meshRef.current.rotation.y += delta * 0.7;
      meshRef.current.rotation.x += delta * 0.25;
    }
  });

  const geometry = {
    cube: <boxGeometry args={[1, 1, 1]} />,
    sphere: <sphereGeometry args={[0.7, 32, 32]} />,
    cone: <coneGeometry args={[0.7, 1.2, 32]} />,
    cylinder: <cylinderGeometry args={[0.55, 0.55, 1, 32]} />,
    plane: <planeGeometry args={[1, 1]} />,
  }[object.type] || <boxGeometry args={[1, 1, 1]} />;

  return (
    <mesh
      ref={meshRef}
      position={object.position}
      rotation={object.rotation || [0, 0, 0]}
      scale={object.scale || [1, 1, 1]}
    >
      {geometry}
      <meshStandardMaterial color={object.color || '#6366f1'} roughness={0.45} metalness={0.12} />
    </mesh>
  );
}

export default function ThreeCanvas({ scene = defaultThreeScene }: { scene?: ThreeScenePreset }) {
  const ambient = scene.lights.find((light) => light.type === 'ambient');
  const directional = scene.lights.find((light) => light.type === 'directional');

  return (
    <div className="h-full min-h-[420px] w-full overflow-hidden rounded-2xl bg-slate-950">
      <Canvas camera={{ position: scene.camera, fov: 48 }}>
        <color attach="background" args={[scene.background]} />
        <ambientLight intensity={ambient?.intensity || 0.6} color={ambient?.color || '#ffffff'} />
        <directionalLight
          position={directional?.position || [4, 6, 5]}
          intensity={directional?.intensity || 1.1}
          color={directional?.color || '#ffffff'}
        />
        <group rotation={[0.12, -0.35, 0]}>
          {scene.objects.map((object) => (
            <SceneObjectMesh key={object.id} object={object} />
          ))}
        </group>
        <gridHelper args={[6, 12, '#334155', '#1e293b']} position={[0, -1.1, 0]} />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
      </Canvas>
    </div>
  );
}
