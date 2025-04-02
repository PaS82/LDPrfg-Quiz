// fragenUpdater.js
// Dieses Modul kann per <script src="fragenUpdater.js"> eingebunden werden
// und erweitert window.fragen dynamisch um neue Einträge aus einer CSV oder Excel-Datei.
// Erweiterung: Fragenkatalog kann als fragen.json gespeichert werden

(function () {
  const containerId = "fragen-update-container";

  function createUI() {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // sicherstellen, dass keine doppelten Elemente entstehen

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "0.5em";
    wrapper.style.background = "#f9f9f9";
    wrapper.style.border = "1px solid #ccc";
    wrapper.style.borderRadius = "12px";
    wrapper.style.padding = "1em";
    wrapper.style.marginBottom = "1em";
    wrapper.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv,.xlsx";
    fileInput.id = "fragen-upload";

    const button = document.createElement("button");
    button.textContent = "📥 Fragenkatalog aktualisieren";
    button.onclick = handleFileUpload;

    const saveButton = document.createElement("button");
    saveButton.textContent = "💾 Fragenkatalog speichern";
    saveButton.onclick = downloadFragenAsJSON;

    const status = document.createElement("div");
    status.id = "fragen-update-status";
    status.style.fontSize = "0.9em";
    status.style.color = "#333";

    wrapper.appendChild(fileInput);
    wrapper.appendChild(button);
    wrapper.appendChild(saveButton);
    wrapper.appendChild(status);
    container.appendChild(wrapper);
  }

  function handleFileUpload() {
    const file = document.getElementById("fragen-upload").files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (fileName.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const csv = e.target.result;
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            updateFragen(results.data);
          },
          error: function (err) {
            showStatus(`❌ Fehler beim Einlesen der CSV-Datei: ${err.message}`);
          }
        });
      };
      reader.readAsText(file, "ISO-8859-1");
    } else if (fileName.endsWith(".xlsx")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
        updateFragen(json);
      };
      reader.readAsArrayBuffer(file);
    } else {
      showStatus("❌ Unbekanntes Dateiformat. Bitte .csv oder .xlsx hochladen.");
    }
  }

  function updateFragen(parsedData) {
    const neueFragen = parseFragenDynamisch(parsedData);
    const vorher = window.fragen.length;
    const merged = mergeFragen(window.fragen, neueFragen);
    const danach = merged.length;
    window.fragen = merged;
    showStatus(`✅ ${danach - vorher} neue Fragen hinzugefügt.`);
  }

  function parseFragenDynamisch(rows) {
    return rows.map(row => {
      const frage = {
        fach: row.Fach,
        frage: row.Frage,
        richtigeAntworten: [],
        falscheAntworten: []
      };

      for (const key in row) {
        if (/^Richtige Antwort/.test(key) && row[key]) {
          frage.richtigeAntworten.push(row[key].trim());
        }
        if (/^Falsche Antwort/.test(key) && row[key]) {
          frage.falscheAntworten.push(row[key].trim());
        }
      }
      return frage;
    });
  }

  function mergeFragen(bisher, neu) {
    const keys = new Set(bisher.map(q => q.fach + "|" + q.frage));
    const unique = neu.filter(q => !keys.has(q.fach + "|" + q.frage));
    return [...bisher, ...unique];
  }

  function downloadFragenAsJSON() {
    const dataStr = JSON.stringify(window.fragen, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "fragen.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function showStatus(msg) {
    const statusEl = document.getElementById("fragen-update-status");
    if (statusEl) statusEl.textContent = msg;
  }

  // Initialisierung beim Laden des Scripts
  document.addEventListener("DOMContentLoaded", createUI);
})();
