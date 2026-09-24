console.log("PRATAP DEBUG: UPDATED EXAM ENGINE LOADED");
"use strict";

// ==========================================
// AP TET CBT ENGINE
// ==========================================

const params = new URLSearchParams(window.location.search);

const trackId = params.get("track");
const testId = params.get("test");

const TEST_REGISTRY = window.APTET_TEST_REGISTRY || {};

function getSelectedTestDefinition() {
  const selectedTrack = TEST_REGISTRY[trackId];
  if (!selectedTrack || !Array.isArray(selectedTrack.tests)) return null;
  return selectedTrack.tests.find((test) => test.id === testId) || null;
}

const PASS_MARKS = {
  OC_EWS: 90,
  BC: 75,
  SC_ST_PWBD_EXSERVICEMEN: 60
};

// ==========================================
// ELEMENTS
// ==========================================

const $ = (id) => document.getElementById(id);

const loadingMessage = $("loadingMessage");
const errorMessage = $("errorMessage");
const examInterface = $("examInterface");

const examTitle = $("examTitle");
const examSubtitle = $("examSubtitle");
const examTrackLabel = $("examTrackLabel");

const examTimer = $("examTimer");
const pauseButton = $("pauseButton");

const sectionTabs = $("sectionTabs");
const progressFill = $("progressFill");
const overallProgress = $("overallProgress");

const sectionLabel = $("sectionLabel");
const questionCounter = $("questionCounter");
const questionText = $("questionText");
const optionsContainer = $("optionsContainer");

const feedbackPanel = $("feedbackPanel");
const feedbackStatus = $("feedbackStatus");
const correctAnswerText = $("correctAnswerText");
const explanationHeading = $("explanationHeading");
const explanationText = $("explanationText");

const previousButton = $("previousButton");
const submitButton = $("submitButton");
const nextButton = $("nextButton");

const questionMessage = $("questionMessage");

const questionPalette = $("questionPalette");
const sidebarAnswered = $("sidebarAnswered");
const sidebarRemaining = $("sidebarRemaining");

const finishSectionButton = $("finishSectionButton");

const sectionResult = $("sectionResult");
const sectionResultTitle = $("sectionResultTitle");
const sectionResultDescription = $("sectionResultDescription");
const sectionScore = $("sectionScore");
const sectionCorrect = $("sectionCorrect");
const sectionIncorrect = $("sectionIncorrect");
const sectionUnanswered = $("sectionUnanswered");
const continueSectionButton = $("continueSectionButton");

const finalResult = $("finalResult");
const finalScore = $("finalScore");
const finalPercentage = $("finalPercentage");
const finalCorrect = $("finalCorrect");
const finalIncorrect = $("finalIncorrect");
const finalUnanswered = $("finalUnanswered");
const finalTimeUsed = $("finalTimeUsed");
const finalSectionResults = $("finalSectionResults");
const answerReview = $("answerReview");

// ==========================================
// STATE
// ==========================================

let exam = null;

let currentSectionIndex = 0;
let currentQuestionIndex = 0;

let selectedAnswers = {};
let submittedAnswers = {};
let completedSections = new Set();

let remainingSeconds = 150 * 60;
let timerHandle = null;
let examStartedAt = null;
let examFinished = false;

let isPaused = false;
let attemptStarted = false;
let pauseReason = "";

let pauseOverlay = null;
let lastSavedAt = 0;

// ==========================================
// INITIALIZATION
// ==========================================

initialize();

