"use client"

import { SettingsProvider } from "@/lib/settings-provider"
import { LastOcrImage } from "@/components/ready-to-use-examples/last-ocr-image"
import { HealthStatus } from "@/components/ready-to-use-examples/health-status"
import { LastUiRecord } from "@/components/ready-to-use-examples/last-ui-record"
import { PlaygroundCard } from "@/components/playground-card"
import { ClientOnly } from "@/lib/client-only"

import healthStatusContent from "../content/health-status-card.json"
import { useHealthCheck } from "@/lib/hooks/use-health-check"
import { GenericSettings } from "@/lib/hooks/generic-settings"
import ScreenpipeStatus from "@/components/screenpipe-status"
import { pipe } from "@screenpipe/browser"
import Dashboard from "@/components/dashboard"

export default function Page() {
  return (
    <ClientOnly>
      <main className={`flex flex-col gap-6 container px-6 py-10`}>
        <header className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold font-sans tracking-tighter">
              Momentum
            </h1>
            <ScreenpipeStatus />
          </div>

          <p className="">
            A pipe to track and analyze your screen time and usage between
            different apps
          </p>
        </header>
        <section>
          <Dashboard />
        </section>
        <section>
          <GenericSettings />
        </section>
      </main>
    </ClientOnly>
  )
}
