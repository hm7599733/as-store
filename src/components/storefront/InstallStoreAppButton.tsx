'use client';

import React, { useState, useEffect } from 'react';
import { Download, ShoppingBag, Smartphone, Laptop, X, Check } from 'lucide-react';

export default function InstallStoreAppButton({
  variant = 'navbar',
}: {
  variant?: 'navbar' | 'mobile' | 'floating' | 'footer';
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 1. Ensure manifest is manifest.json
    try {
      let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
      if (manifestLink) {
        manifestLink.setAttribute('href', '/manifest.json');
      }
    } catch {}

    // 2. Check if running as standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowModal(false);
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
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {variant === 'navbar' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          title="Install AS Store App on your Phone or Computer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'mobile' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-950/80 to-[#0B132B] border border-cyan-500/40 text-cyan-300 font-bold text-xs transition cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-black">
              <Download className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <span className="block text-white font-bold leading-tight">Install AS Store App</span>
              <span className="block text-[10px] text-cyan-400/80">Faster browsing &amp; instant deals</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase">
            FREE
          </span>
        </button>
      )}

      {variant === 'footer' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Install Official Web App</span>
        </button>
      )}

      {/* Guide Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#0B132B] border border-cyan-900/80 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-white">Install AS Store App</h3>
                <p className="text-xs text-cyan-300/80">Enjoy a high-speed 1-tap shopping experience</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 mb-6">
              <div className="p-3.5 rounded-2xl bg-[#050A17] border border-cyan-950 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Android / Chrome:</strong>
                  Tap the browser menu (<span className="font-bold">⋮</span>) at the top right, then select{' '}
                  <strong className="text-cyan-300">&quot;Install App&quot;</strong> or{' '}
                  <strong className="text-cyan-300">&quot;Add to Home Screen&quot;</strong>.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#050A17] border border-cyan-950 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">iPhone / Safari:</strong>
                  Tap the <strong className="text-emerald-300">Share button</strong> (square with up arrow), scroll down, and tap{' '}
                  <strong className="text-emerald-300">&quot;Add to Home Screen&quot;</strong>.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#050A17] border border-cyan-950 flex items-start gap-3">
                <Laptop className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Windows PC / Mac:</strong>
                  Look for the <strong className="text-indigo-300">Install icon</strong> in your browser&apos;s address bar, or open browser menu → &quot;Apps&quot; → <strong>&quot;Install AS Store&quot;</strong>.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
