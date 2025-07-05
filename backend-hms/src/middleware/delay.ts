import { NextFunction } from "express";
import { Request, Response } from "express";

const delay = (req: Request, res: Response, next: NextFunction) =>{
    setTimeout(() => {
        if(req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
        }
        next();
    }, 1000); // delay 1 giây
}

export default delay;
