import { Request, Response } from "express"

export const SearchUserAction = (req: Request, res: Response) => {
    const { search } = req.query;
}