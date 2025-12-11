import db from "../db/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to convert row to response object
const mapDocumentRow = (row) => ({
  id: row.id,
  filename: row.filename,
  filepath: row.filepath,
  filesize: row.filesize,
  created_at: row.created_at,
});

// POST /api/documents/upload
export const uploadDocument = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname, filename, size, path: filePath } = req.file;
    const createdAt = new Date().toISOString();

    const dbFilePath = filePath; 

    const sql =
      "INSERT INTO documents (filename, filepath, filesize, created_at) VALUES (?, ?, ?, ?)";
    const params = [originalname, dbFilePath, size, createdAt];

    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error inserting document:", err.message);
        return res.status(500).json({ error: "Failed to save document" });
      }

      const insertedId = this.lastID;

      return res.status(201).json({
        id: insertedId,
        filename: originalname,
        filepath: dbFilePath,
        filesize: size,
        created_at: createdAt,
      });
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/documents
export const getAllDocument = (req, res) => {
  const sql =
    "SELECT id, filename, filepath, filesize, created_at FROM documents ORDER BY created_at DESC";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching documents:", err.message);
      return res.status(500).json({ error: "Failed to fetch documents" });
    }

    const documents = rows.map(mapDocumentRow);
    return res.json(documents);
  });
};

// GET /api/documents/:id
export const downloadDocument = (req, res) => {
  const { id } = req.params;

  const sql =
    "SELECT id, filename, filepath FROM documents WHERE id = ? LIMIT 1";
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Error fetching document:", err.message);
      return res.status(500).json({ error: "Failed to fetch document" });
    }

    if (!row) {
      return res.status(404).json({ error: "Document not found" });
    }

    const filePath = row.filepath;
    const filename = row.filename;

    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: "File not found on disk" });
    }

    return res.download(absolutePath, filename, (downloadErr) => {
      if (downloadErr) {
        console.error("Error sending file:", downloadErr.message);
        if (!res.headersSent) {
          return res.status(500).json({ error: "Error downloading file" });
        }
      }
    });
  });
};

// DELETE /api/documents/:id
export const deleteDocument = (req, res) => {
  const { id } = req.params;

  const selectSql =
    "SELECT id, filepath FROM documents WHERE id = ? LIMIT 1";

  db.get(selectSql, [id], (err, row) => {
    if (err) {
      console.error("Error fetching document:", err.message);
      return res.status(500).json({ error: "Failed to fetch document" });
    }

    if (!row) {
      return res.status(404).json({ error: "Document not found" });
    }

    const filePath = path.resolve(row.filepath);

    // Delete file from disk
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr && unlinkErr.code !== "ENOENT") {
        console.error("Error deleting file:", unlinkErr.message);
      }

      const deleteSql = "DELETE FROM documents WHERE id = ?";
      db.run(deleteSql, [id], (deleteErr) => {
        if (deleteErr) {
          console.error("Error deleting document record:", deleteErr.message);
          return res.status(500).json({ error: "Failed to delete document" });
        }

        return res.json({ message: "Document deleted successfully" });
      });
    });
  });
};
