import { NextFunction, Request, Response } from "express";
import "dotenv/config";

import { uploadSingleFile, uploadMultipleFiles } from "services/upload/file.upload.services";

// ------------------------- Upload -------------------------

const postUploadSingleFileApi = async(req: Request, res: Response): Promise<any> => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let result = await uploadSingleFile(req.files.image);

    return res.status(200).json({
        EC: 0,
        data: result
    });

}

const postUploadMultipleFilesApi = async(req: Request, res: Response): Promise<any> => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    if(Array.isArray(req.files.image) ) {
        let result = await uploadMultipleFiles(req.files.image);
        return res.status(200).json({
            EC: 0,
            data: result
        });
    }else{
        return await postUploadSingleFileApi(req, res);
    }
}

// ------------------------- Export -------------------------

export {
    postUploadSingleFileApi,
    postUploadMultipleFilesApi
};
