
import React from "react";
import { Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SwapSettings } from "@/types/crypto";

interface AdvancedSettingsProps {
  settings: SwapSettings;
  onSettingsChange: (settings: SwapSettings) => void;
}

const AdvancedSettings = ({ settings, onSettingsChange }: AdvancedSettingsProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Settings2 className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Advanced Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Slippage Tolerance ({settings.slippageTolerance}%)</Label>
            <Slider
              value={[settings.slippageTolerance]}
              onValueChange={([value]) =>
                onSettingsChange({ ...settings, slippageTolerance: value })
              }
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <Label>Gas Speed</Label>
            <div className="flex gap-4">
              {["slow", "standard", "fast"].map((speed) => (
                <button
                  key={speed}
                  onClick={() =>
                    onSettingsChange({ ...settings, gasSpeed: speed as SwapSettings["gasSpeed"] })
                  }
                  className={`flex-1 p-2 rounded-lg transition-colors ${
                    settings.gasSpeed === speed
                      ? "bg-accent text-accent-foreground"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {speed.charAt(0).toUpperCase() + speed.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Custom Routing</Label>
            <Switch
              checked={settings.customRoute}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...settings, customRoute: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Bridge Preference</Label>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  onSettingsChange({ ...settings, bridgePreference: "native" })
                }
                className={`px-3 py-1 rounded-lg transition-colors ${
                  settings.bridgePreference === "native"
                    ? "bg-accent text-accent-foreground"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                Native
              </button>
              <button
                onClick={() =>
                  onSettingsChange({ ...settings, bridgePreference: "wrapped" })
                }
                className={`px-3 py-1 rounded-lg transition-colors ${
                  settings.bridgePreference === "wrapped"
                    ? "bg-accent text-accent-foreground"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                Wrapped
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSettings;
