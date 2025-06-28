import { NextFunction, Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const while_lists = ["/", "/register", "/login"];

const authjwt = (roles: string[] = []): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Bỏ qua các route không cần auth
    if (while_lists.find(item => '/api' + item === req.originalUrl)) {
      next();
      return;
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized access, please login to continue!" });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      (req as any).user = decoded;

      // Nếu có truyền `roles`, thì kiểm tra role người dùng có hợp lệ không
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        res.status(403).json({ message: "Bạn không có quyền truy cập tài nguyên này!" });
        return;
      }

      next();
      return;
    } catch (err) {
      res.status(401).json({ message: "Token bị hết hạn hoặc không hợp lệ!" });
      return;
    }
  };
};

export default authjwt;
