import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const authjwt = (req: Request, res: Response, next: NextFunction) =>{

    const while_lists = ["/", "/register", "/login"];
    if(while_lists.find(item => '/api' + item === req.originalUrl)) {
        next();
        return;
    }else{
        if(req?.headers?.authorization?.split(' ')[1] ) {
            const token = req.headers.authorization.split(' ')[1];
            //veryfy token
            try{
                const decode =  jwt.verify(token, process.env.JWT_SECRET);
                (req as any).user = decode; // Gán thông tin người dùng vào req.user
                next();
                return;
            }catch(err){
                res.status(401).json({
                    message: "Token bị hết hạn hoặc không hợp lệ!"
                });
                return;
            }

        }else{
            res.status(401).json({
                message: "Unauthorized access, please login to continue!"
            });
            return;
        }
    }
}

export default authjwt;
