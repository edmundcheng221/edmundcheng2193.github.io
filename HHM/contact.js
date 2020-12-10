function validate(){
    let name = document.getElementById("name").value;
    let subject = document.getElementById("subject").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;
    let error_message = document.getElementById("error_message");
    
    error_message.style.padding = "10px";
    
    let text;


    if(name.length < 1) {
      text = "Please Enter valid Name";
      error_message.innerHTML = text;
      return false;
    }

    if(name.includes('0') || name.includes('1') || name.includes('2') || name.includes('3') || 
      name.includes('4') || name.includes('5') || name.includes('6') || 
      name.includes('7') || name.includes('8') || name.includes('9')) {
      text = "Please Enter valid Name";
      error_message.innerHTML = text;
      return false;
    }

    
    if(subject.length < 1){
      text = "Please Enter Correct Subject";
      error_message.innerHTML = text;
      return false;
    }

    if(isNaN(phone) || phone.length != 10){
      text = "Please Enter valid Phone Number";
      error_message.innerHTML = text;
      return false;
    }

    if(email.includes('@') == false || email.includes('.') == false) {
      text = "Please Enter valid Email";
      error_message.innerHTML = text;
      return false;
    }

    if(message.length < 1){
      text = "Please Enter a Message";
      error_message.innerHTML = text;
      return false;
    }

    alert("Thank you for your message! We will get back to you soon.");
    return true;
  }