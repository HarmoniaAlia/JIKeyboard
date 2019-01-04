function openKeyboard(event, kbId) {

  let kbDescripions = document.getElementsByClassName("kbDescription");
  for (let i = 0; i < kbDescripions.length; i++) {
    kbDescripions[i].style.display = "none";
  }

  let kbLinks = document.getElementsByClassName("kbLink");
  for (i = 0; i < kbLinks.length; i++) {
    kbLinks[i].className = kbLinks[i].className.replace(" active", "");
  }

  document.getElementById(kbId).style.display = "block";
  event.currentTarget.className += " active";
}



function openModal(event, modalId) {
  document.getElementById(modalId).style.display = 'block'
}




function closeModals(event) {
  let modals = document.getElementsByClassName('modalBackground');
  if (event.target == event.currentTarget) {
    for (let i = 0; i < modals.length; i++) {
      modals[i].style.display = "none";
    }
  }
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