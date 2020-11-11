const nextButton = document.querySelector("button.switch");
nextButton.addEventListener('click', clicker);

const theTxt = document.querySelector('p');

const text= ["I found the text interesting. \
I liked the part when McLuhan talks about the Medium, \
he is referring to the way in which messages are transmitted. I particularly like \
the part where McLuhan says 'Many of our institutions suppress all the natural direct\
 experience of youth, who respond with untaught delight to the poetry and the \
 beauty of the new technological environment' (page 100). Perhaps McLuhan is trying\
  to argue that people should be allowed to experience new technology on their own. \
 He might be suggesting that in education people focus too much on the information \
 rather than the technology itself. Furthermore, what I got from this reading is that \
 the medium or the form of the message \
 (print, web, tech, visual, etc) determines the way in which the message is perceived. \
 Thus, the message is affected by the medium in which it is transmitted. \
 I might be wrong but that was what I got from the reading. \
  I also like how there were a lot of pictures. "]

let i = 0;
document.getElementsById('switching').addEventListener("click", imagefunction);


function clicker(){    
    theTxt.textContent = text[i];
    document.getElementById('picture').src="../img/mcluhan_tech.png"

}


