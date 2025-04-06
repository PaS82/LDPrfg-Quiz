function checkAnswer() {
  const inputs = document.querySelectorAll('input[name="answer"]');
  let richtig = 0, falsch = 0;
  let userAntworten = [];

  inputs.forEach(input => {
    const isCorrect = input.value === "true";
    const antwortText = input.parentElement.textContent.trim();

    if (input.checked) {
      userAntworten.push(antwortText);
      if (isCorrect) richtig++;
      else falsch++;
    }
    if (!input.checked && isCorrect) falsch++;
  });

  const f = selectedFach;
  if (!stats[f]) stats[f] = { richtig: 0, falsch: 0 };
  stats[f].richtig += richtig;
  stats[f].falsch += falsch;

  const frageId = questions[current].Frage;
  if (!frageFehlerCounter[frageId]) frageFehlerCounter[frageId] = 0;
  if (falsch > 0) frageFehlerCounter[frageId]++;

  // Richtige Antwort sicher als Array speichern
  const richtigeAntworten = Array.isArray(questions[current]["Richtige Antwort"]) 
    ? questions[current]["Richtige Antwort"] 
    : [questions[current]["Richtige Antwort"]];

  logFrageAntwort(questions[current], userAntworten, richtigeAntworten);

  localStorage.setItem("quizStats", JSON.stringify(stats));
  localStorage.setItem("frageFehlerCounter", JSON.stringify(frageFehlerCounter));

  nextQuestion();
}
window.checkAnswer = checkAnswer;
