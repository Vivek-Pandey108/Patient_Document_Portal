function MessageBar({ type, text }) {
  if (!text) return null;

  return (
    <div className={`message-bar ${type === "error" ? "error" : "success"}`}>
      {text}
    </div>
  );
}

export default MessageBar;
