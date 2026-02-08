import { useState, useRef } from 'react';

interface UseVoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export const useVoiceInput = ({ onTranscript, language = 'en' }: UseVoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true); // AssemblyAI works everywhere
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
      
      // Create FormData
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', language);

      // Send to backend
      const response = await fetch(`${apiUrl}/transcription/transcribe`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
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
      setError('Failed to transcribe audio. Please try again.');
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
