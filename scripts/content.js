//Getting dialogs
let dialogs = {};
const dialogFetch = fetch(chrome.runtime.getURL("/resources/dialogs.json"))
  .then(response => response.json())
  .then(data => dialogs = data);



//States and complex functions
let chatboxState = false;

function sendMessage(from, e) {
    const answerBubble = document.createElement('p');
    answerBubble.classList.add("answer-bubble");
    const askBubble = document.createElement('p');
    askBubble.classList.add("ask-bubble");
    const confirmSection = document.createElement('div');
    const yesButton = document.createElement('button');
    const noButton = document.createElement('button');
    yesButton.addEventListener("click", () => confirm("yes"));
    noButton.addEventListener("click", () => confirm("no"));
    yesButton.innerHTML = "Yes";
    yesButton.classList.add("yes-button");
    noButton.classList.add("no-button");
    noButton.innerHTML = "No";
    confirmSection.classList.add("confirm-section");
    confirmSection.appendChild(noButton);
    confirmSection.appendChild(yesButton);
    const loadingContainer = document.createElement("div");
    loadingContainer.classList.add("loading-container");
    const loadingDot1 = document.createElement('div');
    const loadingDot2 = document.createElement('div');
    const loadingDot3 = document.createElement('div');
    loadingDot1.classList.add("loading-dot");
    loadingDot2.classList.add("loading-dot");
    loadingDot3.classList.add("loading-dot");
    loadingContainer.appendChild(loadingDot1);
    loadingContainer.appendChild(loadingDot2);
    loadingContainer.appendChild(loadingDot3);
  
    let dialog_num = "";
  
    function answer(dialogs, question) {
      dialogSpace.appendChild(loadingContainer);
  
      let confirm_state = false;
      let responseContent = "";
  
      for (const dialog in dialogs) {
        if (question == dialogs[dialog].cue[0] || question == dialogs[dialog].cue[1]) {
          responseContent = dialogs[dialog].response;
          if (dialog != "dialog3") {
            confirm_state = true;
          }
          dialog_num = dialog;
          break;
        } else {
          responseContent = "Not supported!";
        }
      };
  
      answerBubble.innerHTML = responseContent;
  
      setTimeout(() => {
        dialogSpace.removeChild(loadingContainer);
        dialogSpace.appendChild(answerBubble);
        if (confirm_state == true) {
          dialogSpace.appendChild(confirmSection);
        }
      }, 2000)
    }
  
    function confirm(cond) {
      const servings = document.querySelectorAll('.mntl-recipe-details__value')[3];
      const yieldings = document.querySelectorAll('.mntl-recipe-details__value')[4];
      const original_yieldings = yieldings.innerHTML;
      const original_servings = servings.innerHTML;
      const divElement = document.getElementById("mntl-structured-ingredients_1-0");
      const ulElement = divElement.querySelector('ul');
      const listItems = ulElement.querySelectorAll('li');
      console.log(listItems);
      const original_quantities = [];
      for (let i = 0; i <= 12; i++) {
        const span = listItems[i].querySelector('p').querySelector('span');
        original_quantities.push(span.innerHTML);
      }
  
      const step = document.getElementById("mntl-sc-block_7-0");
      const original_step = step.innerHTML;
      const ingredientList = document.getElementById('mntl-structured-ingredients_1-0');
      const spans = ingredientList.querySelectorAll('span');
      let whole_milk = "";
      let sour_cream = ""; 
      for (let i = 0; i < spans.length; i++) {
        const span = spans[i];
        if (span.innerHTML.trim() === 'whole milk') {
          whole_milk = span;
        } else if (span.innerHTML.trim() === "sour cream") {
          sour_cream = span;
        }
      }
      const description = document.querySelector('p.article-subheading.type--dog');
      const nutritions = document.body.querySelectorAll('.mntl-nutrition-facts-summary__table-cell.type--dog-bold');
      console.log("Nutritions:", nutritions);
      let original_nutritions = [];
      nutritions.forEach(item => original_nutritions.push(item.innerHTML));
      const tableContainer = document.body.querySelector('.mntl-nutrition-facts-label__contents');
      const originalTable = tableContainer.innerHTML;
      
  
      function displayText(mode) {
        const added_info = document.createElement('p');
        added_info.innerHTML = "You can also use coconut milk and Greek yogurt to substitute whole milk and sour cream, respectively";
        added_info.classList.add("article-subheading.type--dog");
        added_info.style.color = "#D54215";
        added_info.id = "added_info";
  
        if (dialog_num == "dialog1") {
          const replacements = ["1", "2/3", "1", "1 1/3", "1 1/3", "1 1/3", "2", "1 1/3", "2/3", "2/3", "2/3", "1/3", "1/3"];
      
          if (mode == "AI") {
            servings.innerHTML = "4";
            yieldings.innerHTML = "8 pancakes";
            servings.style = "color: #D54215";
            yieldings.style = "color: #D54215";
            for (let i = 0; i <= 12; i++) {
              const span = listItems[i].querySelector('p').querySelector('span');
              span.innerHTML = replacements[i];
              span.style = "color: #D54215";
            }
          } else if (mode == "original") {
            servings.innerHTML = original_servings;
            yieldings.innerHTML = original_yieldings;
            servings.style = "color: black";
            yieldings.style = "color: black";
            for (let i = 0; i <= 12; i++) {
              console.log("List Item:", listItems[i]);
              const span = listItems[i].querySelector('p').querySelector('span');
              span.innerHTML = original_quantities[i];
              span.style = "color: black";
            }
          }
        } else if (dialog_num == "dialog2") {        
          if (mode == "AI") {
            description.after(added_info);

            whole_milk.innerHTML = "coconut milk";
            sour_cream.innerHTML = "Greek yogurt";
            whole_milk.style = "color: #D54215";
            sour_cream.style = "color: #D54215";

            step.innerHTML = "Break matzo sheets into bite-sized pieces. Whisk together eggs, coconut milk, sugar, Greek yogurt, vanilla, cinnamon, salt, and nutmeg in a large bowl. Stir in raisins, apricots, apples, and matzo pieces. Transfer to the prepared baking dish, smoothing into an even layer. Cover with aluminum foil and transfer to a refrigerator to chill for 8 hours, or overnight.";;
            step.style.color = "#D54215";

            const nutritions_replacement = ["392", "58g", "15g", "28g"];
            for (let i = 0; i <= 3; i++) {
              const nutrition = nutritions[i];
              nutrition.innerHTML = nutritions_replacement[i];
              nutrition.style.color = "#D54215";
            }
  
            fetch(chrome.runtime.getURL("/resources/newTable.html"))
              .then(response => response.text())
              .then(data => tableContainer.innerHTML = data);
            tableContainer.style.color = "#D54215";
  
          } else if (mode == "original") {
            document.getElementById('added_info').remove();
  
            step.innerHTML = original_step;
            step.style.color = "black";
  
            whole_milk.innerHTML = "whole milk";
            whole_milk.style.color = "black";

            sour_cream.innerHTML = "sour cream";
            sour_cream.style.color = "black";
  
            for (let i = 0; i <= 3; i++) {
              const nutrition = nutritions[i];
              nutrition.innerHTML = original_nutritions[i];
              nutrition.style.color = "black";
            }
  
            tableContainer.innerHTML = originalTable;
            tableContainer.style.color = "black";  
          }
        }
      }
  
      dialogSpace.removeChild(confirmSection);
      const answerBubble = document.createElement('p');
      answerBubble.classList.add("answer-bubble");
      answerBubble.innerHTML = `${cond == "yes" ? "Here you go." : "Alright!"} Have fun cooking!`
      dialogSpace.appendChild(answerBubble);
  
      if (cond == "yes") {
        const versionSwitchbox = document.createElement('div');
        versionSwitchbox.classList.add('version-switchbox');
        const info = document.createElement('p');
        info.innerHTML = "Modification of recipe has been made. View:";
        const originalButton = document.createElement('button');
        originalButton.classList.add('original-button');
        originalButton.innerHTML = 'Original recipe';
        const modifiedButton = document.createElement('button');
        modifiedButton.classList.add('modified-button');
        modifiedButton.innerHTML = 'AI-modified recipe';
        const exitButton = document.createElement("button");
        exitButton.classList.add('exit-button');
        exitButton.innerHTML = 'Do not show again';
        versionSwitchbox.appendChild(info);
        versionSwitchbox.appendChild(originalButton);
        versionSwitchbox.appendChild(modifiedButton);
        versionSwitchbox.appendChild(exitButton);
        
        const article = document.querySelector("article");
        console.log(article.classList);
        article.classList.add("modified-recipe");
        article.appendChild(versionSwitchbox);
        displayText("AI");
  
        originalButton.addEventListener("click", () => {
          originalButton.style.backgroundColor = "#E7AB46";
          modifiedButton.style.backgroundColor = "white";
          displayText("original");
        });
        modifiedButton.addEventListener("click", () => {
          originalButton.style.backgroundColor = "white";
          modifiedButton.style.backgroundColor = "#E7AB46";
          displayText("AI");
        });
        exitButton.addEventListener("click", () => {
          article.removeChild(versionSwitchbox);
          article.classList.remove("modified-recipe");
          displayText("original");
        });
      }
    }
  
    if (from == "enter" && e.keyCode == 13) {
      askBubble.innerHTML = inputField.value;
      inputField.value = "";
      inputField.blur();
      dialogSpace.appendChild(askBubble);
      answer(dialogs, askBubble.innerHTML);
      e.preventDefault();
    } else if (from == "button") {
      askBubble.innerHTML = inputField.value;
      inputField.value = "";
      inputField.blur();
      dialogSpace.appendChild(askBubble);
      answer(dialogs, askBubble.innerHTML);
    }
}



