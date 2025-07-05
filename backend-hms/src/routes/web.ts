// src/routes/web.routes.ts
import { Express } from 'express';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
import doctorRoutes from './doctor.routes';
import patientRoutes from './patient.routes';
import uploadRoutes from './file.upload.routes';
import publicRoutes from './public.routes'; 

const webRoutes = (app: Express) => {
    
    userRoutes(app);
    adminRoutes(app);
    doctorRoutes(app);
    patientRoutes(app);
    uploadRoutes(app);
    publicRoutes(app);
};

export default webRoutes;
