'use client'

import { useEffect, useState } from 'react'

export default function PwaInstallBanner() {
  const [isStandalone, setIsStandalone] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true

    setIsStandalone(standalone)

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    const onInstalled = () => {
      setCanInstall(false)
      setInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setCanInstall(false)
      setInstalled(true)
    }
    setDeferredPrompt(null)
  }

  if (isStandalone || installed) return null

  return (
    <div className="max-w-4xl mx-auto px-4 pt-2">
      <div className="bg-white border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between gap-3 shadow-sm">
        <div className="text-xs text-gray-600">
          {canInstall ? (
            <span>📱 將中華促進會安裝到你的主屏幕，使用更快捷。</span>
          ) : (
            <span>📱 在瀏覽器選單中選擇「安裝應用程式 / 添加到主屏幕」。</span>
          )}
        </div>
        {canInstall && (
          <button
            onClick={handleInstall}
            className="shrink-0 bg-primary text-white text-xs px-3 py-1.5 rounded-lg hover:bg-primary-dark transition"
          >
            安裝
          </button>
        )}
      </div>
    </div>
  )
}
