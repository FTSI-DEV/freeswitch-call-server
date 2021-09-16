import moment from 'moment';

export class TimeProvider{

    getDateTimeNow():string{
        return moment().format('YYYY-MM-DDTHH:mm:ss');
    }

    getUnixTimeSeconds():number{
        return moment().valueOf();
    }
}