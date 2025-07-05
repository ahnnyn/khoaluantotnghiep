import getConnection from "config/connect.mongo";
import "dotenv/config";
import path from "path";

const uploadSingleFile = async (fileObject) =>{

    let uploadPath = path.resolve(__dirname, "../../../public/images/upload");

    let extName = path.extname(fileObject.name);

    let baseName = path.basename(fileObject.name, extName);

    //create final path
    let finalName = `${baseName}-${Date.now()}${extName}`;
    let finalPath = `${uploadPath}/${finalName}`;

    try{
        await fileObject.mv(finalPath);
        
        return {
            status: 'success',
            path: finalName,
            error: null
        }
    }catch (error) {
        return {
            status: 'failed',
            path: null,
            error: JSON.stringify(error)
        }
    }
    
}

const uploadMultipleFiles = async (fileArr) =>{
    try{
        let uploadPath = path.resolve(__dirname, "../../public/images/upload");
        let resultArr = [];
        let countSuccess = 0;
        for(let i = 0; i < fileArr.length; i++){
            let fileObject = fileArr[i];
            let extName = path.extname(fileObject.name);
            let baseName = path.basename(fileObject.name, extName);
            //create final path
            let finalName = `${baseName}-${Date.now()}${extName}`;
            let finalPath = `${uploadPath}/${finalName}`;

            try{
                await fileObject.mv(finalPath);
                resultArr.push({
                    status: 'success',
                    path: finalName,
                    fileArr: fileObject.name,
                    error: null
                });
                countSuccess++;
            }catch (error) {
                resultArr.push({
                    status: 'failed',
                    path: null,
                    fileArr: fileObject.name,
                    error: JSON.stringify(error)
                });
            }
                    
        }
        return {
            countSuccess: countSuccess,
            detail: resultArr
        }

    }catch (error) {
        console.error("Error uploading multiple files:", error);
    }

}
export {
    uploadSingleFile,
    uploadMultipleFiles
}