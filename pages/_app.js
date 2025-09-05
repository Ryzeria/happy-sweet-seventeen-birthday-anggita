import '../src/styles/globals.css';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import AudioManager from '../src/components/ui/AudioManager';
import useProgress from '../src/hooks/useProgress';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { completeLevel } = useProgress();

  // Handle level completion with success sound
  useEffect(() => {
    const handleLevelComplete = (levelId) => {
      // Play success sound when level is completed
      if (typeof window !== 'undefined' && window.playSuccessSound) {
        window.playSuccessSound();
      }
      completeLevel(levelId);
    };

    // Make function globally available
    window.handleLevelComplete = handleLevelComplete;

    return () => {
      delete window.handleLevelComplete;
    };
  }, [completeLevel]);

  // Add click sound to all interactive elements
  useEffect(() => {
    const addClickSounds = () => {
      const buttons = document.querySelectorAll('button, a, [role="button"]');
      
      buttons.forEach(button => {
        if (!button.hasAttribute('data-sound-added')) {
          button.setAttribute('data-sound-added', 'true');
          button.addEventListener('click', () => {
            if (typeof window !== 'undefined' && window.playClickSound) {
              window.playClickSound();
            }
          });
        }
      });
    };

    // Add click sounds after route changes
    const timer = setTimeout(addClickSounds, 100);
    
    return () => clearTimeout(timer);
  }, [router.pathname]);

  return (
    <>
      <Head>
        <title>Happy 17th Birthday Anggita! 🎂💕</title>
        <meta name="description" content="A special birthday surprise website filled with love and memories for Anggita" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#FFB6C1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Anggita Birthday Surprise" />
      </Head>
      
      {/* Global Audio Manager */}
      <AudioManager 
        showControls={true}
        autoStartMusic={false}
      />
      
      <AnimatePresence
        mode="wait"
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <Component {...pageProps} key={router.asPath} />
      </AnimatePresence>
    </>
  );
}

export default MyApp;