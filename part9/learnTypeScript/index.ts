// TypeScript 学习示例

// 基本类型
const name: string = "TypeScript";
const age: number = 10;
const isAwesome: boolean = true;

// 数组
const numbers: number[] = [1, 2, 3, 4, 5];
const fruits: Array<string> = ["apple", "banana", "orange"];

// 接口
interface Person {
  name: string;
  age: number;
  email?: string; // 可选属性
}

// 函数
function greet(person: Person): string {
  return `Hello, ${person.name}! You are ${person.age} years old.`;
}

// 类
class Student implements Person {
  name: string;
  age: number;
  grade: number;

  constructor(name: string, age: number, grade: number) {
    this.name = name;
    this.age = age;
    this.grade = grade;
  }

  introduce(): string {
    return `I'm ${this.name}, ${this.age} years old, in grade ${this.grade}.`;
  }
}

// 使用示例
const john: Person = {
  name: "John",
  age: 25,
  email: "john@example.com"
};

const student = new Student("Alice", 20, 3);

console.log(greet(john));
console.log(student.introduce());

// 联合类型
type Status = "pending" | "approved" | "rejected";

function processStatus(status: Status): void {
  switch (status) {
    case "pending":
      console.log("等待处理...");
      break;
    case "approved":
      console.log("已批准！");
      break;
    case "rejected":
      console.log("已拒绝。");
      break;
  }
}

processStatus("approved");

// 泛型
function identity<T>(arg: T): T {
  return arg;
}

const result1 = identity<number>(42);
const result2 = identity<string>("Hello TypeScript!");

console.log(result1, result2);

console.log(`欢迎来到 ${name} 世界！`);