async function initialize() {
  const testDefinition = getSelectedTestDefinition();

  if (!trackId || !testDefinition || !testDefinition.file) {
    showError("Invalid test link. Please select a test again.");
    return;
  }

  try {
    const response = await fetch(testDefinition.file);

    if (!response.ok) {
      throw new Error("Question bank could not be loaded.");
    }

    const data = await response.json();

    console.log("=== EXAM CONFIGURATION DEBUG ===");
console.log("URL trackId:", trackId);
console.log("URL testId:", testId);
console.log("Loaded JSON track:", data.track);
console.log("Loaded JSON testId:", data.testId);
console.log("Loaded JSON title:", data.title);
console.log("================================");

if (data.track !== trackId || data.testId !== testId) {
  throw new Error(
    `Test configuration mismatch. ` +
    `Expected track="${trackId}", testId="${testId}". ` +
    `Received track="${data.track}", testId="${data.testId}".`
  );
}

    validateExamData(data);

    exam = data;
    remainingSeconds = exam.durationMinutes * 60;

    examTitle.textContent = exam.title;

    examSubtitle.textContent =
      `${exam.sections.length} sections · ` +
      `${getTotalQuestions()} questions · ` +
      `${exam.durationMinutes} minutes`;

    examTrackLabel.textContent =
      trackId === "telugu"
        ? "PAPER-II A · TELUGU"
        : "PAPER-II A · MATHEMATICS & SCIENCE";

    loadingMessage.hidden = true;
    examInterface.hidden = false;

    createPauseOverlay();

    const savedRecord = ExamStorage.loadAttempt(trackId, testId);

    if (savedRecord && !savedRecord.examFinished) {
      const resume = window.confirm(
        "A saved attempt was found.\n\n" +
        "Would you like to resume from where you stopped?"
      );

      if (resume) {
        restoreProgress(savedRecord);
        validateRestoredProgress();

        attemptStarted = true;

        renderSectionTabs();
        renderCurrentQuestion();
        updateProgress();
        updateTimerDisplay();

        showPauseOverlay("manual");

        return;
      }
    }

    // Start a fresh attempt.
    selectedAnswers = {};
    submittedAnswers = {};
    completedSections = new Set();

    currentSectionIndex = 0;
    currentQuestionIndex = 0;

    remainingSeconds = exam.durationMinutes * 60;

    isPaused = false;
    examFinished = false;
    attemptStarted = true;

    examStartedAt = Date.now();

    renderSectionTabs();
    renderCurrentQuestion();
    updateProgress();

    startTimer();
    persistProgress();

  } catch (error) {
  console.error("Exam initialization failed:", error);

  showError(
    "Unable to load the examination.\n" +
    "Reason: " + (error?.message || String(error))
  );
  }
}

// ==========================================
// DATA VALIDATION
// ==========================================

function validateExamData(data) {
  if (
    !Array.isArray(data.sections) ||
    data.sections.length === 0
  ) {
    throw new Error("The test has no sections.");
  }

  if (
    !Number.isFinite(data.durationMinutes) ||
    data.durationMinutes <= 0
  ) {
    throw new Error("Invalid examination duration.");
  }

  const ids = new Set();

  data.sections.forEach((section) => {
    if (
      !Array.isArray(section.questions) ||
      section.questions.length === 0
    ) {
      throw new Error(`Section ${section.id} has no questions.`);
    }

    section.questions.forEach((question) => {
      if (!question.id || ids.has(question.id)) {
        throw new Error("Question IDs must be unique.");
      }

      ids.add(question.id);

      if (
        !question.question ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        !Number.isInteger(question.correctIndex) ||
        question.correctIndex < 0 ||
        question.correctIndex > 3 ||
        !question.explanation
      ) {
        throw new Error(`Invalid question data: ${question.id}`);
      }
    });
  });
}

function showError(message) {
  loadingMessage.hidden = true;
  examInterface.hidden = true;
  errorMessage.hidden = false;
  errorMessage.textContent = message;
}

// ==========================================
// HELPERS
// ==========================================

function getCurrentSection() {
  return exam.sections[currentSectionIndex];
}

function getCurrentQuestion() {
  return getCurrentSection().questions[currentQuestionIndex];
}

function getQuestionKey(question) {
  return question.id;
}

