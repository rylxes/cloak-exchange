
import React from "react";
import { Shield, Eye, EyeOff } from "lucide-react";

interface PrivacySettingsProps {
  stealthMode: boolean;
  onStealthModeChange: (enabled: boolean) => void;
  mixerCount: number;
  onMixerCountChange: (count: number) => void;
  privacyLevel: 'low' | 'medium' | 'high';
}

const PrivacySettings = ({
  stealthMode,
  onStealthModeChange,
  mixerCount,
  onMixerCountChange,
  privacyLevel,
}: PrivacySettingsProps) => {
  return (
    <div className="space-y-2 p-3 rounded-lg bg-white/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <span className="font-medium">Privacy Mode</span>
        </div>
        <button
          onClick={() => onStealthModeChange(!stealthMode)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          {stealthMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
      
      {stealthMode && (
        <>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Privacy Level</span>
            <span className={`font-medium ${
              privacyLevel === 'high' ? 'text-green-500' :
              privacyLevel === 'medium' ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {privacyLevel.charAt(0).toUpperCase() + privacyLevel.slice(1)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Mixer Count</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onMixerCountChange(Math.max(1, mixerCount - 1))}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
              >-</button>
              <span className="w-8 text-center">{mixerCount}</span>
              <button
                onClick={() => onMixerCountChange(Math.min(10, mixerCount + 1))}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
              >+</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PrivacySettings;
