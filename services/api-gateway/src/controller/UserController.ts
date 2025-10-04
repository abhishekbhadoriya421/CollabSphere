import { Request, Response } from "express"

export const SearchUserAction = (req: Request, res: Response) => {
    console.log(req.query)
}