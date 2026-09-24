
"use strict";

/*
 * AP TET PRACTICE — TEST SELECTION
 *
 * Reads test definitions from data/test-registry.js.
 * Loads a selected bank to display its actual question count.
 * Passes the selected track and test ID to exam.html.
 */

const params = new URLSearchParams(window.location.search);
const selectedTrack = params.get("track");

const registry = window.APTET_TEST_REGISTRY || {};
const track = registry[selectedTrack];

const trackTitle = document.getElementById("trackTitle");
const trackDescription = document.getElementById("trackDescription");
const trackIcon = document.getElementById("trackIcon");
const selectedSubject = document.getElementById("selectedSubject");
const selectedSubjectDescription =
  document.getElementById("selectedSubjectDescription");

const testGrid = document.getElementById("testGrid");
const testSelection = document.getElementById("testSelection");
const instructionsSection =
  document.getElementById("instructionsSection");
const invalidTrack = document.getElementById("invalidTrack");

const backToTests = document.getElementById("backToTests");
const instructionTitle = document.getElementById("instructionTitle");
const instructionDescription =
  document.getElementById("instructionDescription");
const instructionQuestions =
  document.getElementById("instructionQuestions");
const instructionMarks = document.getElementById("instructionMarks");
const instructionDuration = document.getElementById("instructionDuration");

const agreeCheckbox = document.getElementById("agreeCheckbox");
const startTestButton = document.getElementById("startTestButton");
const startMessage = document.getElementById("startMessage");

let selectedTest = null;
let selectedBankData = null;

if (!track) {
  testSelection.hidden = true;
  instructionsSection.hidden = true;
  invalidTrack.hidden = false;
} else {
  initializeTrack();
}

function initializeTrack() {
  trackTitle.textContent = track.title;
  trackDescription.textContent =
    "Choose a practice set to continue your preparation.";

  trackIcon.textContent = track.icon;
  selectedSubject.textContent = track.subject;
  selectedSubjectDescription.textContent = track.description;

  renderTestCards();
}

function renderTestCards() {
  testGrid.replaceChildren();

  const grouped = new Map();
  track.tests.forEach((test) => {
    const groupName = test.category || "Other Practice";
    if (!grouped.has(groupName)) grouped.set(groupName, []);
    grouped.get(groupName).push(test);
  });

  const entries = [...grouped.entries()].sort(([a], [b]) => {
    if (a === "Full-Length Mock Tests") return -1;
    if (b === "Full-Length Mock Tests") return 1;
    return a.localeCompare(b);
  });

  entries.forEach(([groupName, tests], index) => {
    const group = document.createElement("section");
    group.className = "practice-test-group";

    const heading = document.createElement("div");
    heading.className = "practice-section-heading";
    const headingText = document.createElement("div");
    const h2 = document.createElement("h2");
    h2.textContent = groupName === "Full-Length Mock Tests"
      ? "Full-Length Mock Tests"
      : `${groupName} — Subject-wise Practice`;
    const subtitle = document.createElement("p");
    subtitle.textContent = groupName === "Full-Length Mock Tests"
      ? "Open to choose a complete 150-question examination."
      : `Open to choose a ${groupName} practice batch.`;
    headingText.append(h2, subtitle);

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "practice-group-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = `Show ${tests.length} test${tests.length === 1 ? "" : "s"} ▾`;

    const cards = document.createElement("div");
    cards.className = "test-grid practice-group-cards";
    cards.hidden = true;

    tests.forEach((test) => {
      const card = document.createElement("article");
      card.className = "test-card" + (selectedTrack === "telugu" ? " telugu-theme" : "");

      const top = document.createElement("div");
      top.className = "test-card-top";
      const badge = document.createElement("span");
      badge.className = "test-badge";
      badge.textContent = test.badge;
      top.appendChild(badge);

      const title = document.createElement("h3");
      title.textContent = test.title;
      const description = document.createElement("p");
      description.textContent = groupName === "Full-Length Mock Tests"
        ? "Full examination simulation with section navigation and a final performance report."
        : `${test.category} practice questions from this question-bank batch.`;

      const meta = document.createElement("div");
      meta.className = "test-meta";
      ["Questions: Load on selection", "Marks: 1 per question", "Duration: Calculated from bank"].forEach((text) => {
        const item = document.createElement("span");
        item.textContent = text;
        meta.appendChild(item);
      });

      const button = document.createElement("button");
      button.type = "button";
      button.className = "button " + (selectedTrack === "telugu" ? "button-green" : "button-primary");
      button.textContent = "View Instructions →";
      button.addEventListener("click", () => showInstructions(test));
      card.append(top, title, description, meta, button);
      cards.appendChild(card);
    });

    toggle.addEventListener("click", () => {
      const opening = cards.hidden;
      cards.hidden = !opening;
      toggle.setAttribute("aria-expanded", String(opening));
      toggle.textContent = opening
        ? `Hide ${tests.length} test${tests.length === 1 ? "" : "s"} ▴`
        : `Show ${tests.length} test${tests.length === 1 ? "" : "s"} ▾`;
    });

    heading.append(headingText, toggle);
    group.append(heading, cards);
    testGrid.appendChild(group);
  });
}

