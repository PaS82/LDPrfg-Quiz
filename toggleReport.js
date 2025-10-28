function toggleReport() {
  const container = document.getElementById("reportContainer");
  const button = document.getElementById("toggleReport");

  if (container.style.display === "none") {
    const fachGruppiert = {};

    reportLog.forEach(entry => {
      const fach = entry.Fach || "Unbekanntes Fach";
      if (!fachGruppiert[fach]) fachGruppiert[fach] = [];
      fachGruppiert[fach].push(entry);
    });

    container.innerHTML = "<h3>Antwortbericht nach Fach</h3>" 
      <div style="background: #f9f9f9; border: 1px solid #ddd; border-radius: 6px; padding: 0.5em; margin-bottom: 1em; text-align: center; font-size: 0.9em; color: #333;">
       <strong>Legende:</strong> 
       ✅ Richtige Antwort &nbsp;&nbsp; ❌ Falsche Antwort &nbsp;&nbsp; ⚠️ Richtige Antwort vergessen 
     </div> & Object.keys(fachGruppiert).map((fach, idx) => `
      <div style='margin-bottom:1em; border:1px solid #ccc; border-radius:4px; padding:0.5em;'>
        <div style="cursor:pointer; font-weight:bold;" onclick="document.getElementById('fach_${idx}').style.display = document.getElementById('fach_${idx}').style.display === 'none' ? 'block' : 'none';">
          ${fach} ▼
        </div>
        <div id="fach_${idx}" style="display:none; margin-top:0.5em;">
          ${fachGruppiert[fach].map((entry, i) => `
            <div style='margin-bottom:0.5em; border-bottom: 1px dashed #ddd; padding-bottom:0.5em;'>
              <strong>Frage ${i + 1}:</strong> ${entry.frage}<br>
              <ul style="list-style:none; padding-left:0; margin-top:0.5em;">
                ${entry.antworten.map(a => {
                  const isChecked = entry.userAntworten.some(ans => ans.trim() === a.trim());
                  const isCorrect = entry.richtigeAntworten.some(ans => ans.trim() === a.trim());

                  let symbol = "⬜️"; // Standard: falsch ignoriert
                  if (isCorrect && isChecked) symbol = "✅";
                  else if (!isCorrect && isChecked) symbol = "❌";
                  else if (isCorrect && !isChecked) symbol = "⚠️";

                  return `<li style="color:black; margin-bottom:0.3em;">${symbol} ${a}</li>`;
                }).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
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
                symbol = "⚠️❌";  // Richtige Antwort vergessen
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
*/

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



