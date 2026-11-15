import { useEffect, useState } from "react";

const useVoiceAssistant = () => {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  const supported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window;

  const speak = (text) => {
    if (!supported || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeaking(true);
      setPaused(false);
    };

    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (supported) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const resume = () => {
    if (supported) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  };

  const stop = () => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
    }
  };

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return {
    speak,
    pause,
    resume,
    stop,
    speaking,
    paused,
    supported
  };
};

export default useVoiceAssistant;