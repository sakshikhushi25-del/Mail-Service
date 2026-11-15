import { useEffect, useState } from "react";

const Settings = () => {
  const [voiceEnabled, setVoiceEnabled] = useState(
    () => localStorage.getItem("voiceEnabled") !== "false"
  );

  const [autoAnnouncement, setAutoAnnouncement] = useState(
    () => localStorage.getItem("autoAnnouncement") !== "false"
  );

  const [rate, setRate] = useState(
    () => Number(localStorage.getItem("voiceRate")) || 1
  );

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(
    () => localStorage.getItem("selectedVoice") || ""
  );

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  const saveSettings = () => {
    localStorage.setItem("voiceEnabled", voiceEnabled);
    localStorage.setItem("autoAnnouncement", autoAnnouncement);
    localStorage.setItem("voiceRate", rate);
    localStorage.setItem("selectedVoice", selectedVoice);

    alert("Voice settings saved successfully!");
  };

  const previewVoice = () => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      "Hello! Welcome to Mini Connect Voice Assistant."
    );

    utterance.rate = rate;

    const voice = voices.find((item) => item.name === selectedVoice);

    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="settings-container">
      <h1>Voice Assistant Settings</h1>
      <p>Customize your message listening experience.</p>

      <div className="settings-card">
        <div className="setting-row">
          <div>
            <h3>Enable Voice Assistant</h3>
            <p>Allow the application to read messages aloud.</p>
          </div>

          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={(e) => setVoiceEnabled(e.target.checked)}
          />
        </div>

        <div className="setting-row">
          <div>
            <h3>Automatic Announcements</h3>
            <p>Announce new message notifications automatically.</p>
          </div>

          <input
            type="checkbox"
            checked={autoAnnouncement}
            disabled={!voiceEnabled}
            onChange={(e) => setAutoAnnouncement(e.target.checked)}
          />
        </div>

        <div className="setting-group">
          <label>Speaking Speed: {rate.toFixed(1)}x</label>

          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </div>

        <div className="setting-group">
          <label>Select Voice</label>

          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            <option value="">Default Browser Voice</option>

            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="compose-actions">
          <button className="secondary-btn" onClick={previewVoice}>
            <i className="fa-solid fa-volume-high"></i> Test Voice
          </button>

          <button className="primary-btn" onClick={saveSettings}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;