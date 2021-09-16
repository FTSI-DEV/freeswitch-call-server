export class TimeConversion{

    secondsToMS(seconds:number):number{

        let milliseconds = (seconds * 1000);

        return milliseconds;
    }
}