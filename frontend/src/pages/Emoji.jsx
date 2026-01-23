import React, { useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

function Emoji() {
  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    setShowPicker(false); // optional
  };

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type something..."
        style={{ width: "100%" }}
      />

      <button onClick={() => setShowPicker(!showPicker)}>
        😊
      </button>

      {showPicker && (
        <div style={{ position: "absolute", top: "45px", zIndex: 10 }}>
          <Picker data={data} onEmojiSelect={addEmoji} />
        </div>
      )}
    </div>
  );
}

export default Emoji;
