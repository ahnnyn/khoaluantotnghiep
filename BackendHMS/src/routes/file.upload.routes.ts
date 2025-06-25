// src/routes/admin.routes.ts
import { postUploadMultipleFilesApi, postUploadSingleFileApi } from 'controllers/upload/file.upload.controllers';
import express, { Express } from 'express';
import authjwt from 'middleware/auth.jwt';

const router = express.Router();

const uploadRoutes = (app: Express) => {
    // Gắn middleware nếu cần
    router.use(authjwt);

    // Định nghĩa các route upload file
    router.post('/single', postUploadSingleFileApi);

    router.post('/multiple', postUploadMultipleFilesApi);
        
    app.use('/api/upload-file', router);
};

export default uploadRoutes;