function getTotalQuestions() {
  return exam.sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );
}

function getSectionAnsweredCount(section) {
  return section.questions.filter(
    (question) => submittedAnswers[question.id] !== undefined
  ).length;
}

function getSectionScore(section) {
  return section.questions.reduce((score, question) => {
    return score +
      (submittedAnswers[question.id] === question.correctIndex ? 1 : 0);
  }, 0);
}

function getAllQuestions() {
  return exam.sections.flatMap((section) =>
    section.questions.map((question) => ({
      ...question,
      sectionId: section.id,
      sectionTitle: section.title
    }))
  );
}

// ==========================================
// SECTION TABS
// ==========================================

function renderSectionTabs() {
  sectionTabs.replaceChildren();

  exam.sections.forEach((section, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "section-tab";
    button.textContent = `${index + 1}. ${section.title}`;

    if (index === currentSectionIndex) {
      button.classList.add("active");
    }

    if (completedSections.has(index)) {
      button.classList.add("completed");
    }

    button.disabled =
      isPaused ||
      (index > currentSectionIndex && !completedSections.has(index));

    button.addEventListener("click", () => {
      if (button.disabled || examFinished || isPaused) return;

      currentSectionIndex = index;
      currentQuestionIndex = 0;

      persistProgress();

      renderSectionTabs();
      renderCurrentQuestion();
      updateProgress();
    });

    sectionTabs.appendChild(button);
  });
}

// ==========================================
// QUESTION RENDERING
// ==========================================

function renderCurrentQuestion() {
  // Do not return merely because isPaused is true.
  // We need to render the saved question behind the pause overlay.
  if (examFinished) return;

  const section = getCurrentSection();
  const question = getCurrentQuestion();

  const key = getQuestionKey(question);
  const isSubmitted = submittedAnswers[key] !== undefined;

  sectionLabel.textContent = section.title;

  questionCounter.textContent =
    `Question ${currentQuestionIndex + 1} of ${section.questions.length}`;

  questionText.textContent = question.question;

  optionsContainer.replaceChildren();

  question.options.forEach((option, index) => {
    const label = document.createElement("label");

    label.className = "answer-option";

    if (selectedAnswers[key] === index) {
      label.classList.add("selected");
    }

    if (isSubmitted) {
      label.classList.add("locked");

      if (index === question.correctIndex) {
        label.classList.add("correct");
      } else if (index === submittedAnswers[key]) {
        label.classList.add("wrong");
      }
    }

    const input = document.createElement("input");

    input.type = "radio";
    input.name = `answer-${key}`;
    input.value = String(index);
    input.checked = selectedAnswers[key] === index;

    input.disabled = isSubmitted || isPaused;

    input.addEventListener("change", () => {
      if (submittedAnswers[key] !== undefined) return;
      if (isPaused || examFinished) return;

      selectedAnswers[key] = index;

      persistProgress();

      renderCurrentQuestion();
      updateProgress();
    });

    const text = document.createElement("span");
    text.className = "option-text";
    text.textContent = `${String.fromCharCode(65 + index)}. ${option}`;

    label.append(input, text);
    optionsContainer.appendChild(label);
  });

  // Full-length mocks hide correctness and explanations until final submission.
  // Individual subject practice continues to show feedback immediately.
  if (isSubmitted && exam.reviewMode !== "after-test") {
    showFeedback(question, submittedAnswers[key]);
  } else {
    feedbackPanel.hidden = true;
  }

  submitButton.disabled =
    isSubmitted ||
    selectedAnswers[key] === undefined ||
    isPaused;

  submitButton.hidden = isSubmitted;

  previousButton.disabled =
    currentQuestionIndex === 0 || isPaused;

  nextButton.disabled = isPaused;
  finishSectionButton.disabled = isPaused;

  nextButton.textContent =
    currentQuestionIndex === section.questions.length - 1
      ? "Section End →"
      : "Next →";

  questionMessage.textContent = isSubmitted
    ? (exam.reviewMode === "after-test"
        ? "Answer recorded. This question is locked; feedback appears after the test."
        : "Answer submitted. This question is locked for this attempt.")
    : "Select an option and submit your answer.";

  renderQuestionPalette();
  updateSidebarCounts();
}

