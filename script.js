// Unit Converter (km ↔ mi)
// Built like a mini data pipeline: input → validate → transform → present → log.

const KM_TO_MI = 0.621371;
const MI_TO_KM = 1.60934;
const HISTORY_LIMIT = 5;

// Elements
const form = document.getElementById("converterForm");
const valueInput = document.getElementById("valueInput");
const precisionSelect = document.getElementById("precisionSelect");

const resultPanel = document.getElementById("resultPanel");
const errorPanel = document.getElementById("errorPanel");
const errorText = document.getElementById("errorText");

const directionBadge = document.getElementById("directionBadge");
const timestampText = document.getElementById("timestampText");
const inputPretty = document.getElementById("inputPretty");
const outputPretty = document.getElementById("outputPretty");
const formulaText = document.getElementById("formulaText");

const historyBody = document.getElementById("historyBody");
const resetBtn = document.getElementById("resetBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// Utilities
function nowTimeLabel() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatNumber(n, decimals = 2) {
  return Number(n).toFixed(decimals);
}

function getDirection() {
  const selected = document.querySelector('input[name="direction"]:checked');
  return selected ? selected.value : "km-to-mi";
}

function getPrecision() {
  const p = Number(precisionSelect?.value ?? 2);
  return Number.isFinite(p) ? p : 2;
}

function normalizeNumericInput(raw) {
  // Allow common human typing: spaces and commas
  // "1,000.5" -> "1000.5"
  return raw.replaceAll(" ", "").replaceAll(",", "");
}

function parseAndValidate(raw) {
  const cleaned = normalizeNumericInput(raw);

  if (cleaned.length === 0) {
    return { ok: false, message: "Please enter a number to convert." };
  }

  if (cleaned === "." || cleaned === "-" || cleaned === "-.") {
    return { ok: false, message: "That doesn't look like a complete number yet." };
  }

  const value = Number(cleaned);

  if (!Number.isFinite(value)) {
    return { ok: false, message: "Enter a valid numeric value (example: 10 or 10.5)." };
  }

  return { ok: true, value };
}

function convert(value, direction) {
  if (direction === "km-to-mi") {
    return {
      inUnit: "km",
      outUnit: "mi",
      outValue: value * KM_TO_MI,
      badge: "km → mi",
      formula: "miles = kilometers × 0.621371",
    };
  }

  return {
    inUnit: "mi",
    outUnit: "km",
    outValue: value * MI_TO_KM,
    badge: "mi → km",
    formula: "kilometers = miles × 1.60934",
  };
}

function showError(message) {
  resultPanel.hidden = true;
  errorPanel.hidden = false;
  errorText.textContent = message;
}

function showResult({ inputValue, inUnit, outValue, outUnit, badge, formula, precision }) {
  errorPanel.hidden = true;
  resultPanel.hidden = false;

  directionBadge.textContent = badge;
  timestampText.textContent = `Updated ${nowTimeLabel()}`;

  inputPretty.textContent = `${formatNumber(inputValue, precision)} ${inUnit}`;
  outputPretty.textContent = `${formatNumber(outValue, precision)} ${outUnit}`;
  formulaText.textContent = `Formula: ${formula} (rounded to ${precision} decimals)`;
}

function makeHistoryRow(item) {
  const tr = document.createElement("tr");
  const p = Number.isFinite(item.precision) ? item.precision : 2;

  const tdTime = document.createElement("td");
  tdTime.textContent = item.time;

  const tdDir = document.createElement("td");
  tdDir.textContent = item.badge;

  const tdInput = document.createElement("td");
  tdInput.textContent = `${formatNumber(item.inputValue, p)} ${item.inUnit}`;

  const tdOutput = document.createElement("td");
  tdOutput.textContent = `${formatNumber(item.outValue, p)} ${item.outUnit}`;

  tr.appendChild(tdTime);
  tr.appendChild(tdDir);
  tr.appendChild(tdInput);
  tr.appendChild(tdOutput);

  return tr;
}

function renderHistory(history) {
  historyBody.innerHTML = "";

  if (history.length === 0) {
    const tr = document.createElement("tr");
    tr.className = "empty-row";
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "No conversions yet. Run one above 👆";
    tr.appendChild(td);
    historyBody.appendChild(tr);
    return;
  }

  history.forEach((item) => {
    historyBody.appendChild(makeHistoryRow(item));
  });
}

function loadHistory() {
  try {
    const raw = localStorage.getItem("conversionHistory");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem("conversionHistory", JSON.stringify(history));
}

function pushHistoryItem(item) {
  const history = loadHistory();
  const next = [item, ...history].slice(0, HISTORY_LIMIT);
  saveHistory(next);
  renderHistory(next);
}

function clearHistory() {
  saveHistory([]);
  renderHistory([]);
}

// Events
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const raw = valueInput.value;
  const parsed = parseAndValidate(raw);

  if (!parsed.ok) {
    showError(parsed.message);
    return;
  }

  const direction = getDirection();
  const precision = getPrecision();
  const result = convert(parsed.value, direction);

  showResult({
    inputValue: parsed.value,
    inUnit: result.inUnit,
    outValue: result.outValue,
    outUnit: result.outUnit,
    badge: result.badge,
    formula: result.formula,
    precision,
  });

  pushHistoryItem({
    time: nowTimeLabel(),
    badge: result.badge,
    inputValue: parsed.value,
    inUnit: result.inUnit,
    outValue: result.outValue,
    outUnit: result.outUnit,
    precision,
  });
});

resetBtn.addEventListener("click", () => {
  valueInput.value = "";
  valueInput.focus();
  resultPanel.hidden = true;
  errorPanel.hidden = true;
});

clearHistoryBtn.addEventListener("click", () => {
  clearHistory();
});

// Init
renderHistory(loadHistory());
valueInput.focus();
