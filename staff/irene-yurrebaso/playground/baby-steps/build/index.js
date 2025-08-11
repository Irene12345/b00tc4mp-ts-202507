"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calc_1 = require("./calc/");
console.log("Hello, world!");
console.log((0, calc_1.add)(2, 3)); //Output 5
console.log((0, calc_1.sub)(8, 2)); //Output 6
console.log((0, calc_1.mul)(2, 5)); //Output 10
console.log((0, calc_1.div)(4, 2)); //Output 2
;
let vane = { name: "Vanessa", age: 30, city: "New York" };
let rares = { name: "Rares", age: 25, city: "Bucharest" };
let mario = { name: "Mario", age: 28, city: "Rome" };
let berni = { name: "Berni", age: 32, city: "Toronto" };
//interface nos sirve para implementar una Person con los mismos campos:
class Worker {
    constructor(name, age, city, country) {
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
//# sourceMappingURL=index.js.map