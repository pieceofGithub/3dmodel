"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PresentationControls } from "@react-three/drei";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette,
  ImageIcon,
  Download,
  RotateCcw,
  Repeat2,
  Share2,
} from "lucide-react";
import TShirtModel from "./TShirtModel";
import TextureControls from "./TextureControls";

export default function TShirtCustomizer() {
  const [shirtColor, setShirtColor] = useState("#ffffff");
  const [texture, setTexture] = useState("");
  const [rotation, setRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [textureScale, setTextureScale] = useState({ x: 1, y: 1 });
  const [texturePosition, setTexturePosition] = useState({ x: 0, y: 0 });
  const [textureRotation, setTextureRotation] = useState(0);
  const [textureOpacity, setTextureOpacity] = useState(1);
  const [textureBlendMode, setTextureBlendMode] =
    useState<THREE.BlendingDestinationFactor>(201); // Normal blend mode

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = "custom-tshirt.png";
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    const canvas = document.querySelector("canvas");
    if (canvas && navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], "custom-tshirt.png", {
              type: "image/png",
            });
            await navigator.share({
              title: "My Custom T-Shirt Design",
              text: "Check out my custom t-shirt design!",
              files: [file],
            });
          }
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  const resetDesign = () => {
    setShirtColor("#ffffff");
    setTexture("");
    setRotation(0);
    setTextureScale({ x: 1, y: 1 });
    setTexturePosition({ x: 0, y: 0 });
    setTextureRotation(0);
    setTextureOpacity(1);
    setTextureBlendMode(201);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 aspect-square bg-neutral-900 rounded-lg overflow-hidden relative">
        <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          {autoRotate ? (
            <PresentationControls
              global
              rotation={[0, rotation, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 2]}
            >
              <TShirtModel
                color={shirtColor}
                texture={texture}
                textureScale={textureScale}
                texturePosition={texturePosition}
                textureRotation={textureRotation}
                textureOpacity={textureOpacity}
                textureBlendMode={textureBlendMode}
              />
            </PresentationControls>
          ) : (
            <>
              <TShirtModel
                color={shirtColor}
                texture={texture}
                rotation={rotation}
                textureScale={textureScale}
                texturePosition={texturePosition}
                textureRotation={textureRotation}
                textureOpacity={textureOpacity}
                textureBlendMode={textureBlendMode}
              />
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={1.5}
                maxDistance={4}
              />
            </>
          )}
        </Canvas>
      </div>

      <div className="space-y-4">
        <Card className="p-6">
          <Tabs defaultValue="color">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="color">
                <Palette className="w-4 h-4 mr-2" />
                Color
              </TabsTrigger>
              <TabsTrigger value="texture">
                <ImageIcon className="w-4 h-4 mr-2" />
                Texture
              </TabsTrigger>
            </TabsList>

            <TabsContent value="color" className="space-y-4">
              <Label>T-Shirt Color</Label>
              <HexColorPicker color={shirtColor} onChange={setShirtColor} />
            </TabsContent>

            <TabsContent value="texture" className="space-y-4">
              <TextureControls
                texture={texture}
                onTextureChange={setTexture}
                scale={textureScale}
                position={texturePosition}
                rotation={textureRotation}
                opacity={textureOpacity}
                blendMode={textureBlendMode}
                onScaleChange={setTextureScale}
                onPositionChange={setTexturePosition}
                onRotationChange={setTextureRotation}
                onOpacityChange={setTextureOpacity}
                onBlendModeChange={setTextureBlendMode}
              />
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Auto Rotation</Label>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setAutoRotate(!autoRotate)}
                className={
                  autoRotate ? "bg-primary text-primary-foreground" : ""
                }
              >
                <Repeat2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button onClick={handleDownload} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleShare} className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={resetDesign} className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
