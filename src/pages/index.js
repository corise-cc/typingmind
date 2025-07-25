import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "こんにちは！チャットへようこそ！" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // ユーザーのメッセージをチャットに追加
    setMessages((prev) => [...prev, { from: "user", text: input }]);

    // APIへPOST
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();

    // AIの返答をチャットに追加
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

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>簡易チャットUIテスト</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          minHeight: 200,
          marginBottom: 10,
          borderRadius: 8,
          backgroundColor: "#f9f9f9",
          overflowY: "auto",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.from === "user" ? "right" : "left",
              margin: "6px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 20,
                backgroundColor: m.from === "user" ? "#7db9ff" : "#ddd",
                color: m.from === "user" ? "white" : "black",
                maxWidth: "70%",
                wordWrap: "break-word",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="メッセージを入力"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ width: "80%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button onClick={sendMessage} style={{ padding: "8px 16px", marginLeft: 8 }}>
          送信
        </button>
      </div>
    </div>
  );
}
