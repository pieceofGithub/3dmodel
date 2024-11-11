"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ImageIcon } from "lucide-react";
import { compressImage } from "@/lib/imageUtils";

interface TextureControlsProps {
  texture: string;
  onTextureChange: (texture: string) => void;
  scale: { x: number; y: number };
  position: { x: number; y: number };
  onScaleChange: (scale: { x: number; y: number }) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

export default function TextureControls({
  texture,
  onTextureChange,
  scale,
  position,
  onScaleChange,
  onPositionChange,
}: TextureControlsProps) {
  const [dragActive, setDragActive] = useState(false);

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
        <Label htmlFor="texture" className="block text-center">
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
          <div className="space-y-2">
            <Label>Scale X</Label>
            <Slider
              value={[scale.x]}
              onValueChange={([value]) => onScaleChange({ ...scale, x: value })}
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
              onValueChange={([value]) => onScaleChange({ ...scale, y: value })}
              min={0.1}
              max={3}
              step={0.1}
              className="my-2"
            />
          </div>

          <div className="space-y-2">
            <Label>Position X</Label>
            <Slider
              value={[position.x]}
              onValueChange={([value]) =>
                onPositionChange({ ...position, x: value })
              }
              min={-1}
              max={1}
              step={0.1}
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
              step={0.1}
              className="my-2"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => onTextureChange("")}
            className="w-full"
          >
            Remove Texture
          </Button>
        </>
      )}
    </div>
  );
}
