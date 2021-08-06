
// Defining type to a variable

let stageName: string = "A Beautiful Vue";
let roomSize: number = 100;
let isCOmplete: boolean = false;

const shoppingList: string[] = ['apple', 'bananas', 'cherries'];

let generateFullName = (firstName: string, lastName: string):string => {
    return `${firstName} ${lastName}`;
}

type ComicUniverse = 'Marvel' | 'DC';
interface Hero {
    name: string;
    age: number;
    activeAvenger: boolean;
    powers: string[];
    universe: ComicUniverse;
} 

const person: Hero = {
    name: 'Peter Parker',
    age: 20,
    activeAvenger: true,
    powers: ['wall-crawl', 'spider-sense'],
    universe: 'Marvel'
}

// Defining custom types
type buttonType = 'primary' | 'secondary' | 'success' | 'danger'

let errorBtnStyles: buttonType = 'error';  // Wrong 'error does not exist in buttonType'

let dangerBtnStyles: buttonType = 'danger'; // Correct



// Generics type
function createList<CustomType>(item: CustomType): CustomType[] {
    const newList: CustomType[] = [];
    newList.push(item);
    return newList;
}

const numberList = createList<number>(123);
const stringList = createList<string>("Hello World");

// Can be written using the convention using single letter T
function createList2<T>(item: T): T[] {
    const newList: T[] = [];
    newList.push(item);
    return newList;
}
