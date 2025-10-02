import { useState, useEffect, useCallback } from "react";
import { useSettings } from "@/lib/settings-provider";

export interface AIPreset {
  id: string;
  name: string;
  provider: "openai" | "native-ollama" | "custom" | "screenpipe-cloud";
  model: string;
  contextLength?: string;
  description?: string;
  url?: string;
  apiKey?: string;
}

export function useAiPresets() {
  const { settings, updateSettings } = useSettings();
  const [availablePresets, setAvailablePresets] = useState<AIPreset[]>([]);

  // Get selected preset from settings (following obsidian pipe pattern)
  const selectedPresetId = (settings as any)?.aiPresetId;
  const selectedPreset = availablePresets.find(preset => preset.id === selectedPresetId) || null;

  // Generate presets from settings
  useEffect(() => {
    if (!settings) return;

    const presets: AIPreset[] = [];

    // Check if there are aiPresets in screenpipe settings
    const screenpipeSettings = settings.screenpipeAppSettings as any;
    if (screenpipeSettings?.aiPresets && Array.isArray(screenpipeSettings.aiPresets)) {
      screenpipeSettings.aiPresets.forEach((preset: any) => {
        presets.push({
          id: preset.id,
          name: preset.name || `${preset.provider} - ${preset.model}`,
          provider: preset.provider,
          model: preset.model,
          contextLength: preset.maxContextChars ? `${preset.maxContextChars} chars` : "Unknown",
          description: preset.description || "Screenpipe AI preset",
          url: preset.url,
          apiKey: preset.apiKey,
        });
      });
    }

    // Also check if there are aiPresets in global settings (like obsidian pipe does)
    const globalSettings = settings as any;
    if (globalSettings.aiPresets && Array.isArray(globalSettings.aiPresets)) {
      globalSettings.aiPresets.forEach((preset: any) => {
        // Avoid duplicates
        if (!presets.find(p => p.id === preset.id)) {
          presets.push({
            id: preset.id,
            name: preset.name || `${preset.provider} - ${preset.model}`,
            provider: preset.provider,
            model: preset.model,
            contextLength: preset.contextLength || preset.context || preset.maxContextChars ? `${preset.maxContextChars} chars` : "Unknown",
            description: preset.description || "Configured AI preset",
            url: preset.url,
            apiKey: preset.apiKey,
          });
        }
      });
    }

    // Mark the currently selected model in the presets (don't add duplicate)
    if (settings.screenpipeAppSettings?.aiModel) {
      const currentModel = settings.screenpipeAppSettings.aiModel;
      const currentPreset = presets.find(p => p.model === currentModel);
      
      if (currentPreset) {
        // Mark this preset as currently selected
        currentPreset.description = currentPreset.description + " (currently selected)";
      }
      
    }

    // Always add OpenRouter option as a preset if API key is configured
    if (settings?.openrouterApiKey) {
      presets.push({
        id: "openrouter-qwen",
        name: "OpenRouter - Qwen QwQ 32B",
        provider: "custom",
        model: "qwen/qwq-32b:free",
        contextLength: "32k",
        description: "Free tier model via OpenRouter",
        url: "https://openrouter.ai/api/v1",
        apiKey: settings.openrouterApiKey,
      });
    }

    setAvailablePresets(presets);
  }, [settings]);

  // Set default selected preset when presets are available and none is selected
  useEffect(() => {
    if (!selectedPresetId && availablePresets.length > 0) {
      // Try to select the current screenpipe model first, or the first available preset
      const currentModel = settings?.screenpipeAppSettings?.aiModel;
      const defaultPreset = availablePresets.find(p => p.model === currentModel) || availablePresets[0];
      if (defaultPreset && updateSettings) {
        updateSettings({
          ...settings,
          aiPresetId: defaultPreset.id,
        } as any);
      }
    }
  }, [availablePresets, selectedPresetId, settings, updateSettings]);

  const getPreset = useCallback(() => {
    return selectedPreset;
  }, [selectedPreset]);

  const selectPreset = useCallback(async (preset: AIPreset) => {
    if (updateSettings) {
      await updateSettings({
        ...settings,
        aiPresetId: preset.id,
      } as any);
    }
  }, [settings, updateSettings]);

  return {
    availablePresets,
    selectedPreset,
    getPreset,
    selectPreset,
  };
}