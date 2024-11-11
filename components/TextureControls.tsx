"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, Move, Maximize2, RotateCw, Droplets } from "lucide-react";
import { compressImage } from "@/lib/imageUtils";

interface TextureControlsProps {
  texture: string;
  onTextureChange: (texture: string) => void;
  scale: { x: number; y: number };
  position: { x: number; y: number };
  rotation: number;
  opacity: number;
  blendMode: THREE.BlendingDestinationFactor;
  onScaleChange: (scale: { x: number; y: number }) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onRotationChange: (rotation: number) => void;
  onOpacityChange: (opacity: number) => void;
  onBlendModeChange: (mode: THREE.BlendingDestinationFactor) => void;
}

const blendModes = [
  { value: "OneMinusSrcAlphaFactor", label: "Normal" },
  { value: "SrcAlphaFactor", label: "Multiply" },
  { value: "OneMinusDstColorFactor", label: "Screen" },
  { value: "OneFactor", label: "Overlay" },
  { value: "DstColorFactor", label: "Soft Light" },
];

export default function TextureControls({
  texture,
  onTextureChange,
  scale,
  position,
  rotation,
  opacity,
  blendMode,
  onScaleChange,
  onPositionChange,
  onRotationChange,
  onOpacityChange,
  onBlendModeChange,
}: TextureControlsProps) {
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"position" | "scale" | "effects">(
    "position"
  );

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const compressedImage = await compressImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          onTextureChange(event.target?.result as string);
        };
        reader.readAsDataURL(compressedImage);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          onTextureChange(event.target?.result as string);
        };
        reader.readAsDataURL(compressedImage);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragActive ? "border-primary bg-primary/10" : "border-border"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Label htmlFor="texture" className="block text-center cursor-pointer">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          Drag & drop image or click to upload
        </Label>
        <Input
          id="texture"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {texture && (
        <>
          <div className="flex gap-2 mb-4">
            {[
              { id: "position", icon: Move, label: "Position" },
              { id: "scale", icon: Maximize2, label: "Scale" },
              { id: "effects", icon: Droplets, label: "Effects" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className="flex-1"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          {activeTab === "position" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Position X</Label>
                <Slider
                  value={[position.x]}
                  onValueChange={([value]) =>
                    onPositionChange({ ...position, x: value })
                  }
                  min={-1}
                  max={1}
                  step={0.01}
                  className="my-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Position Y</Label>
                <Slider
                  value={[position.y]}
                  onValueChange={([value]) =>
                    onPositionChange({ ...position, y: value })
                  }
                  min={-1}
                  max={1}
                  step={0.01}
                  className="my-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Rotation</Label>
                <Slider
                  value={[rotation]}
                  onValueChange={([value]) => onRotationChange(value)}
                  min={0}
                  max={360}
                  step={1}
                  className="my-2"
                />
              </div>
            </div>
          )}

          {activeTab === "scale" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Scale X</Label>
                <Slider
                  value={[scale.x]}
                  onValueChange={([value]) =>
                    onScaleChange({ ...scale, x: value })
                  }
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="my-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Scale Y</Label>
                <Slider
                  value={[scale.y]}
                  onValueChange={([value]) =>
                    onScaleChange({ ...scale, y: value })
                  }
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="my-2"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => onScaleChange({ x: 1, y: 1 })}
                className="w-full"
              >
                Reset Scale
              </Button>
            </div>
          )}

          {activeTab === "effects" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Opacity</Label>
                <Slider
                  value={[opacity]}
                  onValueChange={([value]) => onOpacityChange(value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="my-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Blend Mode</Label>
                <Select
                  value={blendMode.toString()}
                  onValueChange={(value) =>
                    onBlendModeChange(
                      Number(value) as THREE.BlendingDestinationFactor
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blendModes.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => onTextureChange("")}
            className="w-full mt-4"
          >
            Remove Texture
          </Button>
        </>
      )}
    </div>
  );
}
