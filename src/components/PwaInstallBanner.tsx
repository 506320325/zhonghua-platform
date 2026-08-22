'use client'

import { useEffect, useState } from 'react'

export default function PwaInstallBanner() {
  const [isStandalone, setIsStandalone] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)
  const [open, setOpen] = useState(false)

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
    setOpen(false)
  }

  if (isStandalone || installed) return null

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {open && (
        <div className="absolute bottom-12 right-0 bg-white rounded-xl shadow-lg border border-gray-200 p-3 w-52 text-xs text-gray-600">
          {canInstall ? (
            <button onClick={handleInstall} className="w-full bg-primary text-white py-2 rounded-lg text-sm">
              安裝到主屏幕
            </button>
          ) : (
            <p>在瀏覽器選單中選擇「安裝應用程式 / 添加到主屏幕」。</p>
          )}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-white/80 border border-gray-200 text-gray-400 shadow-sm hover:text-primary flex items-center justify-center"
        aria-label="安裝提示"
      >
        📱
      </button>
    </div>
  )
}
