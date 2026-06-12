// 1. Remove all the names starting with vowels from the list

let states = ["goa", "uttar pradesh", "simla", "Andhra Pradesh","Assam","Bihar","Odisha","Punjab"];
let vowels = ["a", "e", "i", "o", "u"];

let result = states.filter((state)=>{
    let firstChar = state[0].toLowerCase();
    return !vowels.includes(firstChar);
})
 console.log("Remove all the names starting with vowels from the list")
console.log(result);

// 2. reverse string
let s1 = "I love my India"
console.log(s1.split(" ").reverse().join(" "));

//3. use splice
let s2 = "INDIA";
let arr = s2.split("");
arr.splice(3, 0, "O", "N", "E", "S");
result = arr.join("");
console.log(result);

//4. count consonant and vowel
let s3 = "Ramesh is a brilliant student";
let vowel = 0, consonant = 0;
for(let ch of s3){
    if(vowels.includes(ch)){
        vowel++;
    }
    else if(ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z'){
        consonant++;
    }
}
console.log("vowels : " + vowel + " consonants : "+ consonant);

// 5. Replace wrong word with correct word
function correctfn(str, wrong, correct){
    return str.replace(wrong, correct);
}

let sentence = "I live in Delhii";
console.log(correctfn(sentence, "Delhii", "Delhi"));

// 6. Filter numbers greater than 5
let inputArr = [1,2,3,9,10,7,5,4,3];
let answer = inputArr.filter(num => num > 5);
console.log(answer);

// 7. Average using map and reduce
const students = [
    { name: "Ram", scores: [80, 70, 60] },
    { name: "Mohan", scores: [80, 70, 90] },
    { name: "Sai", scores: [60, 70, 80] },
    { name: "Hemang", scores: [90, 90, 80, 80] }
];

let result1 = students.map(student => ({
    name: student.name,
    average:
        student.scores.reduce((sum, score) => sum + score, 0) /
        student.scores.length
}));

console.log(result1);

// 8. Repeated sum of digits
function singleDigit(num){
    while(num >= 10){
        let sum = 0;
        while(num > 0){
            sum += num % 10;
            num = Math.floor(num / 10);
        }
        num = sum;
    }
    return num;
}
console.log(singleDigit(456));

// 9. Count words in paragraph
function countWords(paragraph){
    return paragraph.trim().split(/\s+/).length;
}
let para = "JavaScript is a powerful programming language";
console.log(countWords(para));

// 10. Reverse a string
function reverseString(str){
    return str.split("").reverse().join("");
}

console.log(reverseString("Hello"));

// 11. Find average marks of each student
let studentsData = {
    student1: {
        subject1: 44,
        subject2: 56,
        subject3: 87,
        subject4: 97,
        subject5: 37
    },
    student2: {
        subject1: 44,
        subject2: 56,
        subject3: 87,
        subject4: 97,
        subject5: 37
    },
    student3: {
        subject1: 44,
        subject2: 56,
        subject3: 87,
        subject4: 97,
        subject5: 37
    }
};

let output = {};

for(let student in studentsData){
    let marks = Object.values(studentsData[student]);

    let avg =
        marks.reduce((sum, mark) => sum + mark, 0) /
        marks.length;

    output[student] = {
        average: avg
    };
}

console.log(output);