<!-- UI and Script for CSV/Excel to JSON Conversion -->

function togglePanel() {
  const body = document.getElementById('panel-body');
  body.style.display = body.style.display === 'none' ? 'block' : 'none';
}

function convertAndDownload() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) return alert("Bitte wähle eine Datei aus.");

  handleFileUpload(file, (json) => {
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "konvertiert.json";
    a.click();
    URL.revokeObjectURL(url);
  });
}

function handleFileUpload(file, callback) {
  const reader = new FileReader();
  const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

  reader.onload = function (e) {
    if (isExcel) {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
      callback(convertToJsonStructure(data));
    } else {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          callback(convertToJsonStructure(results.data));
        },
      });
    }
  };

  if (isExcel) reader.readAsBinaryString(file);
  else reader.readAsText(file);
}

function convertToJsonStructure(data) {
  return data.map((row) => {
    
    const richtigeAntworten = Object.keys(row)
      .filter((key) => key.toLowerCase().startsWith("richtigeantwort"))
      .map((key) => row[key])
      .filter((val) => val);

    const falscheAntworten = Object.keys(row)
      .filter((key) => key.toLowerCase().startsWith("falscheantwort"))
      .map((key) => row[key])
      .filter((val) => val);

    return {
      Fach: row.Fach || row.fach || "",
      Frage: row.Frage || row.frage || "",
      "Richtige Antwort": richtigeAntworten,
      "Falsche Antwort": falscheAntworten,
    };

  });
}