// ==========================================
// SUBMIT ANSWER
// ==========================================

submitButton.addEventListener("click", () => {
  if (examFinished || isPaused) return;

  const question = getCurrentQuestion();
  const key = getQuestionKey(question);

  // Only one submission per question.
  if (submittedAnswers[key] !== undefined) {
    return;
  }

  const answer = selectedAnswers[key];

  if (!Number.isInteger(answer)) {
    questionMessage.textContent =
      "Please select an option before submitting.";
    return;
  }

  submittedAnswers[key] = answer;

  // Save immediately after submission.
  persistProgress();

  renderCurrentQuestion();
  updateProgress();
});

// ==========================================
// FEEDBACK & EXPLANATION
// ==========================================

function showFeedback(question, answerIndex) {
  const isCorrect = answerIndex === question.correctIndex;

  feedbackPanel.hidden = false;

  feedbackStatus.className =
    "feedback-status " +
    (isCorrect ? "correct-status" : "wrong-status");

  feedbackStatus.textContent = isCorrect
    ? "✓ Correct answer!"
    : "✗ Incorrect answer";

  correctAnswerText.textContent =
    `${String.fromCharCode(65 + question.correctIndex)}. ` +
    question.options[question.correctIndex];

  explanationHeading.textContent =
    question.explanationLanguage === "te"
      ? "వివరణ"
      : "Explanation";

  explanationText.textContent = question.explanation;
}

// ==========================================
// NAVIGATION
// ==========================================

previousButton.addEventListener("click", () => {
  if (
    examFinished ||
    isPaused ||
    currentQuestionIndex === 0
  ) {
    return;
  }

  currentQuestionIndex--;

  persistProgress();

  renderCurrentQuestion();
  updateProgress();
});

nextButton.addEventListener("click", () => {
  if (examFinished || isPaused) return;

  const section = getCurrentSection();

  if (currentQuestionIndex < section.questions.length - 1) {
    currentQuestionIndex++;

    persistProgress();

    renderCurrentQuestion();
    updateProgress();

    return;
  }

  questionMessage.textContent =
    "You have reached the end of this section. " +
    "Use Finish Section when you are ready.";
});

// ==========================================
// QUESTION PALETTE
// ==========================================

function renderQuestionPalette() {
  const section = getCurrentSection();

  questionPalette.replaceChildren();

  section.questions.forEach((question, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "palette-button";
    button.textContent = String(index + 1);

    const isSubmitted =
      submittedAnswers[question.id] !== undefined;

    if (isSubmitted) {
      button.classList.add("answered");
    }

    if (index === currentQuestionIndex) {
      button.classList.add("current");
    }

    button.disabled = isPaused;

    button.setAttribute(
      "aria-label",
      `Question ${index + 1}` +
      (isSubmitted ? ", answered and locked" : ", unanswered")
    );

    button.addEventListener("click", () => {
      if (examFinished || isPaused) return;

      currentQuestionIndex = index;

      persistProgress();

      renderCurrentQuestion();
      updateProgress();
    });

    questionPalette.appendChild(button);
  });
}

// ==========================================
// PROGRESS & COUNTS
// ==========================================

function updateProgress() {
  const total = getTotalQuestions();

  const answered = Object.keys(submittedAnswers).length;

  overallProgress.textContent = `${answered} / ${total}`;

  progressFill.style.width =
    `${total === 0 ? 0 : (answered / total) * 100}%`;

  updateSidebarCounts();
}

