// 1. let, const, var
var a = 10;
let b = 20;
const c = 30;
console.log("1.", a, b, c);

// 2. Second fruit
const fruits = ["Apple", "Banana", "Mango", "Orange", "Grapes"];
console.log("2. Second Fruit:", fruits[1]);

// 3. push() and pop()
function modifyArray(arr) {
    arr.push("New");
    arr.pop();
    return arr;
}
console.log("3.", modifyArray([1, 2, 3]));

// 4. Square numbers using map()
const nums = [1, 2, 3, 4, 5];
console.log("4.", nums.map(num => num * num));

// 5. Filter odd numbers
console.log("5.", [1, 2, 3, 4, 5, 6].filter(num => num % 2 !== 0));

// 6. Object greeting
const person = {
    name: "Arti",
    age: 21,
    occupation: "Student"
};
console.log(`6. Hello, I am ${person.name}, a ${person.occupation}.`);

// 7. Rectangle area
function area(rect) {
    return rect.width * rect.height;
}
console.log("7. Area:", area({ width: 10, height: 5 }));

// 8. Object keys
const student = { name: "Arti", age: 21, course: "B.Tech" };
console.log("8.", Object.keys(student));

// 9. Merge objects
const obj1 = { name: "Arti" };
const obj2 = { age: 21 };
console.log("9.", Object.assign({}, obj1, obj2));

// 10. Sum using reduce()
console.log("10.", [10, 20, 30, 40, 50].reduce((sum, num) => sum + num, 0));