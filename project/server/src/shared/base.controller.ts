import * as jwt from 'jsonwebtoken';

export class BaseController{
    constructor(){}

    protected getAccountSIDFromToken(authorization){

        if (!authorization) return null;

        const token = authorization.split(' ')[1];
        
        const decoded: any = jwt.verify(token, 'm@chaik2021');

        return decoded.id;
    }
}