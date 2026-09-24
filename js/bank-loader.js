
"use strict";

/*
 * AP TET — Selected Question Bank Adapter
 *
 * The existing exam engine requests one of its legacy fixed paths.
 * This adapter redirects that request to the question-bank file
 * selected through ?track=...&test=...
 *
 * It leaves all other fetch requests unchanged.
 */

(function () {
  const params = new URLSearchParams(window.location.search);

  const trackId = params.get("track");
  const testId = params.get("test");

  const registry = window.APTET_TEST_REGISTRY || {};
  const selectedTrack = registry[trackId];

  if (!selectedTrack || !testId) {
    console.warn(
      "Bank loader: track or test ID is missing or invalid."
    );
    return;
  }

  const selectedTest = selectedTrack.tests.find(
    (test) => test.id === testId
  );

  if (!selectedTest || !selectedTest.file) {
    console.error(
      "Bank loader: selected test was not found in the registry.",
      { trackId, testId }
    );
    return;
  }

  const originalFetch = window.fetch.bind(window);

  const legacyPaths = new Set([
    "data/paper2a-maths.json",
    "data/paper2a-telugu.json"
  ]);

  window.fetch = function (resource, options) {
    let requestedUrl = "";

    if (typeof resource === "string") {
      requestedUrl = resource;
    } else if (resource instanceof URL) {
      requestedUrl = resource.href;
    } else if (resource instanceof Request) {
      requestedUrl = resource.url;
    }

    const normalizedPath = requestedUrl
      .split("?")[0]
      .replace(/^\.?\//, "");

    if (legacyPaths.has(normalizedPath)) {
      console.info(
        `Bank loader: loading ${selectedTest.title}`,
        selectedTest.file
      );

      return originalFetch(selectedTest.file, options);
    }

    return originalFetch(resource, options);
  };

  console.info(
    "Bank loader initialized.",
    {
      track: trackId,
      test: testId,
      file: selectedTest.file
    }
  );
})();