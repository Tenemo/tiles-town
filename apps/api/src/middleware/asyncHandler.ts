import { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRequestHandler<
    TRequest extends Request = Request,
    TResponse extends Response = Response,
> = (req: TRequest, res: TResponse, next: NextFunction) => Promise<void>;

export const asyncHandler =
    <TRequest extends Request = Request, TResponse extends Response = Response>(
        handler: AsyncRequestHandler<TRequest, TResponse>,
    ): RequestHandler =>
    (req, res, next) => {
        void handler(req as TRequest, res as TResponse, next).catch(next);
    };
