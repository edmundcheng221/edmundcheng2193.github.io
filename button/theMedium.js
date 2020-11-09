let theBody = document.querySelector('body');
let theButton = document.querySelector("button");
let theTxt = document.querySelector('h2');

theButton.addEventListener('click', theColor);



function theColor(){

    console.log("click!!!");
    theBody.style.backgroundColor = 'aqua';
    theBody.style.color = 'green';
    document.querySelector('h2').textContent = "you pressed the button!";


}

document.addEventListener('keydown', theEvent => {
 if (theEvent.keyCode === 65){
    theBody.style.backgroundColor = 'yellow';
    document.querySelector('h2').textContent = "you pressed A!";

 }
})

document.addEventListener('keydown', theEvent => {
    if (theEvent.keyCode === 32){
        theBody.style.backgroundColor = 'yellow';
        document.querySelector('h2').textContent = "you pressed space!";

    }
})

//displays date
document.getElementById("clicker").addEventListener("click", displayDate);

function displayDate() {
    document.getElementById("para").innerHTML = Date();
}

// function theColor(){

//     console.log("cick!!!");
//     theBody.style.backgroundColor = 'aqua';
//     theBody.style.color = 'green';
//     document.querySelector('h2').textContent = "you pressed the button!";


// }


// Hello world pop up
var x = document.getElementById("myBtn");
x.addEventListener("click", myFunction2);

function myFunction2() {
  alert ("Hello World!")
}


// This creates two pop ups
var x = document.getElementById("myBtn2");
x.addEventListener("click", myFunction1);
x.addEventListener("click", someOtherFunction);

function myFunction1() {
  alert ("this is the first pop up")
}

function someOtherFunction() {
  alert ("This is the second pop up")
}


// This makes the button red
document.getElementById("myBtn3").addEventListener("click", function() {
    this.style.backgroundColor = "blue";
  });

//prints "some words......." when clicked
document.getElementById("myBtn4").addEventListener("click", myFunction);

function myFunction() {
    document.getElementById("words").innerHTML = "Some words......";
}

// creates random number based on button size
window.addEventListener("resize", () => {
    document.getElementById("myBtn5").innerHTML = Math.random();
});



// does some calculations
document.getElementById("myBtn7").addEventListener("click", () => {
    clickFunction(5, 7);
});

function clickFunction(a, b) {
    var result = a ** b;
    document.getElementById("paragraph").innerHTML = result;
}

//shows image
document.getElementById('myBtn10').addEventListener("click", imagefunction);
function imagefunction(){
    document.getElementById('troll').src="images/troll.png"
}