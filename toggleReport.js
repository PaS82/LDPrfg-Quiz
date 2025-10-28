function toggleReport() {
  const container = document.getElementById("reportContainer");
  const button = document.getElementById("toggleReport");

  // Fallback-Gleichheit für ältere Logs (ohne IDs)
  const eq = (a,b) => (a ?? "").toString().replace(/\s+/g, " ").trim().toLowerCase() ===
                      (b ?? "").toString().replace(/\s+/g, " ").trim().toLowerCase();

  if (container.style.display === "none") {
    const fachGruppiert = {};
    (window.reportLog || []).forEach(entry => {
      const fach = entry.Fach || "Unbekanntes Fach";
      (fachGruppiert[fach] ||= []).push(entry);
    });

    container.innerHTML = `
      <h3>Antwortbericht nach Fach</h3>
      <div style="background:#f9f9f9;border:1px solid #ddd;border-radius:6px;padding:.5em;margin-bottom:1em;text-align:center;font-size:.9em;color:#333;">
        <strong>Legende:</strong>
        ✅ Richtige Antwort &nbsp;&nbsp; ❌ Falsche Antwort &nbsp;&nbsp; ⚠️ Richtige Antwort vergessen
      </div>
      ${Object.keys(fachGruppiert).map((fach, idx) => `
        <div style="margin-bottom:1em; border:1px solid #ccc; border-radius:4px; padding:.5em;">
          <div style="cursor:pointer; font-weight:bold;"
               onclick="document.getElementById('fach_${idx}').style.display =
                        document.getElementById('fach_${idx}').style.display === 'none' ? 'block' : 'none';">
            ${fach} ▼
          </div>
          <div id="fach_${idx}" style="display:none; margin-top:.5em;">
            ${fachGruppiert[fach].map((entry, i) => {
              const texts   = Array.isArray(entry.antworten) ? entry.antworten : [];
              const ids     = Array.isArray(entry.antwortenIds) ? entry.antwortenIds : [];
              const userIds = Array.isArray(entry.userAntwortenIds) ? entry.userAntwortenIds : null;
              const corrIds = Array.isArray(entry.richtigeAntwortenIds) ? entry.richtigeAntwortenIds : null;
              const userTxt = Array.isArray(entry.userAntworten) ? entry.userAntworten : [];
              const corrTxt = Array.isArray(entry.richtigeAntworten) ? entry.richtigeAntworten : [];

              return `
                <div style="margin-bottom:.5em; border-bottom:1px dashed #ddd; padding-bottom:.5em;">
                  <strong>Frage ${i + 1}:</strong> ${entry.frage}<br>
                  <ul style="list-style:none; padding-left:0; margin-top:.5em;">
                    ${texts.map((aText, tIdx) => {
                      const aId = ids[tIdx];
                      let isChecked, isCorrect;

                      if (userIds && corrIds && aId) {
                        isChecked = userIds.includes(aId);
                        isCorrect = corrIds.includes(aId);
                      } else {
                        // Fallback für ältere Einträge ohne IDs
                        isChecked = userTxt.some(u => eq(u, aText));
                        isCorrect = corrTxt.some(c => eq(c, aText));
                      }

                      let symbol = "⬜️";
                      if (isCorrect && isChecked) symbol = "✅";
                      else if (!isCorrect && isChecked) symbol = "❌";
                      else if (isCorrect && !isChecked) symbol = "⚠️";

                      return `<li style="color:black; margin-bottom:.3em;">${symbol} ${aText}</li>`;
                    }).join("")}
                  </ul>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `).join("")}
    `;

    container.style.display = "block";
    button.textContent = "Antwortbericht verbergen";
  } else {
    container.style.display = "none";
    button.textContent = "Antwortbericht anzeigen";
  }
}
window.toggleReport = toggleReport;