function updateSidebarCounts() {
  const section = getCurrentSection();

  const answered = getSectionAnsweredCount(section);

  sidebarAnswered.textContent = String(answered);

  sidebarRemaining.textContent =
    String(section.questions.length - answered);
}

// ==========================================
// SECTION COMPLETION
// ==========================================

finishSectionButton.addEventListener("click", () => {
  if (examFinished || isPaused) return;

  const section = getCurrentSection();

  const answered = getSectionAnsweredCount(section);
  const unanswered = section.questions.length - answered;

  if (unanswered > 0) {
    const proceed = window.confirm(
      `You have ${unanswered} unanswered question(s). ` +
      "Finish this section without answering them?"
    );

    if (!proceed) return;
  }

  completedSections.add(currentSectionIndex);

  persistProgress();

  showSectionResult();
});

function showSectionResult() {
  const section = getCurrentSection();

  const score = getSectionScore(section);
  const answered = getSectionAnsweredCount(section);

  const correct = score;
  const incorrect = answered - correct;
  const unanswered = section.questions.length - answered;

  examInterface.hidden = true;
  sectionResult.hidden = false;

  sectionResultTitle.textContent = section.title;

  sectionResultDescription.textContent =
    "Your section result is calculated from submitted answers.";

  sectionScore.textContent =
    `${score} / ${section.questions.length}`;

  sectionCorrect.textContent = String(correct);
  sectionIncorrect.textContent = String(incorrect);
  sectionUnanswered.textContent = String(unanswered);

  const isLastSection =
    currentSectionIndex === exam.sections.length - 1;

  continueSectionButton.textContent = isLastSection
    ? "View Final Scorecard →"
    : "Continue to Next Section →";
}

continueSectionButton.addEventListener("click", () => {
  if (examFinished || isPaused) return;

  sectionResult.hidden = true;

  const isLastSection =
    currentSectionIndex === exam.sections.length - 1;

  if (isLastSection) {
    finishExam();
    return;
  }

  currentSectionIndex++;
  currentQuestionIndex = 0;

  persistProgress();

  examInterface.hidden = false;

  renderSectionTabs();
  renderCurrentQuestion();
  updateProgress();
});

// ==========================================
// TIMER
// ==========================================

function startTimer() {
  if (timerHandle !== null || isPaused || examFinished) return;

  updateTimerDisplay();

  timerHandle = window.setInterval(() => {
    if (isPaused || examFinished) return;

    remainingSeconds = Math.max(0, remainingSeconds - 1);

    updateTimerDisplay();

    // Save timer and attempt state periodically.
    persistProgress();

    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      finishExam(true);
    }
  }, 1000);
}

