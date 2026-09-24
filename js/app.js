
"use strict";

// Mobile menu toggle
const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const expanded =
      menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!expanded));
    navigation.classList.toggle("open", !expanded);
  });
}

// Keep top and bottom navigation links in sync.
const navLinks = document.querySelectorAll(".nav-link, .bottom-link");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(item => item.classList.remove("active"));

    document.querySelectorAll(
      `[href="${link.getAttribute("href")}"]`
    ).forEach(item => item.classList.add("active"));

    if (navigation) navigation.classList.remove("open");

    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
});

// Subject cards choose the matching Paper-II A practice track.
document.querySelectorAll(".subject-button[data-track]").forEach(button => {
  button.addEventListener("click", () => {
    const track = button.dataset.track;

    if (track !== "maths" && track !== "telugu") return;

    try {
      sessionStorage.setItem("selectedTrack", track);
    } catch (_) {}

    window.location.href =
      `practice.html?track=${encodeURIComponent(track)}`;
  });
});

// Register offline app-shell caching.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js");

      console.info("Offline support registered.");
    } catch (error) {
      console.warn("Service worker registration failed:", error);
    }
  });
}

// Display completed attempts from this browser's local history.
function renderLearningProgress() {
  const summary = document.getElementById("progressSummary");
  const empty = document.getElementById("progressEmpty");
  const historyContainer = document.getElementById("progressHistory");
  const historyDetails = document.getElementById("progressHistoryDetails");
  const historyCount = document.getElementById("progressHistoryCount");
  if (!summary || !empty || !historyContainer || !historyDetails || !historyCount || typeof ExamStorage === "undefined") return;

  const history = ExamStorage.getHistory()
    .filter(item => item && Number(item.total) > 0)
    .sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));

  summary.replaceChildren();
  historyContainer.replaceChildren();
  empty.hidden = history.length > 0;
  historyDetails.hidden = history.length === 0;
  historyCount.textContent = String(history.length);
  if (!history.length) return;

  const average = history.reduce((sum, item) =>
    sum + (Number(item.percentage) || 0), 0) / history.length;
  const best = Math.max(...history.map(item => Number(item.percentage) || 0));

  [
    ["Tests completed", String(history.length)],
    ["Average accuracy", `${average.toFixed(1)}%`],
    ["Best accuracy", `${best.toFixed(1)}%`]
  ].forEach(([label, value]) => {
    const card = document.createElement("article");
    card.className = "stat-card";
    const strong = document.createElement("strong");
    strong.textContent = value;
    const caption = document.createElement("span");
    caption.textContent = label;
    card.append(strong, caption);
    summary.appendChild(card);
  });

  history.forEach(item => {
    const card = document.createElement("article");
    card.className = "test-card";
    const title = document.createElement("h3");
    title.textContent = item.testTitle || (item.testId || "Completed test").replaceAll("-", " ");
    const track = document.createElement("p");
    track.textContent = item.track === "telugu" ? "Telugu Paper-II A" : "Mathematics & Science Paper-II A";
    const score = document.createElement("p");
    score.textContent = `Score: ${Number(item.score) || 0} / ${Number(item.total) || 0} · ${(Number(item.percentage) || 0).toFixed(1)}%`;
    const date = document.createElement("p");
    const parsed = new Date(item.completedAt);
    date.textContent = Number.isNaN(parsed.getTime()) ? "Completion date unavailable" : `Completed: ${parsed.toLocaleString()}`;
    card.append(title, track, score, date);
    historyContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderLearningProgress);
