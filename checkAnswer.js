// Fallback, falls mkId nicht global definiert ist (z. B. wenn checkAnswer.js separat geladen wird)
function mkId(fach, frage, text) {
  const raw = `${fach}||${frage}||${text}`;
  return btoa(unescape(encodeURIComponent(raw)));
}

function checkAnswer() {
  const inputs = document.querySelectorAll('input[name="answer"]');
  let richtig = 0, falsch = 0;
  const userAntwortenIds = [];
  const userAntworten = [];

  inputs.forEach(input => {
    const isCorrect = input.dataset.correct === '1';
    const rawText = (input.dataset.raw || "").trim();
    const ansId   = input.dataset.id;

    if (input.checked) {
      userAntworten.push(rawText);     // Anzeige / Rückwärtskompatibilität
      userAntwortenIds.push(ansId);    // robuste Auswertung
      if (isCorrect) richtig++;
      else falsch++;
    }
    if (!input.checked && isCorrect) falsch++; // richtige, aber nicht gewählte Antwort = Fehler
  });

  const f = window.selectedFach || '';
  if (!window.stats) window.stats = {};
  if (!window.stats[f]) window.stats[f] = { richtig: 0, falsch: 0 };
  window.stats[f].richtig += richtig;
  window.stats[f].falsch  += falsch;

  const qIdx = window.current || 0;
  const q = (window.questions || [])[qIdx] || {};

  // Frage & Antworten aus Daten holen (Texte, Rohform)
  const richtigeAntworten = Array.isArray(q["Richtige Antwort"])
    ? q["Richtige Antwort"].filter(Boolean)
    : [q["Richtige Antwort"]].filter(Boolean);
  const falscheAntworten = Array.isArray(q["Falsche Antwort"])
    ? q["Falsche Antwort"].filter(Boolean)
    : [];
  const alleAntworten = [...richtigeAntworten, ...falscheAntworten];

  // IDs aus Texten berechnen (identisch zu Render-IDs)
  const antwortenIds = alleAntworten.map(t => mkId(f, q.Frage, (t ?? "").toString().trim()));
  const richtigeAntwortenIds = richtigeAntworten.map(t => mkId(f, q.Frage, (t ?? "").toString().trim()));

  // Frage-Fehlerzähler (weiter Fragetext, falls keine q.id vorhanden)
  if (!window.frageFehlerCounter) window.frageFehlerCounter = {};
  const frageId = q.id || q.Frage;
  if (!window.frageFehlerCounter[frageId]) window.frageFehlerCounter[frageId] = 0;
  if (falsch > 0) window.frageFehlerCounter[frageId]++;

  // Report-Log-Eintrag mit IDs + Texten
  if (!window.reportLog) window.reportLog = [];
  const entry = {
    Fach: f,
    frage: q.Frage,
    antworten: alleAntworten,
    antwortenIds: antwortenIds,
    userAntworten: userAntworten,
    userAntwortenIds: userAntwortenIds,
    richtigeAntworten: richtigeAntworten,
    richtigeAntwortenIds: richtigeAntwortenIds
  };

  window.reportLog.push(entry);
  try { localStorage.setItem("reportLog", JSON.stringify(window.reportLog)); } catch (e) {}

  try { localStorage.setItem("quizStats", JSON.stringify(window.stats)); } catch (e) {}
  try { localStorage.setItem("frageFehlerCounter", JSON.stringify(window.frageFehlerCounter)); } catch (e) {}

  if (typeof window.nextQuestion === 'function') window.nextQuestion();
}
window.checkAnswer = checkAnswer;