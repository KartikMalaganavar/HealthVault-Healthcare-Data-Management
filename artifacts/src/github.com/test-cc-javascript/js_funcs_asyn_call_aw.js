// The try statement defines a code block to run (to try).
// The catch statement defines a code block to handle any error.
// The finally statement defines a code block to run regardless of the result.
// The throw statement defines a custom error.

// CALLBACKS:
// function myFirst() {
//   myDisplayer("Hello");
// }

// function mySecond() {
//   myDisplayer("Goodbye");
// }

// mySecond();
// myFirst();

// AS THE CODE ABV ENDS WITH myFirst() ONLY THE ENDING CALLED FUNCTION EXECUTES
// IF CALLBACKS AREN'T USED

// ==================================================================================================================================================================================
// function myDisplayer(some) {
//   document.getElementById("demo").innerHTML = some;
// }

// function myCalculator(num1, num2, myCallback) {
//   let sum = num1 + num2;
//   myCallback(sum);
// }

// myCalculator(5, 5, myDisplayer);

// IN CALLBACKS THE ARGUMENT IS ALSO A FUCNTION NAME


// ==================================================================================================================================================================================

//          CODE WITH HARRY EXAMPLE

// console.log("This is tutorial 43");

// async function harry() 
// {
//   console.log("Inside harry function");
//   const response = await fetch("https://api.github.com/users");
//   console.log("before response");
//   const users = await response.json();
//   console.log("users resolved");
//   return users;
// }

// console.log("Before calling harry");
// let a = harry();
// console.log("After calling harry");
// console.log(a);
// a.then((data) => console.log(data));
// console.log("Last line of this jsfile");
