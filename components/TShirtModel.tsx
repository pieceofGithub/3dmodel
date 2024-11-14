"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, Text } from "@react-three/drei";

interface TShirtModelProps {
  color: string;
  texture: string;
  rotation?: number;
  textureScale: { x: number; y: number };
  texturePosition: { x: number; y: number };
  textureRotation: number;
  textureOpacity: number;
  textureBlendMode: THREE.BlendingDstFactor;
  text?: string;
  textColor?: string;
  textSize?: number;
  textPosition?: { x: number; y: number; z?: number };
  textRotation?: number;
  fontFamily?: string;
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
  text,
  textColor = "#000000",
  textSize = 0.1,
  textPosition = { x: 0, y: 0.5, z: 0.1 },
  textRotation = 0,
  fontFamily = "/fonts/Roboto-Bold.ttf",
}: TShirtModelProps) {
  const shirt_baked = useGLTF("/t_shirt.glb");
  const { nodes } = shirt_baked;
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
        loadedTexture.center.set(0.5, 0.5); // Center for rotation

        // Update material with loaded texture
        if (materialRef.current) {
          materialRef.current.map = loadedTexture;
          materialRef.current.transparent = true;
          materialRef.current.opacity = textureOpacity;
          materialRef.current.blending = THREE.CustomBlending;
          materialRef.current.blendSrc = THREE.SrcAlphaFactor;
          materialRef.current.blendDst = textureBlendMode;
          materialRef.current.blendEquation = THREE.AddEquation;
          materialRef.current.needsUpdate = true;
        }
      });
    } else if (materialRef.current) {
      // Clear the texture if not available
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
    <group>
      {/* T-shirt model */}
      <mesh
        ref={meshRef}
        geometry={nodes.T_Shirt_male.geometry}
        scale={[1, 1.2, 1]}
        position={[0, 0.3, 0]} // Adjust to lift model
      >
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* Text overlay */}
      {text && (
        <Text
          position={[textPosition.x, textPosition.y, textPosition.z || 0.1]}
          rotation={[0, 0, (textRotation * Math.PI) / 180]}
          fontSize={textSize}
          color={textColor}
          font={fontFamily}
        >
          {text}
        </Text>
      )}
    </group>
  );
}
