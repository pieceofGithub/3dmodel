"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

export default function TShirtModel({
  color,
  texture,
}: {
  color: string;
  texture: string;
}) {
  // Load the GLTF model
  const tshirt_glb = useGLTF("/shirt_baked.glb");
  console.log(tshirt_glb);

  const { nodes, materials } = tshirt_glb;

  // Set up a reference for the mesh
  const meshRef = useRef<THREE.Mesh>(null);

  // Load texture if provided
  const textureLoader = new THREE.TextureLoader();
  const textureMap = texture ? textureLoader.load(texture) : null;

  // Rotate the shirt subtly over time
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={nodes.T_Shirt_male.geometry} // Use the geometry from the model
      material={materials.lambert1} // Use the material from the model
      position={[0, 0, 0]}
      scale={[1, 1.2, 1]}
    >
      <meshStandardMaterial
        color={color}
        map={textureMap || null}
        roughness={0.5}
        metalness={0.1}
      />
    </mesh>
  );
}
