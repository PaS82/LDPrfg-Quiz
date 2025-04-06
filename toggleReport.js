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
