
//GREETING_SERVICE is constant. 
// Since Javascript doesn't support/understand interfaces,
// when we compile down our Typescript to Javascript our interfaces no longer exists.
// To use DI(Dependency Injection) with interfaces we need to create a token
// to associate with an interface and provide that token when injecting to an interface type.
export const GREETING_SERVICE = 'GREETING SERVICE'; 


export interface IGreetingService {
    greet(name:string): Promise<string>;
}

