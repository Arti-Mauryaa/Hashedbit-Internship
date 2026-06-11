// 1. Display even numbers from 1 to 100

console.log("Even Numbers from 1 to 100:");
for (let i = 1; i <= 100; i++) {
    if (i % 2 === 0) {
        console.log(i);
    }
}


// 2. Calculator using switch

function calculate(num1, num2, operator) {
    switch (operator) {
        case "+":
            return num1 + num2;

        case "-":
            return num1 - num2;

        case "*":
            return num1 * num2;

        case "/":
            return num2 !== 0 ? num1 / num2 : "Cannot divide by zero";

        default:
            return "Invalid Operator";
    }
}

console.log(calculate(10, 5, "+"));
console.log(calculate(10, 5, "-"));
console.log(calculate(10, 5, "*"));
console.log(calculate(10, 5, "/"));


// 3. Find Tax using switch

function findTax(salary) {
    let taxRate;

    switch (true) {
        case (salary > 0 && salary <= 500000):
            taxRate = 0;
            break;

        case (salary > 500000 && salary <= 1000000):
            taxRate = 0.10;
            break;

        case (salary > 1000000 && salary <= 1500000):
            taxRate = 0.20;
            break;

        case (salary > 1500000):
            taxRate = 0.30;
            break;

        default:
            return "Invalid Salary";
    }

    return salary * taxRate;
}

console.log(findTax(400000));   // 0
console.log(findTax(800000));   // 80000
console.log(findTax(1200000));  // 240000
console.log(findTax(2000000));  // 600000


// 4. Sum of products of corresponding digits

function digitProductSum(n1, n2) {
    let sum = 0;

    while (n1 > 0 || n2 > 0) {
        let digit1 = n1 % 10;
        let digit2 = n2 % 10;

        sum += digit1 * digit2;

        n1 = Math.floor(n1 / 10);
        n2 = Math.floor(n2 / 10);
    }

    return sum;
}

console.log(digitProductSum(6, 34));     // 24
console.log(digitProductSum(123, 456));  // 32