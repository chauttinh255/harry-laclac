import { supabase } from './supabase'
import { generateElevenLabsAudio } from './elevenlabs'

// Predefined cache for common phrases to save API credits
const STATIC_CACHE: Record<string, string> = {
  // We can manually populate these URLs later once uploaded to Supabase Storage
  "Wow, excellent!": "/sounds/wow_excellent.mp3",
  "Listen and repeat after me": "/sounds/listen_repeat.mp3",
}

// Global Audio Element to bypass iOS autoplay restrictions
let globalAudio: HTMLAudioElement | null = null;
let isAudioUnlocked = false;

export const unlockAudioContext = () => {
  if (isAudioUnlocked) return;
  if (!globalAudio) {
    globalAudio = new Audio();
  }
  // Play a silent or empty source to unlock
  globalAudio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIAD+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+AAAAAExhdmM1OC41NAAAAAAAAAAAAAAAACQAAAAAAAAAASAAAAAAAAD/zhAAAAAAAAAAAAAAABpIAAAAAAAA';
  globalAudio.play().then(() => {
    isAudioUnlocked = true;
  }).catch(() => {
    // Ignore errors for the silent track
  });
  
  // Unlock SpeechSynthesis as well
  const u = new SpeechSynthesisUtterance('');
  speechSynthesis.speak(u);
}

// Fallback to Web Speech API
const speakFallback = (text: string) => {
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.8
  speechSynthesis.speak(u)
}

const playGlobalAudio = (url: string, fallbackText: string) => {
  if (!globalAudio) {
    globalAudio = new Audio();
  }
  globalAudio.src = url;
  globalAudio.play().catch(() => speakFallback(fallbackText));
}

export const playAudio = async (text: string) => {
  // 1. Check static cache first
  if (STATIC_CACHE[text]) {
    playGlobalAudio(STATIC_CACHE[text], text);
    return
  }

  // 2. Check if we have Supabase configured (skip if placeholder)
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL !== undefined
  
  if (isSupabaseConfigured) {
    // Check if audio exists in Supabase Storage
    const fileName = `${btoa(text).replace(/[/+=]/g, '_')}.mp3`
    const { data } = supabase.storage.from('audio-cache').getPublicUrl(fileName)
    
    if (data && data.publicUrl) {
      try {
        const testRes = await fetch(data.publicUrl, { method: 'HEAD' })
        if (testRes.ok) {
          playGlobalAudio(data.publicUrl, text);
          return
        }
      } catch (e) {
        // file doesn't exist yet, proceed to generate
      }
    }

    // 3. Generate via ElevenLabs if not in cache
    const audioBlob = await generateElevenLabsAudio(text)
    if (audioBlob) {
      // Play immediately
      const url = URL.createObjectURL(audioBlob)
      playGlobalAudio(url, text);

      // Upload to cache in background
      supabase.storage.from('audio-cache').upload(fileName, audioBlob, {
        contentType: 'audio/mpeg',
        cacheControl: '3600000',
        upsert: false
      }).catch(console.error)
      
      return
    }
  }

  // 4. Fallback
  speakFallback(text)
}
