"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAiPresets, type AIPreset } from "@/lib/hooks/use-ai-presets"

interface AIPresetSelectorProps {
  className?: string
  onPresetSelect?: (preset: AIPreset) => void
}

export function AIPresetSelector({ className, onPresetSelect }: AIPresetSelectorProps) {
  const [open, setOpen] = useState(false)
  const { availablePresets, selectedPreset, selectPreset } = useAiPresets()

  const handleSelect = (presetId: string) => {
    const preset = availablePresets.find(p => p.id === presetId)
    if (preset) {
      selectPreset(preset)
      setOpen(false)
      onPresetSelect?.(preset)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between min-w-0", className)}
        >
          {selectedPreset ? (
            <div className="flex flex-col items-start text-left min-w-0 flex-1">
              <span className="font-medium truncate w-full">{selectedPreset.name}</span>
              <span className="text-xs text-muted-foreground truncate w-full">
                {selectedPreset.provider} • {selectedPreset.model} • {selectedPreset.contextLength}
              </span>
            </div>
          ) : (
            "Select AI preset..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search presets..." />
          <CommandList>
            <CommandEmpty>No presets found.</CommandEmpty>
            <CommandGroup>
              {availablePresets.map((preset) => (
                <CommandItem
                  key={preset.id}
                  value={preset.id}
                  onSelect={() => handleSelect(preset.id)}
                  className="flex items-start gap-2 p-3"
                >
                  <Check
                    className={cn(
                      "mt-1 h-4 w-4",
                      selectedPreset?.id === preset.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{preset.name}</span>
                      {preset.description?.includes("currently selected") && (
                        <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                          current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span className="capitalize">{preset.provider}</span>
                      <span>•</span>
                      <span>{preset.model}</span>
                      <span>•</span>
                      <span>{preset.contextLength}</span>
                    </div>
                    {preset.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {preset.description}
                      </p>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}