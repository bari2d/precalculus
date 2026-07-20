# Honors Precalculus Final Review

A standalone static study site modeled on the sibling `algebra-2` project. It includes:

- 9 curriculum units and 29 guided lessons
- 9 interactive canvas sandboxes
- All 108 questions from the supplied final-review packet
- Worked answer feedback based on the supplied key
- Local quiz progress, starred lessons, and starred questions
- Downloadable copies of the exam-provided formula sheet, review, and key

## Run locally

Serve the folder over HTTP so browser modules load correctly:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

Progress is saved in the current browser with local storage. No backend or build step is required.
