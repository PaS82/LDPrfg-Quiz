// fragenUpdater.js
// Dieses Modul kann per <script src="fragenUpdater.js"> eingebunden werden
// Es lädt automatisch fragen.json (falls vorhanden)
// und erlaubt das Einlesen einer CSV/XLSX-Datei sowie das Speichern als fragen.json

(function () {
  const containerId = "fragen-update-container";
  let statusMessage = "";

  window.addEventListener("DOMContentLoaded", () => {
    createUI();

    // Lade fragen.json beim Start (optional)
    fetch("fragen.json")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          window.fragen = data;
          console.log("Fragen aus fragen.json geladen:", data.length);
          statusMessage = `📄 ${data.length} Fragen aus fragen.json geladen.`;
        } else {
          window.fragen = [];
          console.warn("Ungültiges JSON, starte mit leerem Katalog.");
          statusMessage = "⚠️ Ungültiges JSON – leer gestartet.";
        }
      })
      .catch(() => {
        console.log("Keine fragen.json gefunden – beginne leer.");
        window.fragen = [];
        statusMessage = "ℹ️ Keine fragen.json gefunden – beginne leer.";
      })
      .finally(() => {
        showStatus(statusMessage);
      });
  });

  function createUI() {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "0.3em";
    wrapper.style.background = "#f4f4f4";
    wrapper.style.border = "1px solid #ccc";
    wrapper.style.borderRadius = "8px";
    wrapper.style.padding = "0.7em";
    wrapper.style.marginBottom = "1em";
    wrapper.style.fontSize = "0.85em";
    wrapper.style.maxWidth = "400px";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv,.xlsx";
    fileInput.id = "fragen-upload";
    fileInput.style.fontSize = "0.85em";

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file) handleFileUpload(file);
    });

    const saveButton = document.createElement("button");
    saveButton.textContent = "💾 Fragen speichern";
    saveButton.style.fontSize = "0.85em";
    saveButton.onclick = downloadFragenAsJSON;

    const status = document.createElement("div");
    status.id = "fragen-update-status";
    status.style.fontSize = "0.85em";
    status.style.color = "#333";

    wrapper.appendChild(fileInput);
    wrapper.appendChild(saveButton);
    wrapper.appendChild(status);
    container.appendChild(wrapper);
  }

  function handleFileUpload(file) {
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
      reader.readAsText(file, "utf-8");
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
    if (!Array.isArray(window.fragen)) {
      window.fragen = [];
    }
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
})();
