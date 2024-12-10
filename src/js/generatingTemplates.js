async function loadTemplate(url, elementId) {
  const response = await fetch(url);
  const content = await response.text();
  document.getElementById(elementId).innerHTML = content;
}

loadTemplate("/templates/header.html", "header");
loadTemplate("/templates/footer.html", "footer");
