"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

interface TShirtModelProps {
  color: string;
  texture: string;
  rotation?: number;
  textureScale: { x: number; y: number };
  texturePosition: { x: number; y: number };
  textureRotation: number;
  textureOpacity: number;
  textureBlendMode: THREE.BlendingDestinationFactor;
}

export default function TShirtModel({
  color,
  texture,
  rotation = 0,
  textureScale,
  texturePosition,
  textureRotation,
  textureOpacity,
  textureBlendMode,
}: TShirtModelProps) {
  const { nodes, materials } = useGLTF("/shirt_baked.glb");
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    if (texture && materialRef.current) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(texture, (loadedTexture) => {
        loadedTexture.flipY = false;
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.RepeatWrapping;

        // Apply transformations
        loadedTexture.repeat.set(textureScale.x, textureScale.y);
        loadedTexture.offset.set(texturePosition.x, texturePosition.y);
        loadedTexture.rotation = (textureRotation * Math.PI) / 180;
        loadedTexture.center.set(0.5, 0.5); // Set rotation center to middle of texture

        if (materialRef.current) {
          materialRef.current.map = loadedTexture;
          materialRef.current.transparent = true;
          materialRef.current.opacity = textureOpacity;
          materialRef.current.blendDst = textureBlendMode;
          materialRef.current.needsUpdate = true;
        }
      });
    } else if (materialRef.current) {
      materialRef.current.map = null;
      materialRef.current.transparent = false;
      materialRef.current.opacity = 1;
      materialRef.current.needsUpdate = true;
    }
  }, [
    texture,
    textureScale,
    texturePosition,
    textureRotation,
    textureOpacity,
    textureBlendMode,
  ]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        rotation + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={nodes.T_Shirt_male.geometry}
      scale={[1, 1.2, 1]}
    >
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        roughness={0.5}
        metalness={0.1}
      />
    </mesh>
  );
}