//The chatbot icon
const chatbot = document.createElement('img');
chatbot.src = chrome.runtime.getURL("/resources/chatbot.png");
chatbot.classList.add('chatbot');
chatbot.addEventListener('click', () => {
  chatboxState = !chatboxState;
  if (chatboxState) {
    try {
      signpost.remove();
      cancel_signpost.remove();
    } finally {
      document.body.appendChild(chatbox);
    }
  } else {
    chatbox.remove();
  }
});
document.body.appendChild(chatbot);

//The signpost bubble
const signpost = document.createElement('img');
signpost.src = chrome.runtime.getURL("/resources/signpost.png");
signpost.classList.add('signpost');
document.body.appendChild(signpost);
const cancel_signpost = document.createElement('img');
cancel_signpost.src = chrome.runtime.getURL("/resources/cancel_signpost.png");
cancel_signpost.classList.add('cancel_signpost');
cancel_signpost.addEventListener("click", () => {
  signpost.remove();
  cancel_signpost.remove();
});
document.body.appendChild(cancel_signpost);

//The chatbox
const chatbox = document.createElement('div');
chatbox.classList.add('chatbox');

const collapseSection = document.createElement('div');
collapseSection.classList.add('collapse-section');

const collapseButton = document.createElement('img');
collapseButton.classList.add('collapse-button');
collapseButton.src = chrome.runtime.getURL("/resources/close.png");
collapseButton.addEventListener('click', () => {
  chatboxState = !chatboxState;
  body.removeChild(chatbox);
});

const botTitle = document.createElement('h1');
botTitle.classList.add('bot-title');
botTitle.innerHTML = "Smart Chef";

collapseSection.appendChild(botTitle);
collapseSection.appendChild(collapseButton);

const dialogSpace = document.createElement('div');
dialogSpace.classList.add("dialog-space");
const answerBubble = document.createElement('p');
answerBubble.classList.add("answer-bubble");
answerBubble.innerHTML = "Hello there! How can I help you today?"
dialogSpace.appendChild(answerBubble);

const inputSection = document.createElement('div');
const inputField = document.createElement('textarea');
inputField.classList.add('input-field');
inputField.placeholder = "Ask our smart chef anything!"
inputField.addEventListener("keypress", (e) => {sendMessage("enter", e)})
const sendButton = document.createElement('img');
sendButton.classList.add('send-button');
sendButton.src = chrome.runtime.getURL("/resources/send.png");
sendButton.addEventListener("click", (e) => {
  if (inputField.value) sendMessage("button", e);
})

inputSection.appendChild(inputField);
inputSection.appendChild(sendButton);
inputSection.classList.add('input-section');

chatbox.appendChild(collapseSection);
chatbox.appendChild(dialogSpace);
chatbox.appendChild(inputSection);