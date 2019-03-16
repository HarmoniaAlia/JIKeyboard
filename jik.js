
function openKeyboard(event, kbId) {

  let allLinks = document.getElementsByClassName("kbLink");
  for (i = 0; i < allLinks.length; i++) {
    allLinks[i].classList.remove("active");
  }

  let currentLink = event.currentTarget;
  currentLink.classList.add("active");

  let allDescriptions = document.getElementsByClassName("kbDescription");
  for (let i = 0; i < allDescriptions.length; i++) {
    allDescriptions[i].classList.remove("active");
  }

  let currentDescription = document.getElementById(kbId);
  currentDescription.classList.add("active");



  // document.getElementById(kbId).style.display = "block";

  //event.currentTarget.className += " active";
}



function openModal(event, modalId) {
  let frame = document.getElementById(modalId);
  frame.style.display = "block";
}


function closeModal(event) {
  let frame = event.target.closest('.modalFrame');
  frame.style.display = "none";
}



function addHarmony(event, position, clear) {
  let currentHarmony = event.target.closest('.harmonySettings');
  let newHarmony = currentHarmony.cloneNode(true);
  switch (position) {
    case 'before':
      currentHarmony.before(newHarmony);
      break;
    case 'after':
      currentHarmony.after(newHarmony);
      break;
    default:
      break;
  }
  if (clear) {
    let newInputs = newHarmony.querySelectorAll('input');
    for (let i of newInputs) {
      i.value = '';
    }
  }
}

function removeHarmony(event) {
  let currentHarmony = event.target.closest('.harmonySettings');
  currentHarmony.remove();
}


function saveKeyboard(event) {
  let keyboardSettings = event.target.closest('#keyboardSettings');
  let json = JSON.stringify(keyboardSettings);

}