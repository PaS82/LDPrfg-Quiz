fetch("fragen.json")
  .then(res => res.ok ? res.json() : []) // Wenn Datei ok: JSON parsen, sonst leeres Array
  .then(data => {
    if (Array.isArray(data)) {
      window.fragen = data;
      console.log("Fragen aus fragen.json geladen:", data.length);
    } else {
      console.warn("Ungültiges JSON, starte mit leerer Liste.");
      window.fragen = [];
    }

    // Aktualisiert die Fachauswahl im Dropdown, falls Funktion verfügbar
    if (typeof updateFachauswahl === "function") {
      updateFachauswahl();
    }
  })
  .catch(err => {
    console.warn("Keine fragen.json gefunden, starte leer.");
    window.fragen = [];
  });
