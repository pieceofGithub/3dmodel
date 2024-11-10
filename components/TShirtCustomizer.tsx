"use client";

import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Image as ImageIcon, Download } from 'lucide-react';
import TShirtModel from './TShirtModel';

export default function TShirtCustomizer() {
  const [shirtColor, setShirtColor] = useState('#ffffff');
  const [texture, setTexture] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTexture(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'custom-tshirt.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 aspect-square bg-neutral-900 rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <TShirtModel color={shirtColor} texture={texture} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={1.5}
            maxDistance={4}
          />
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
              <Label htmlFor="texture">Upload Texture</Label>
              <Input
                ref={fileInputRef}
                id="texture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {texture && (
                <Button
                  variant="outline"
                  onClick={() => setTexture('')}
                  className="w-full"
                >
                  Remove Texture
                </Button>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        <Button onClick={handleDownload} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download Design
        </Button>
      </div>
    </div>
  );
}