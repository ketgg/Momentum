"use client"

import { useSettings } from "../settings-provider"
import { useState } from "react"

export function GenericSettings() {
  const { settings, updateSettings, loading } = useSettings()
  const [isSaving, setIsSaving] = useState(false)

  if (loading) {
    return <div>loading settings...</div>
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSettings(settings!)
      // Settings saved successfully
    } catch (error) {
      // Handle save error silently
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full max-w-2xl p-4 border rounded-lg">
      <h2 className="text-lg font-medium mb-4">Settings</h2>

      {/* OpenRouter API Key Setting */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            OpenRouter API Key
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={settings?.openrouterApiKey || ""}
            onChange={(e) =>
              updateSettings({
                ...settings!,
                openrouterApiKey: e.target.value,
              })
            }
            placeholder="Enter your OpenRouter API key (optional)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Providing an OpenRouter API key will add OpenRouter models to the AI preset selector.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  )
}
