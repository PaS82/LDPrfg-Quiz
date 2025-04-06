function logFrageAntwort(frageObj, userAntworten, richtigeAntworten) {
  reportLog.push({
    frage: frageObj.Frage,
    antworten: Array.isArray(frageObj["Falsche Antwort"])
      ? [frageObj["Richtige Antwort"], ...frageObj["Falsche Antwort"]]
      : [frageObj["Richtige Antwort"]],
    userAntworten,
    richtigeAntworten: Array.isArray(richtigeAntworten)
      ? richtigeAntworten.flat()
      : [richtigeAntworten]
  });

  localStorage.setItem("reportLog", JSON.stringify(reportLog));
}
window.logFrageAntwort = logFrageAntwort;
