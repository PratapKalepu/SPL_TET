
"use strict";

/*
 * AP Special TET — Test Registry
 *
 * Each entry maps a selectable practice test to a question-bank JSON file.
 * The paths are relative to the project root.
 *
 * This registry lists individual bank batches as practice tests.
 * Full-length mixed-subject mocks will be assembled separately.
 */

window.APTET_TEST_REGISTRY = {
  maths: {
    title: "Mathematics & Science Practice",
    icon: "➗",
    subject: "Mathematics & Science",
    description:
      "Practice Child Development and Pedagogy, English, Mathematics, " +
      "Physical Science and Biological Science.",
        tests: [
      {
        id: "maths-telugu-full-mock-01",
        title: "Full-Length Mock Test 01 — Maths & Science (Telugu L1)",
        category: "Full-Length Mock Tests",
        file: "data/mocks/maths-telugu-full-mock-01.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "maths-telugu-full-mock-02",
        title: "Full-Length Mock Test 02 — Maths & Science (Telugu L1)",
        category: "Full-Length Mock Tests",
        file: "data/mocks/maths-telugu-full-mock-02.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "maths-telugu-full-mock-03",
        title: "Full-Length Mock Test 03 — Maths & Science (Telugu L1)",
        category: "Full-Length Mock Tests",
        file: "data/mocks/maths-telugu-full-mock-03.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "maths-telugu-full-mock-04",
        title: "Full-Length Mock Test 04 — Maths & Science (Telugu L1)",
        category: "Full-Length Mock Tests",
        file: "data/mocks/maths-telugu-full-mock-04.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "maths-telugu-full-mock-05",
        title: "Full-Length Mock Test 05 — Maths & Science (Telugu L1)",
        category: "Full-Length Mock Tests",
        file: "data/mocks/maths-telugu-full-mock-05.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "maths-telugu-full-mock-06",
        title: "Full-Length Mock Test 06 — Maths & Science (Telugu L1)",
        category: "Full-Length Mock Tests",
        file: "data/mocks/maths-telugu-full-mock-06.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "maths-telugu-full-mock-07",
        title: "Full-Length Mock Test 07 — Maths & Science (Telugu L1)",
        category: "Full-Length Mock Tests",
        file: "data/mocks/maths-telugu-full-mock-07.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "maths-telugu-full-mock-08",
        title: "Full-Length Mock Test 08 — Maths & Science (Telugu L1)",
        category: "Full-Length Mock Tests",
        file: "data/mocks/maths-telugu-full-mock-08.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "maths-telugu-full-mock-09",
        title: "Full-Length Mock Test 09 — Maths & Science (Telugu L1)",
        category: "Full-Length Mock Tests",
        file: "data/mocks/maths-telugu-full-mock-09.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "maths-telugu-full-mock-10",
        title: "Full-Length Mock Test 10 — Maths & Science (Telugu L1)",
        category: "Full-Length Mock Tests",
        file: "data/mocks/maths-telugu-full-mock-10.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "maths-content-batch-01",
        title: "Mathematics — Batch 01",
        category: "Mathematics",
        file: "data/banks/maths/maths-content-batch-01.json",
        badge: "MATHEMATICS"
      },
      {
        id: "maths-content-batch-02",
        title: "Mathematics — Batch 02",
        category: "Mathematics",
        file: "data/banks/maths/maths-content-batch-02.json",
        badge: "MATHEMATICS"
      },
      {
        id: "maths-content-batch-03",
        title: "Mathematics — Batch 03",
        category: "Mathematics",
        file: "data/banks/maths/maths-content-batch-03.json",
        badge: "MATHEMATICS"
      },
      {
        id: "maths-content-batch-04",
        title: "Mathematics — Batch 04",
        category: "Mathematics",
        file: "data/banks/maths/maths-content-batch-04.json",
        badge: "MATHEMATICS"
      },

      {
        id: "physical-science-content-batch-01",
        title: "Physical Science — Batch 01",
        category: "Physical Science",
        file: "data/banks/physical-science/physical-science-content-batch-01.json",
        badge: "PHYSICAL SCIENCE"
      },
      {
        id: "physical-science-content-batch-02",
        title: "Physical Science — Batch 02",
        category: "Physical Science",
        file: "data/banks/physical-science/physical-science-content-batch-02.json",
        badge: "PHYSICAL SCIENCE"
      },
      {
        id: "physical-science-content-batch-03",
        title: "Physical Science — Batch 03",
        category: "Physical Science",
        file: "data/banks/physical-science/physical-science-content-batch-03.json",
        badge: "PHYSICAL SCIENCE"
      },
      {
        id: "physical-science-content-batch-04",
        title: "Physical Science — Batch 04",
        category: "Physical Science",
        file: "data/banks/physical-science/physical-science-content-batch-04.json",
        badge: "PHYSICAL SCIENCE"
      },

      {
        id: "biology-content-batch-01",
        title: "Biological Science — Batch 01",
        category: "Biological Science",
        file: "data/banks/biology/biology-content-batch-01.json",
        badge: "BIOLOGICAL SCIENCE"
      },
      {
        id: "biology-content-batch-02",
        title: "Biological Science — Batch 02",
        category: "Biological Science",
        file: "data/banks/biology/biology-content-batch-02.json",
        badge: "BIOLOGICAL SCIENCE"
      },
      {
        id: "biology-content-batch-03",
        title: "Biological Science — Batch 03",
        category: "Biological Science",
        file: "data/banks/biology/biology-content-batch-03.json",
        badge: "BIOLOGICAL SCIENCE"
      },
      {
        id: "biology-content-batch-04",
        title: "Biological Science — Batch 04",
        category: "Biological Science",
        file: "data/banks/biology/biology-content-batch-04.json",
        badge: "BIOLOGICAL SCIENCE"
      },

      {
        id: "english-l2-batch-01",
        title: "English Language II — Batch 01",
        category: "English Language II",
        file: "data/banks/english/english-l2-batch-01.json",
        badge: "ENGLISH LANGUAGE II"
      },
      {
        id: "english-l2-batch-02",
        title: "English Language II — Batch 02",
        category: "English Language II",
        file: "data/banks/english/english-l2-batch-02.json",
        badge: "ENGLISH LANGUAGE II"
      },
      {
        id: "english-l2-batch-03",
        title: "English Language II — Batch 03",
        category: "English Language II",
        file: "data/banks/english/english-l2-batch-03.json",
        badge: "ENGLISH LANGUAGE II"
      },
      {
        id: "english-l2-batch-04",
        title: "English Language II — Batch 04",
        category: "English Language II",
        file: "data/banks/english/english-l2-batch-04.json",
        badge: "ENGLISH LANGUAGE II"
      },
      {
        id: "english-l2-batch-05",
        title: "English Language II — Batch 05",
        category: "English Language II",
        file: "data/banks/english/english-l2-batch-05.json",
        badge: "ENGLISH LANGUAGE II"
      },
      {
        id: "english-l2-batch-06",
        title: "English Language II — Batch 06",
        category: "English Language II",
        file: "data/banks/english/english-l2-batch-06.json",
        badge: "ENGLISH LANGUAGE II"
      },

      {
        id: "cdp-core-batch-01",
        title: "Child Development & Pedagogy — Batch 01",
        category: "Child Development & Pedagogy",
        file: "data/banks/cdp/cdp-core-batch-01.json",
        badge: "CDP"
      },
      {
        id: "cdp-core-batch-02",
        title: "Child Development & Pedagogy — Batch 02",
        category: "Child Development & Pedagogy",
        file: "data/banks/cdp/cdp-core-batch-02.json",
        badge: "CDP"
      },
      {
        id: "cdp-core-batch-03",
        title: "Child Development & Pedagogy — Batch 03",
        category: "Child Development & Pedagogy",
        file: "data/banks/cdp/cdp-core-batch-03.json",
        badge: "CDP"
      },
      {
        id: "cdp-core-batch-04",
        title: "Child Development & Pedagogy — Batch 04",
        category: "Child Development & Pedagogy",
        file: "data/banks/cdp/cdp-core-batch-04.json",
        badge: "CDP"
      },
      {
        id: "cdp-core-batch-05",
        title: "Child Development & Pedagogy — Batch 05",
        category: "Child Development & Pedagogy",
        file: "data/banks/cdp/cdp-core-batch-05.json",
        badge: "CDP"
      },
      {
        id: "cdp-core-batch-06",
        title: "Child Development & Pedagogy — Batch 06",
        category: "Child Development & Pedagogy",
        file: "data/banks/cdp/cdp-core-batch-06.json",
        badge: "CDP"
      }
    ]
  },

  telugu: {
    title: "తెలుగు ప్రాక్టీస్",
    icon: "అ",
    subject: "Telugu Language Specialization",
    description:
      "తెలుగు సబ్జెక్టు ప్రశ్నలను అభ్యసించండి. " +
      "ప్రతి బ్యాచ్‌ను ప్రత్యేక ప్రాక్టీస్ సెట్‌గా ఎంచుకోవచ్చు.",
    tests: [
      {
        id: "telugu-full-mock-01",
        title: "Full-Length Mock Test 01 — Telugu Paper-II A",
        category: "Full-Length Mock Tests",
        file: "data/mocks/telugu-full-mock-01.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "telugu-full-mock-02",
        title: "Full-Length Mock Test 02 — Telugu Paper-II A",
        category: "Full-Length Mock Tests",
        file: "data/mocks/telugu-full-mock-02.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "telugu-full-mock-03",
        title: "Full-Length Mock Test 03 — Telugu Paper-II A",
        category: "Full-Length Mock Tests",
        file: "data/mocks/telugu-full-mock-03.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "telugu-full-mock-04",
        title: "Full-Length Mock Test 04 — Telugu Paper-II A",
        category: "Full-Length Mock Tests",
        file: "data/mocks/telugu-full-mock-04.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "telugu-full-mock-05",
        title: "Full-Length Mock Test 05 — Telugu Paper-II A",
        category: "Full-Length Mock Tests",
        file: "data/mocks/telugu-full-mock-05.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "telugu-full-mock-06",
        title: "Full-Length Mock Test 06 — Telugu Paper-II A",
        category: "Full-Length Mock Tests",
        file: "data/mocks/telugu-full-mock-06.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "telugu-full-mock-07",
        title: "Full-Length Mock Test 07 — Telugu Paper-II A",
        category: "Full-Length Mock Tests",
        file: "data/mocks/telugu-full-mock-07.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "telugu-full-mock-08",
        title: "Full-Length Mock Test 08 — Telugu Paper-II A",
        category: "Full-Length Mock Tests",
        file: "data/mocks/telugu-full-mock-08.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "telugu-full-mock-09",
        title: "Full-Length Mock Test 09 — Telugu Paper-II A",
        category: "Full-Length Mock Tests",
        file: "data/mocks/telugu-full-mock-09.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "telugu-full-mock-10",
        title: "Full-Length Mock Test 10 — Telugu Paper-II A",
        category: "Full-Length Mock Tests",
        file: "data/mocks/telugu-full-mock-10.json",
        badge: "150 QUESTIONS · 150 MINUTES"
      },
      {
        id: "telugu-specialization-batch-01",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 01",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-01.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-02",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 02",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-02.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-03",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 03",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-03.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-04",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 04",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-04.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-05",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 05",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-05.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-06",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 06",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-06.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-07",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 07",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-07.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-08",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 08",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-08.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-09",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 09",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-09.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-10",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 10",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-10.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-11",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 11",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-11.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-12",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 12",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-12.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-13",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 13",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-13.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-14",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 14",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-14.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-15",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 15",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-15.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-16",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 16",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-16.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-17",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 17",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-17.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-18",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 18",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-18.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-19",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 19",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-19.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-20",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 20",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-20.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-21",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 21",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-21.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-22",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 22",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-22.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-23",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 23",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-23.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-24",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 24",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-24.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-25",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 25",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-25.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-26",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 26",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-26.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-27",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 27",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-27.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-28",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 28",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-28.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-29",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 29",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-29.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-30",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 30",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-30.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-31",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 31",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-31.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-32",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 32",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-32.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-33",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 33",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-33.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-34",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 34",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-34.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-35",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 35",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-35.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-36",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 36",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-36.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-37",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 37",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-37.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-38",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 38",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-38.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-39",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 39",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-39.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-40",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 40",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-40.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-41",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 41",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-41.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-42",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 42",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-42.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-43",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 43",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-43.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-44",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 44",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-44.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-45",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 45",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-45.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-46",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 46",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-46.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-47",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 47",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-47.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-48",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 48",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-48.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-49",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 49",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-49.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-50",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 50",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-50.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-51",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 51",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-51.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-52",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 52",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-52.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-53",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 53",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-53.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-54",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 54",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-54.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-55",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 55",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-55.json",
        badge: "తెలుగు"
      },
      {
        id: "telugu-specialization-batch-56",
        title: "తెలుగు ప్రత్యేకత — బ్యాచ్ 56",
        category: "Telugu Specialization",
        file: "data/banks/telugu/telugu-specialization-batch-56.json",
        badge: "తెలుగు"
      },

      {
        id: "english-l2-batch-01",
        title: "English Language II — Batch 01",
        category: "English Language II",
        file: "data/banks/english/english-l2-batch-01.json",
        badge: "ENGLISH LANGUAGE II"
      },
      {
        id: "english-l2-batch-02",
        title: "English Language II — Batch 02",
        category: "English Language II",
        file: "data/banks/english/english-l2-batch-02.json",
        badge: "ENGLISH LANGUAGE II"
      },
      {
        id: "english-l2-batch-03",
        title: "English Language II — Batch 03",
        category: "English Language II",
        file: "data/banks/english/english-l2-batch-03.json",
        badge: "ENGLISH LANGUAGE II"
      },
      {
        id: "english-l2-batch-04",
        title: "English Language II — Batch 04",
        category: "English Language II",
        file: "data/banks/english/english-l2-batch-04.json",
        badge: "ENGLISH LANGUAGE II"
      },
      {
        id: "english-l2-batch-05",
        title: "English Language II — Batch 05",
        category: "English Language II",
        file: "data/banks/english/english-l2-batch-05.json",
        badge: "ENGLISH LANGUAGE II"
      },
      {
        id: "english-l2-batch-06",
        title: "English Language II — Batch 06",
        category: "English Language II",
        file: "data/banks/english/english-l2-batch-06.json",
        badge: "ENGLISH LANGUAGE II"
      },

      {
        id: "cdp-core-batch-01",
        title: "CDP — Batch 01",
        category: "Child Development & Pedagogy",
        file: "data/banks/cdp/cdp-core-batch-01.json",
        badge: "CDP"
      },
      {
        id: "cdp-core-batch-02",
        title: "CDP — Batch 02",
        category: "Child Development & Pedagogy",
        file: "data/banks/cdp/cdp-core-batch-02.json",
        badge: "CDP"
      },
      {
        id: "cdp-core-batch-03",
        title: "CDP — Batch 03",
        category: "Child Development & Pedagogy",
        file: "data/banks/cdp/cdp-core-batch-03.json",
        badge: "CDP"
      },
      {
        id: "cdp-core-batch-04",
        title: "CDP — Batch 04",
        category: "Child Development & Pedagogy",
        file: "data/banks/cdp/cdp-core-batch-04.json",
        badge: "CDP"
      },
      {
        id: "cdp-core-batch-05",
        title: "CDP — Batch 05",
        category: "Child Development & Pedagogy",
        file: "data/banks/cdp/cdp-core-batch-05.json",
        badge: "CDP"
      },
      {
        id: "cdp-core-batch-06",
        title: "CDP — Batch 06",
        category: "Child Development & Pedagogy",
        file: "data/banks/cdp/cdp-core-batch-06.json",
        badge: "CDP"
      }
    ]
  }
};