async function showInstructions(test) {
  selectedTest = test;
  selectedBankData = null;

  testSelection.hidden = true;
  instructionsSection.hidden = false;

  agreeCheckbox.checked = false;
  startTestButton.disabled = true;
  startMessage.textContent = "Loading question bank…";

  instructionTitle.textContent = test.title;
  instructionDescription.textContent =
    selectedTrack === "telugu"
      ? "ఈ పరీక్షను ప్రారంభించే ముందు సూచనలను చదవండి."
      : "Read the instructions carefully before starting.";

  instructionQuestions.textContent = "Loading…";
  instructionMarks.textContent = "—";
  instructionDuration.textContent = "—";

  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    const response = await fetch(test.file, { cache: "no-cache" });

    if (!response.ok) {
      throw new Error(`Could not load ${test.file} (${response.status})`);
    }

    const bank = await response.json();
    const questions = getQuestions(bank);

    if (!questions.length) {
      throw new Error("This question bank does not contain any questions.");
    }

    selectedBankData = bank;

    const count = questions.length;
    const durationMinutes = Number(bank.durationMinutes) || count;

    instructionQuestions.textContent = String(count);
    instructionMarks.textContent = String(count);
    instructionDuration.textContent = `${durationMinutes} minutes`;

    startMessage.textContent =
      "Please accept the instructions to continue.";
  } catch (error) {
    console.error("Question-bank loading error:", error);

    instructionQuestions.textContent = "Unavailable";
    instructionMarks.textContent = "—";
    instructionDuration.textContent = "—";
    startMessage.textContent =
      "Unable to load this question bank. Check the file path and run the site through a local web server.";
  }
}

function getQuestions(bank) {
  if (!bank || !Array.isArray(bank.sections)) {
    return [];
  }

  return bank.sections.flatMap((section) =>
    Array.isArray(section.questions) ? section.questions : []
  );
}

agreeCheckbox.addEventListener("change", () => {
  const canStart = Boolean(agreeCheckbox.checked && selectedBankData);

  startTestButton.disabled = !canStart;
  startMessage.textContent = canStart
    ? "You may now proceed."
    : selectedBankData
      ? "Please accept the instructions to continue."
      : "The question bank must load successfully before starting.";
});

backToTests.addEventListener("click", () => {
  instructionsSection.hidden = true;
  testSelection.hidden = false;

  selectedTest = null;
  selectedBankData = null;

  window.scrollTo({ top: 0, behavior: "smooth" });
});

startTestButton.addEventListener("click", () => {
  if (!agreeCheckbox.checked || !selectedTest || !selectedBankData) {
    return;
  }

  const query = new URLSearchParams({
    track: selectedTrack,
    test: selectedTest.id
  });

  window.location.href = `exam.html?${query.toString()}`;
});