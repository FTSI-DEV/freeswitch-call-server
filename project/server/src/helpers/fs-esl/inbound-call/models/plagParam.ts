export interface PlayAndGetDigitsParam{
    minValue:number; //minimum number of digits to collect
    maxValue:number; //maximum number of digits to collect
    tries:number; // number of attempts to play the file and collect the digits
    timeout:number; // number of milliseconds to wait before assuming the caller is done entering the digits
    terminator:string; // digits used to end input
    soundFile:string; // sound file to play while digits are fetched.
    invalidFile:string; // sound file to play when digits don't match the regex
    regexValue:string; // regular expression to match digits
    digit_Timeout?:number; // (optional) number of milliseconds to wait between digits
    var_name:string; // channel variable that digits should be placed in
}