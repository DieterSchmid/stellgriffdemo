
function renderQuestions() {
  const form = document.getElementById('questionnaire');
  questions.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `<p>${i + 1}. ${q.text}</p>`;
    q.options.forEach((opt, j) => {
      div.innerHTML += `<label><input type="radio" name="${q.id}" value="${j + 1}" data-field="${opt.field}"> ${opt.text}</label><br>`;
    });
    form.appendChild(div);
  });
}

function calculateResults() {
  const results = { denken: 0, emotion: 0, handlung: 0, kommunikation: 0 };
  document.querySelectorAll('input[type=radio]:checked').forEach(input => {
    const field = input.dataset.field;
    const value = parseInt(input.value);
    results[field] += value;
  });

  const ctx = document.getElementById('resultChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(results),
      datasets: [{ label: 'Punkte', data: Object.values(results) }]
    }
  });

  renderSummary(results);
  window.pdfData = { results };
}

function renderSummary(results) {
  const summaryDiv = document.getElementById('evaluationText');
  summaryDiv.innerHTML = "<h2>Persönliches Stärkenprofil</h2>";

  for (const [key, val] of Object.entries(results)) {
    const prozent = Math.round((val / 50) * 100);
    const tmpl = summaryTemplate[key];
    summaryDiv.innerHTML += `
      <h3>${tmpl.name}: ${prozent}%</h3>
      <p><strong>Interpretation:</strong> ${tmpl.interpretation}</p>
      <p><strong>Geeignete Einsatzfelder:</strong><br>• ${tmpl.einsatzfelder.join("<br>• ")}</p>
      <p><strong>Was du brauchst:</strong><br>• ${tmpl.mustHaves.join("<br>• ")}</p>
      <p><strong>No-Goes für dich:</strong><br>• ${tmpl.noGoes.join("<br>• ")}</p>
      <hr>
    `;
  }
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Stellgriff-Profil Analyse", 10, 10);
  let y = 20;
  for (const [key, val] of Object.entries(window.pdfData.results)) {
    doc.text(`${key}: ${val} Punkte`, 10, y);
    y += 10;
  }
  doc.save("auswertung.pdf");
}

window.onload = renderQuestions;
