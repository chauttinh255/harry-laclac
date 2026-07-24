const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || ''
const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Bella (friendly female) or 'ThT5KcBeYPX3keUQqHPh' (Dorothy - children)

export const generateElevenLabsAudio = async (text: string, voiceId: string = DEFAULT_VOICE_ID): Promise<Blob | null> => {
  if (!ELEVENLABS_API_KEY) {
    console.warn("ElevenLabs API Key not found. Falling back to Web Speech API.")
    return null
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API Error: ${response.statusText}`)
    }

    return await response.blob()
  } catch (error) {
    console.error("Failed to generate ElevenLabs audio:", error)
    return null
  }
}
