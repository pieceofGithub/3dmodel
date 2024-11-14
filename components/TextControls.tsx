"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { HexColorPicker } from "react-colorful";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TextControlsProps {
  frontText: string;
  backText: string;
  textColor: string;
  textSize: number;
  side: "front" | "back" | "both";
  onFrontTextChange: (text: string) => void;
  onBackTextChange: (text: string) => void;
  onTextColorChange: (color: string) => void;
  onTextSizeChange: (size: number) => void;
  onSideChange: (side: "front" | "back" | "both") => void;
}

export default function TextControls({
  frontText,
  backText,
  textColor,
  textSize,
  side,
  onFrontTextChange,
  onBackTextChange,
  onTextColorChange,
  onTextSizeChange,
  onSideChange,
}: TextControlsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Text Position</Label>
        <Select value={side} onValueChange={onSideChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="front">Front Only</SelectItem>
            <SelectItem value="back">Back Only</SelectItem>
            <SelectItem value="both">Both Sides</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Front Text</Label>
        <Input
          value={frontText}
          onChange={(e) => onFrontTextChange(e.target.value)}
          placeholder="Enter front text"
        />
      </div>

      <div>
        <Label>Back Text</Label>
        <Input
          value={backText}
          onChange={(e) => onBackTextChange(e.target.value)}
          placeholder="Enter back text"
        />
      </div>

      <div>
        <Label>Text Size</Label>
        <Slider
          value={[textSize]}
          onValueChange={([value]) => onTextSizeChange(value)}
          min={0.02}
          max={0.1}
          step={0.01}
        />
      </div>

      <div>
        <Label>Text Color</Label>
        <HexColorPicker color={textColor} onChange={onTextColorChange} />
      </div>

      <div className="text-sm text-muted-foreground">
        Tip: Click and drag text on the T-shirt to reposition it
      </div>
    </div>
  );
}