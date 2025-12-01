import React, { useEffect } from "react";
import "../styles/chatbot.css";

const DIALOGFLOW_SCRIPT =
  "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";

const Chatbot = () => {
  useEffect(() => {
    // Cargar una sola vez el script de Dialogflow
    if (!document.querySelector(`script[src="${DIALOGFLOW_SCRIPT}"]`)) {
      const s = document.createElement("script");
      s.src = DIALOGFLOW_SCRIPT;
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  // Abrir/cerrar el chat
  const toggleChat = () => {
    const df = document.querySelector("df-messenger");
    if (!df) return;
    df.classList.toggle("open");
  };

  // 🎙️ Iniciar reconocimiento de voz
  const startVoiceCommand = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz 😢 (prueba con Chrome)");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES"; // idioma de los comandos
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("Escuchando...");
    };

    recognition.onerror = (event) => {
      console.error("Error de reconocimiento de voz:", event.error);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Dijiste:", transcript);

      const df = document.querySelector("df-messenger");
      if (df && df.renderCustomText) {
        df.renderCustomText(transcript);
      } else {
        console.warn("No se encontró df-messenger o renderCustomText");
      }
    };

    recognition.start();
  };

  return (
    <>
      {/* Botón flotante para abrir/cerrar chat */}
      <button className="chatbot-toggler" onClick={toggleChat}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="#fff"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
        </svg>
      </button>

      {/* 🎙️ Botón de micrófono para comandos de voz */}
      <button className="chatbot-mic" onClick={startVoiceCommand} title="Hablar">
        🎙
      </button>

      {/* Chatbot de Dialogflow */}
      <df-messenger
        intent="WELCOME"
        chat-title="chatclinicatataje"
        agent-id="14c4dac1-f71d-4445-837c-5edf459760e5"
        language-code="es"
      ></df-messenger>
    </>
  );
};

export default Chatbot;