function stopTimer() {
  if (timerHandle !== null) {
    window.clearInterval(timerHandle);
    timerHandle = null;
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  examTimer.textContent =
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;

  examTimer.setAttribute(
    "aria-label",
    `${minutes} minutes and ${seconds} seconds remaining`
  );
}

// ==========================================
// PAUSE & RESUME
// ==========================================

function createPauseOverlay() {
  if (pauseOverlay) return;

  pauseOverlay = document.createElement("div");
  pauseOverlay.className = "pause-overlay";
  pauseOverlay.hidden = true;

  const card = document.createElement("div");
  card.className = "pause-card";

  const heading = document.createElement("h2");
  heading.textContent = "Test Paused";

  const message = document.createElement("p");
  message.id = "pauseMessage";

  message.textContent =
    "Your progress has been saved. The timer is paused.";

  const resumeButton = document.createElement("button");

  resumeButton.type = "button";
  resumeButton.className = "button button-primary";
  resumeButton.textContent = "Resume Test";

  resumeButton.addEventListener("click", () => {
    resumeExam();
  });

  card.append(heading, message, resumeButton);

  pauseOverlay.appendChild(card);
  document.body.appendChild(pauseOverlay);
}

function showPauseOverlay(reason = "manual") {
  createPauseOverlay();

  pauseReason = reason;

  const message = $("pauseMessage");

  if (reason === "hidden") {
    message.textContent =
      "The page is no longer visible. Your timer has been paused. " +
      "Return to this page and select Resume Test when you're ready.";
  } else {
    message.textContent =
      "Your progress has been saved. The timer is paused. " +
      "Resume whenever you're ready.";
  }

  pauseOverlay.hidden = false;
}

function hidePauseOverlay() {
  if (pauseOverlay) {
    pauseOverlay.hidden = true;
  }
}

function pauseExam(reason = "manual") {
  if (examFinished || !attemptStarted || isPaused) return;

  isPaused = true;

  stopTimer();

  persistProgress();

  pauseButton.textContent = "Resume Test";

  renderSectionTabs();
  renderCurrentQuestion();

  showPauseOverlay(reason);
}

function resumeExam() {
  if (examFinished || !attemptStarted) return;

  isPaused = false;

  hidePauseOverlay();

  pauseButton.textContent = "Pause Test";

  renderSectionTabs();
  renderCurrentQuestion();

  startTimer();

  persistProgress();
}

pauseButton.addEventListener("click", () => {
  if (isPaused) {
    resumeExam();
  } else {
    pauseExam("manual");
  }
});

// Automatically pause when the page becomes hidden.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseExam("hidden");
  }
});

// Save the latest state when the page is about to leave.
window.addEventListener("pagehide", () => {
  persistProgress();
});

// ==========================================
// PERSISTENCE / RESTORE
// ==========================================

function createAttemptSnapshot() {
  return {
    selectedAnswers,
    submittedAnswers,
    currentSectionIndex,
    currentQuestionIndex,
    completedSections: [...completedSections],
    remainingSeconds,
    isPaused,
    examFinished
  };
}

function persistProgress() {
  if (!exam || examFinished || !attemptStarted) return;

  const now = Date.now();

  // Avoid excessive writes during repeated calls.
  if (now - lastSavedAt < 500 && !isPaused) return;

  const saved = ExamStorage.saveAttempt(
    trackId,
    testId,
    createAttemptSnapshot()
  );

  if (saved) {
    lastSavedAt = now;
  }
}

function restoreProgress(record) {
  if (!record) return false;

  selectedAnswers = record.selectedAnswers || {};
  submittedAnswers = record.submittedAnswers || {};

  currentSectionIndex = Number.isInteger(record.currentSectionIndex)
    ? record.currentSectionIndex
    : 0;

  currentQuestionIndex = Number.isInteger(record.currentQuestionIndex)
    ? record.currentQuestionIndex
    : 0;

  completedSections = new Set(record.completedSections || []);

  remainingSeconds = Number.isFinite(record.remainingSeconds)
    ? Math.max(0, record.remainingSeconds)
    : exam.durationMinutes * 60;

  // Restore unfinished attempts as paused.
  isPaused = true;
  examFinished = false;

  return true;
}

function validateRestoredProgress() {
  if (
    currentSectionIndex < 0 ||
    currentSectionIndex >= exam.sections.length
  ) {
    currentSectionIndex = 0;
  }

  const section = getCurrentSection();

  if (
    currentQuestionIndex < 0 ||
    currentQuestionIndex >= section.questions.length
  ) {
    currentQuestionIndex = 0;
  }

  const validIds = new Set(
    getAllQuestions().map(question => question.id)
  );

  for (const key of Object.keys(selectedAnswers)) {
    if (!validIds.has(key)) {
      delete selectedAnswers[key];
    }
  }

  for (const key of Object.keys(submittedAnswers)) {
    if (!validIds.has(key)) {
      delete submittedAnswers[key];
    }
  }
}

// ==========================================
// FINAL SCORE & REPORT
// ==========================================

