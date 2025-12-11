import { useEffect, useState } from "react";
import UploadForm from "./components/UploadForm";
import DocumentsList from "./components/DocumentsList";   
import MessageBar from "./components/MessageBar";  
import { fetchDocuments, uploadDocument, deleteDocument } from "./api";
import "./App.css";

function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); 

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load documents" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (file) => {
    try {
      setLoading(true);
      setMessage(null);
      const uploaded = await uploadDocument(file);
      setDocuments((prev) => [uploaded, ...prev]);
      setMessage({ type: "success", text: "File uploaded successfully" });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Failed to upload file",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      setLoading(true);
      setMessage(null);
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      setMessage({ type: "success", text: "Document deleted" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to delete document" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (id) => {
    window.open(`http://localhost:5000/api/documents/${id}`, "_blank");
  };

  return (
    <div className="app-root">
      <div className="app-container">
        <header className="app-header">
          <h1>Patient Document Portal</h1>
          <p className="app-subtitle">
            Upload, view, download, and manage your medical PDFs.
          </p>
        </header>

        <section className="card">
          <UploadForm onUpload={handleUpload} loading={loading} />
        </section>

        {message && <MessageBar type={message.type} text={message.text} />}

        <section className="card">
          <div className="card-header">
            <h2>Your Documents</h2>
            {loading && <span className="badge">Loading...</span>}
          </div>
          <DocumentsList
            documents={documents}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </div>
  );
}

export default App;
