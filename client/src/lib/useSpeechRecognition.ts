import { useState, useEffect } from "react";

const useSpeechRecognition = (isActive: boolean) => {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Check if SpeechRecognition is supported
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = true; // Show results before the user finishes speaking
    recognition.lang = "en-US";
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult && lastResult.isFinal) {
        setTranscript(lastResult[0].transcript);
      }
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
    };

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    // Start/stop listening based on `isActive`
    if (isActive) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isActive]);

  return { transcript, isListening, error };
};

export default useSpeechRecognition;
