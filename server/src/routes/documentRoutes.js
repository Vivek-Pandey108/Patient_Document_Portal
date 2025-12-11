import express, { Router } from "express"
import {getAllDocument,uploadDocument,downloadDocument,deleteDocument} from '../controller/documentController.js'
import upload from "../middleware/uploadMiddleware.js";
const docRouter= express.Router();

// listDocument
docRouter.get("/",getAllDocument);

//uploadDocument
docRouter.post("/upload", upload.single("file"), (req, res, next) => {
  if (!req.file && req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }
  uploadDocument(req, res, next);
});

//downloadDocument
docRouter.get("/:id",downloadDocument);

//deleteDocument
docRouter.delete("/:id",deleteDocument);

export default docRouter;