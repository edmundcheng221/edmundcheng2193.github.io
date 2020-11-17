console.log('Hello World')
console.log('Will add some JavaScript soon.....')
console.log('I am a developer who clearly can\'t write JavaScript. Call me a failure.')



let modal = document.getElementById('id01');
let modal2 = document.getElementById('id02');

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";

  } else if (event.target == modal2) {
    modal2.style.display = "none";
      
  }
}
