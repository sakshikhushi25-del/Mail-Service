import useVoiceAssistant from "../hooks/useVoiceAssistant";

const VoiceControls = ({ text }) => {
  const {
    speak,
    pause,
    resume,
    stop,
    speaking,
    paused,
    supported
  } = useVoiceAssistant();

  if (!supported) {
    return <p>Speech synthesis is not supported in this browser.</p>;
  }

  return (
    <div className="voice-controls">
      <button onClick={() => speak(text)} title="Play">
        <i className="fa-solid fa-play"></i>
      </button>

      <button
        onClick={pause}
        disabled={!speaking || paused}
        title="Pause"
      >
        <i className="fa-solid fa-pause"></i>
      </button>

      <button
        onClick={resume}
        disabled={!paused}
        title="Resume"
      >
        <i className="fa-solid fa-rotate-right"></i>
      </button>

      <button
        onClick={stop}
        disabled={!speaking && !paused}
        title="Stop"
      >
        <i className="fa-solid fa-stop"></i>
      </button>
    </div>
  );
};

export default VoiceControls;