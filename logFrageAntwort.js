function logFrageAntwort(frageObj, userAntworten, richtigeAntworten) {
  const richtigeAntwortenListe = Array.isArray(frageObj["Richtige Antwort"])
    ? frageObj["Richtige Antwort"]
    : [frageObj["Richtige Antwort"]];

  const alleAntworten = [
    ...richtigeAntwortenListe,
    ...(Array.isArray(frageObj["Falsche Antwort"]) ? frageObj["Falsche Antwort"] : [])
  ];

  reportLog.push({
    frage: frageObj.Frage,
    antworten: alleAntworten,
    userAntworten,
    richtigeAntworten: richtigeAntwortenListe
  });

  localStorage.setItem("reportLog", JSON.stringify(reportLog));
}
window.logFrageAntwort = logFrageAntwort;


/*
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
*/
