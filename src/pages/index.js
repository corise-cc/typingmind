import { useState } from "react";

const shortcutQuestions = [
  "",
  "",
];

export default function Home() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 こんにちは！チャットへようこそ！" },
  ]);
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const sendMessage = async (msg = null) => {
    const messageToSend = msg ?? input.trim();
    if (!messageToSend) return;

    setMessages((prev) => [...prev, { from: "user", text: messageToSend }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "通信に失敗しました。再度お試しください。" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "通信に失敗しました。再度お試しください。" },
      ]);
    }
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: 16,
        fontFamily: "'Noto Sans JP', sans-serif",
        color: "#ddd",
        backgroundColor: "#181818",
        borderRadius: 12,
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 0 20px rgba(0,0,0,0.8)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#bbb",
          marginBottom: 12,
          fontWeight: "700",
          fontSize: 24,
          letterSpacing: 1,
        }}
      >
        CORISEチャット
      </h1>

      <div
        style={{
          flex: 1,
          border: "1px solid #444",
          padding: 16,
          borderRadius: 12,
          backgroundColor: "#222",
          overflowY: "auto",
          marginBottom: 12,
          scrollbarWidth: "thin",
          scrollbarColor: "#555 transparent",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.from === "user" ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                maxWidth: "75%",
                padding: "10px 16px",
                borderRadius: 20,
                backgroundColor: m.from === "user" ? "#444" : "#555",
                color: "#ddd",
                fontSize: 15,
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                boxShadow:
                  m.from === "user"
                    ? "0 1px 6px rgba(68,68,68,0.7)"
                    : "0 1px 6px rgba(85,85,85,0.7)",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {shortcutQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q)}
            style={{
              backgroundColor: "#333",
              border: "none",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 14,
              color: "#ddd",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "0 0 6px rgba(0,0,0,0.7)",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#555")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#333")}
          >
            {q}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="メッセージを入力"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 24,
            border: "2px solid #444",
            fontSize: 16,
            outline: "none",
            backgroundColor: "#222",
            color: "#ddd",
          }}
        />
        <button
          onClick={() => sendMessage()}
          style={{
            backgroundColor: "#444",
            border: "none",
            borderRadius: "50%",
            width: 44,
            height: 44,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 12px #444",
          }}
          aria-label="送信"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#ddd"
            viewBox="0 0 24 24"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
