import { useState, useRef } from 'react';

interface UseVoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export const useVoiceInput = ({ onTranscript, language = 'en' }: UseVoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  // Check if backend API is available
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isSupported, setIsSupported] = useState(!!apiUrl && apiUrl !== 'http://localhost:5001');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startListening = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        try {
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());

          // Create audio blob
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Send to backend for transcription
          await transcribeAudio(audioBlob);
          
        } catch (err) {
          console.error('Error processing audio:', err);
          setError('Failed to process audio');
        } finally {
          setIsListening(false);
        }
      };

      // Start recording
      mediaRecorder.start();
      setIsListening(true);

    } catch (err: any) {
      console.error('Error starting recording:', err);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission denied. Please allow microphone access.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.');
      } else {
        setError('Failed to start recording. Please try again.');
      }
      
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // Get API URL from environment
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      
      // Check if API URL is available
      if (!apiUrl || apiUrl === 'http://localhost:5001') {
        console.warn('Voice transcription requires backend server. Feature disabled.');
        setError('Voice input requires backend server (currently unavailable)');
        return;
      }
      
      // Create FormData
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', language);

      // Send to backend with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${apiUrl}/transcription/transcribe`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Voice transcription endpoint not found');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment.');
        }
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      
      if (data.success && data.text) {
        onTranscript(data.text);
        setError(null);
      } else {
        throw new Error(data.error || 'No transcription received');
      }

    } catch (err: any) {
      console.error('Transcription error:', err);
      
      if (err.name === 'AbortError') {
        setError('Request timeout. Please try again.');
      } else if (err.message.includes('404')) {
        setError('Voice feature unavailable (backend not deployed)');
      } else if (err.message.includes('429')) {
        setError('Too many requests. Please wait.');
      } else {
        setError('Voice transcription unavailable. Please type your answer.');
      }
    }
  };

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening
  };
};
