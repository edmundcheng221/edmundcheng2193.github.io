const nextButton = document.querySelector("button.switch");
nextButton.addEventListener('click', clicker);

const theTxt = document.querySelector('p');

const text= ["I found the text interesting. When McLuhan talks about the Medium, he is referring to the way in which messages are transmitted. I particularly like the part where McLuhan says'Many of our institutions suppress althe natural direct experience of youth, who respond with untaught delight to the poetry and the beauty of the new technological environment.' (page 100) Perhaps McLuhan is trying to argue that people should be allowed to experience new technology on their own. I also like how there were a lot of pictures because the reading is way too long."]

let i = 0;

function clicker(){    
    theTxt.textContent = text[i];
}

