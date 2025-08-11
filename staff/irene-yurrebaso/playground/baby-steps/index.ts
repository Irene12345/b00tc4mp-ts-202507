import { add, sub, mul, div } from "./calc/";

console.log("Hello, world!");

console.log(add(2, 3)); //Output 5
console.log(sub(8, 2)); //Output 6
console.log(mul(2, 5)); //Output 10
console.log(div(4, 2)); //Output 2

//Objetos:
/* let vane:{ name: string; age: number; city: string; } ;

vane = { name: "Vanessa", age: 30, city: "New York" }; */

//Nos podemos ahorrar el paso de arriba si lo declaramos de forma compacta (hace una inferencia para el tipado):

/* let vane = { name: "Vanessa", age: 30, city: "New York" };

//typeof permite ahorrarnos repetir el tipado para un mismo tipo de objeto
let rares:typeof vane;
rares = { name: "Rares", age: 25, city: "Bucharest" };

//otra forma de inferir tipado de variables
type Person = typeof vane;

let mario: Person;
mario = { name: "Mario", age: 28, city: "Rome" };

let berni: Person;
berni = { name: "Berni", age: 32, city: "Toronto" }; */

//Cuando hay varias personas, definir primero el tipo Person:
//type Person = { name: string; age: number; city: string };

//para diferentes tipos de objetos que comparten el mismo tipado usar interface. Infiere el tipado de clases:
interface Person { name: string; age: number; city: string; country?: string };


let vane: Person = { name: "Vanessa", age: 30, city: "New York" };
let rares: Person = { name: "Rares", age: 25, city: "Bucharest" };
let mario: Person = { name: "Mario", age: 28, city: "Rome" };
let berni: Person = { name: "Berni", age: 32, city: "Toronto" };

//Se puede crear una interface a traves de otra. Creo un nuevo tipado q involucre a country. IWorker es una Persona q ademas puede involucrar un country.
interface IWorker extends Person {
    country?: string;
    work(): void;
}

//interface nos sirve para implementar una Person con los mismos campos:
class Worker implements IWorker {
    name: string;
    age: number;
    city: string;
    country?:string; //campo opcional de Worker

    constructor(name: string, age: number, city: string, country?: string) {
        this.name = name;
        this.age = age;
        this.city = city;
    }

    work() {
        console.log(`${this.name} is working.`);
    }
}

//alice como es de tipo Worker implementa tambien lo que es una Person
let alice = new Worker("Alice", 32, "London", "UK");
alice.work(); // Outputs: Alice is working.

console.log(alice instanceof Worker); //Outputs: true