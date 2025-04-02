fetch("fragen.json")
  .then(res => res.json())
  .then(data => {
    window.fragen = data;
    updateFachauswahl(); // falls benötigt
  })
  .catch(err => console.error("❌ Fehler beim Laden von fragen.json:", err));