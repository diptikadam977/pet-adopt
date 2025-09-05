import React, { useState, useRef } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onVoiceMessage: (audioBlob: Blob) => void;
}

export function VoiceRecorder({ onVoiceMessage }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onVoiceMessage(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      toast.success('Voice message recorded');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        toast.info('Recording resumed');
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        toast.info('Recording paused');
      }
    }
  };

  if (!isRecording) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={startRecording}
        title="Record voice message"
      >
        <Mic className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={pauseRecording}
        title={isPaused ? "Resume recording" : "Pause recording"}
      >
        {isPaused ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-red-500"
        onClick={stopRecording}
        title="Stop recording"
      >
        <Square className="w-4 h-4" />
      </Button>
    </div>
  );
}