import { useState } from "react";

function UploadForm({ onUpload, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a PDF file");
      return;
    }
    await onUpload(selectedFile);
    setSelectedFile(null);
    e.target.reset();
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <label className="upload-label">
        <span>Upload PDF</span>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={loading}
        />
      </label>
      {error && <p className="field-error">{error}</p>}
      <button
        type="submit"
        className="btn primary"
        disabled={loading || !selectedFile}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}

export default UploadForm;
