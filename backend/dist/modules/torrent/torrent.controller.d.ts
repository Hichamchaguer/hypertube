import { Request, Response } from 'express';
export declare const startStream: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPlaylist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSegment: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const listQualities: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=torrent.controller.d.ts.map