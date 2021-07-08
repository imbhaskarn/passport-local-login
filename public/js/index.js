
setTimeout(() => {
  let element = document.getElementsByClassName("alert");
  for (x in element) {
    element[x].remove();
  }
}, 5000);