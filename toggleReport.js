function toggleReport() {
  const container = document.getElementById("reportContainer");
  const button = document.getElementById("toggleReport");

  if (container.style.display === "none") {
    container.innerHTML = "<h3>Antwortbericht</h3>" +
      reportLog.map((entry, i) => `
        <div style='margin-bottom:1em; border-bottom: 1px solid #ccc; padding-bottom: 0.5em;'>
          <strong>Frage ${i + 1}:</strong> ${entry.frage}<br>
          <ul style="list-style:none; padding-left:0; margin-top:0.5em;">
            ${entry.antworten.map(a => {
              const isChecked = entry.userAntworten.includes(a);
              const isCorrect = entry.richtigeAntworten.includes(a);

              let symbol = "⬜️"; // Standard: falsch ignoriert
              if (isCorrect && isChecked) {
                symbol = "✅";  // Richtig angeklickt
              } else if (!isCorrect && isChecked) {
                symbol = "❌";  // Falsch angeklickt
              } else if (isCorrect && !isChecked) {
                symbol = "⚠️";  // Richtige Antwort vergessen
              }

              return `<li style="color:black; margin-bottom:0.3em;">
                ${symbol} ${a}
              </li>`;
            }).join('')}
          </ul>
        </div>
      `).join('');
    
    container.style.display = "block";
    button.textContent = "Antwortbericht verbergen";
  } else {
    container.style.display = "none";
    button.textContent = "Antwortbericht anzeigen";
  }
}
window.toggleReport = toggleReport;


/*
function toggleReport() {
  const container = document.getElementById("reportContainer");
  const button = document.getElementById("toggleReport");

  if (container.style.display === "none") {
    container.innerHTML = "<h3>Antwortbericht</h3>" +
      reportLog.map((entry, i) => `
        <div style='margin-bottom:1em;'>
          <strong>Frage ${i + 1}:</strong> ${entry.frage}<br>
          <ul>
            ${entry.antworten.map(a => {
              const isChecked = entry.userAntworten.includes(a);
              const isCorrect = entry.richtigeAntworten.includes(a);

              let color = "black";  // Standardfarbe
              if (isCorrect && isChecked) color = "green";       // ✅ Richtig angekreuzt
              if (!isCorrect && isChecked) color = "red";         // ❌ Falsch angekreuzt
              if (isCorrect && !isChecked) color = "orange";      // ⚠️ Richtige Antwort vergessen

              let symbol = isChecked ? "✅" : "⬜";  // Angeklickt oder nicht

              return `<li style='color:${color}'>${symbol} ${a} ${isCorrect ? "(richtig)" : ""}</li>`;
            }).join('')}
          </ul>
        </div>
      `).join('');
    
    container.style.display = "block";
    button.textContent = "Antwortbericht verbergen";
  } else {
    container.style.display = "none";
    button.textContent = "Antwortbericht anzeigen";
  }
}
window.toggleReport = toggleReport;
*/