function finishExam(timeExpired = false) {
  if (examFinished) return;

  examFinished = true;
  isPaused = true;

  stopTimer();
  hidePauseOverlay();

  examInterface.hidden = true;
  sectionResult.hidden = true;
  finalResult.hidden = false;

  const allQuestions = getAllQuestions();
  const total = allQuestions.length;

  const answered = allQuestions.filter(
    question => submittedAnswers[question.id] !== undefined
  );

  const correct = answered.filter(
    question =>
      submittedAnswers[question.id] === question.correctIndex
  ).length;

  const incorrect = answered.length - correct;
  const unanswered = total - answered.length;

  const percentage =
    total === 0 ? 0 : (correct / total) * 100;

  finalScore.textContent = `${correct} / ${total}`;
  finalPercentage.textContent = `${percentage.toFixed(1)}%`;

  finalCorrect.textContent = String(correct);
  finalIncorrect.textContent = String(incorrect);
  finalUnanswered.textContent = String(unanswered);

  const elapsedSeconds = Math.max(
    0,
    exam.durationMinutes * 60 - remainingSeconds
  );

  const usedMinutes = Math.floor(elapsedSeconds / 60);
  const usedSeconds = elapsedSeconds % 60;

  finalTimeUsed.textContent =
    `${usedMinutes}m ${usedSeconds}s`;

  $("finalResultDescription").textContent = timeExpired
    ? "The timer expired. Your submitted answers have been scored."
    : "You have completed the practice test.";

  renderFinalSectionResults();
  renderAnswerReview();

  // Archive the completed result and remove the active attempt.
  ExamStorage.removeAttempt(trackId, testId);

  ExamStorage.saveHistory({
    track: trackId,
    testId,
    testTitle: exam.title,
    score: correct,
    total,
    percentage,
    correct,
    incorrect,
    unanswered,
    timeUsedSeconds: elapsedSeconds,
    completedAt: new Date().toISOString()
  });
}

function renderFinalSectionResults() {
  finalSectionResults.replaceChildren();

  exam.sections.forEach(section => {
    const score = getSectionScore(section);
    const answered = getSectionAnsweredCount(section);

    const incorrect = answered - score;
    const unanswered = section.questions.length - answered;

    const card = document.createElement("article");
    card.className = "section-result-item";

    const title = document.createElement("h3");
    title.textContent = section.title;

    const details = document.createElement("p");

    details.textContent =
      `Score: ${score}/${section.questions.length} · ` +
      `Correct: ${score} · Incorrect: ${incorrect} · ` +
      `Unanswered: ${unanswered}`;

    card.append(title, details);

    finalSectionResults.appendChild(card);
  });
}

function renderAnswerReview() {
  answerReview.replaceChildren();

  getAllQuestions().forEach((question, index) => {
    const submitted = submittedAnswers[question.id];

    const card = document.createElement("article");
    card.className = "review-item";

    const title = document.createElement("h3");

    title.textContent =
      `${index + 1}. ${question.sectionTitle}`;

    const prompt = document.createElement("p");
    prompt.textContent = question.question;

    const result = document.createElement("p");

    if (submitted === undefined) {
      result.className = "review-wrong";
      result.textContent = "Unanswered";
    } else if (submitted === question.correctIndex) {
      result.className = "review-correct";
      result.textContent = "Correct";
    } else {
      result.className = "review-wrong";
      result.textContent = "Incorrect";
    }

    const correct = document.createElement("p");

    correct.textContent =
      `Correct answer: ${String.fromCharCode(65 + question.correctIndex)}. ` +
      question.options[question.correctIndex];

    const explanationTitle = document.createElement("strong");

    explanationTitle.textContent =
      question.explanationLanguage === "te"
        ? "వివరణ:"
        : "Explanation:";

    const explanation = document.createElement("p");
    explanation.textContent = question.explanation;

    card.append(
      title,
      prompt,
      result,
      correct,
      explanationTitle,
      explanation
    );

    answerReview.appendChild(card);
  });
}