// debugger;
// alert("hey");

// const sayHello = () => {
//   alert("Hello");
// };

// const sayGoodbye = () => {
//   setTimeout(() => {
//     alert("Goodbye");
//   }, 0);
//   sayHello();
// };

// const Hi = () => {
//   alert("Hi");
//   sayGoodbye();
// };

// Hi();

// alert("bye");

// Language: javascript
// 1. two non empty linked lists representing two non-negative integers. The digits are stored in reverse order, each of the nodes contain a single digit. Add the two numbers and return it as a linked list. Given a non-negative integer, return a linked list representing the integer.
let l1 = {
  val: 1, // val is the value of the node
  next: {
    // next is the pointer to the next node
    val: 2,
  },
};
let l2 = {
  val: 3,
  next: {
    val: 4,
  },
};

var addTwoNumbers = function (l1, l2) {
  let result = {
    // result is the linked list that will be returned
    val: 0,
    next: null,
  };
  let current = result; // current is the current node in the linked list
  let carry = 0; // carry is the carry over from the previous addition
  while (l1 || l2) {
    let sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    carry = Math.floor(sum / 10);
    current.next = {
      val: sum % 10,
      next: null,
    };
    current = current.next; // move to the next node
    if (l1) l1 = l1.next; // if l1 is not null, move to the next node
    if (l2) l2 = l2.next;
  }
  if (carry) {
    current.next = {
      val: carry,
      next: null,
    };
  }
  return result.next;
};
