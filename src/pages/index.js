import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "こんにちは！チャットへようこそ！" },
  ]);
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: input }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();

    if (res.ok) {
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
    } else {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "エラーが発生しました。" },
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
        maxWidth: 600,
        margin: "40px auto",
        padding: 20,
        fontFamily: "'Noto Sans JP', sans-serif",
        color: "#333",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#e65c26", marginBottom: 20 }}>
        簡易チャットUIテスト
      </h1>

      <div
        style={{
          border: "1px solid #e65c26",
          padding: 20,
          minHeight: 300,
          maxHeight: 700,
          borderRadius: 12,
          backgroundColor: "#f7f7f7",
          overflowY: "auto",
          boxShadow: "0 0 8px rgba(230, 92, 38, 0.2)",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.from === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px 18px",
                borderRadius: 24,
                backgroundColor: m.from === "user" ? "#e65c26" : "#ddd",
                color: m.from === "user" ? "white" : "#333",
                maxWidth: "75%",
                wordWrap: "break-word",
                fontSize: 16,
                lineHeight: 1.4,
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
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
            border: "1.5px solid #e65c26",
            fontSize: 16,
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            backgroundColor: "#e65c26",
            color: "white",
            border: "none",
            borderRadius: 24,
            padding: "12px 24px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: 16,
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#cf4f21")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#e65c26")
          }
        >
          送信
        </button>
      </div>
    </div>
  );
}
