import { Request, Response } from 'express';
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const logout: (_req: Request, res: Response) => Response<any, Record<string, any>>;
export declare const currentUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const listUsers: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map