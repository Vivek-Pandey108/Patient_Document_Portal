function formatDate(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleString();
}

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentsList({ documents, onDownload, onDelete }) {
  if (!documents || documents.length === 0) {
    return <p className="empty-state">No documents uploaded yet.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="doc-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Filename</th>
            <th>Size</th>
            <th>Uploaded At</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, index) => (
            <tr key={doc.id}>
              <td>{index + 1}</td>
              <td className="filename-cell" title={doc.filename}>
                {doc.filename}
              </td>
              <td>{formatSize(doc.filesize)}</td>
              <td>{formatDate(doc.created_at)}</td>
              <td className="actions-cell">
                <button
                  className="btn ghost"
                  onClick={() => onDownload(doc.id)}
                >
                  Download
                </button>
                <button
                  className="btn danger"
                  onClick={() => onDelete(doc.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentsList;
