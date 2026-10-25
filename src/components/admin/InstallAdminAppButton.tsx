'use client';

import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, ShieldCheck, Laptop, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallAdminAppButton({
  variant = 'header',
}: {
  variant?: 'header' | 'sidebar' | 'banner';
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // 1. Switch manifest to manifest-admin.json for Admin routes
    try {
      let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
      if (manifestLink) {
        manifestLink.setAttribute('href', '/manifest-admin.json');
      } else {
        manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = '/manifest-admin.json';
        document.head.appendChild(manifestLink);
      }
    } catch {}

    // 2. Check if already running as standalone app
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    // 3. Capture beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowInstructions(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      } catch {
        setShowInstructions(true);
      }
    } else {
      setShowInstructions(true);
    }
  };

  if (isInstalled) {
    if (variant === 'sidebar') {
      return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Admin App Installed</span>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {variant === 'header' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
          title="Install Admin Panel as Standalone Desktop/Mobile App"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Install Admin App</span>
        </button>
      )}

      {variant === 'sidebar' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-orange-500/10 border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-xs transition active:scale-[0.99] cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-amber-600" />
            <span>Install Admin App</span>
          </div>
          <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900">
            PWA
          </span>
        </button>
      )}

      {/* Instructional Modal if native prompt is deferred or blocked */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 relative">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-slate-950">Install AS Admin Suite</h3>
                <p className="text-xs text-slate-500">Standalone executive app for PC & Mobile</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 mb-6">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <Laptop className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">On Chrome, Edge, or PC:</strong>
                  Click the <strong>Install</strong> icon in the address bar (top right) or open menu (⋮) → &quot;Save &amp; Share&quot; / &quot;Apps&quot; → <strong>&quot;Install AS Admin Suite&quot;</strong>.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">On Android or iPhone:</strong>
                  Tap the browser menu (⋮) or Share button (<span className="font-bold">⎋</span>) → select <strong>&quot;Add to Home Screen&quot;</strong> or <strong>&quot;Install App&quot;</strong>.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
