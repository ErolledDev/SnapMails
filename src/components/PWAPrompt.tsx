import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent;
  }
}

const PWAPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) return;

    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) return;

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    
    if (result.outcome === 'accepted') {
      console.log('PWA installed successfully');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 animate-fade-in" role="dialog" aria-labelledby="pwa-title">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Close installation prompt"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
      
      <div className="flex items-start mb-3">
        <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
          <Download className="w-6 h-6 text-blue-600 dark:text-blue-300" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 id="pwa-title" className="text-sm font-semibold text-gray-900 dark:text-white">
            Install SnapMails
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Add our app to your home screen for quick access to temporary emails
          </p>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          onClick={handleDismiss}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Maybe later
        </button>
        <button
          onClick={handleInstall}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Install
        </button>
      </div>
    </div>
  );
}

export default PWAPrompt;