
"use strict";

const ExamStorage = (() => {
  const PREFIX = "apTetPractice";
  const VERSION = 1;

  function attemptKey(track, testId) {
    return `${PREFIX}:attempt:${track}:${testId}`;
  }

  function historyKey() {
    return `${PREFIX}:history`;
  }

  // Save the complete state of an active attempt.
  function saveAttempt(track, testId, state) {
    const record = {
      version: VERSION,
      track,
      testId,
      updatedAt: new Date().toISOString(),
      ...state
    };

    try {
      localStorage.setItem(
        attemptKey(track, testId),
        JSON.stringify(record)
      );

      return true;
    } catch (error) {
      console.error("Could not save exam progress:", error);
      return false;
    }
  }

  // Retrieve an existing attempt.
  function loadAttempt(track, testId) {
    try {
      const raw = localStorage.getItem(
        attemptKey(track, testId)
      );

      if (!raw) return null;

      const record = JSON.parse(raw);

      if (
        record.version !== VERSION ||
        record.track !== track ||
        record.testId !== testId
      ) {
        return null;
      }

      return record;
    } catch (error) {
      console.error("Could not restore exam progress:", error);
      return null;
    }
  }

  // Remove an active attempt when completed.
  function removeAttempt(track, testId) {
    try {
      localStorage.removeItem(attemptKey(track, testId));
    } catch (error) {
      console.error("Could not remove exam progress:", error);
    }
  }

  // Save completed test results in local history.
  function saveHistory(summary) {
    try {
      const history = JSON.parse(
        localStorage.getItem(historyKey()) || "[]"
      );

      history.push(summary);

      localStorage.setItem(
        historyKey(),
        JSON.stringify(history)
      );

      return true;
    } catch (error) {
      console.error("Could not save attempt history:", error);
      return false;
    }
  }

  // Return completed-test history.
  function getHistory() {
    try {
      return JSON.parse(
        localStorage.getItem(historyKey()) || "[]"
      );
    } catch (error) {
      console.error("Could not read attempt history:", error);
      return [];
    }
  }

  return {
    saveAttempt,
    loadAttempt,
    removeAttempt,
    saveHistory,
    getHistory
  };
})();