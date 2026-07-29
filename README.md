# Honors Precalculus Final Review

A standalone static study site modeled on the sibling `algebra-2` project. It includes:

**Live site:** https://bari2d.github.io/precalculus/

- 9 focused study units and 49 guided lessons covering all 6 official curriculum units
- 9 interactive canvas sandboxes
- All 108 questions from the supplied final-review packet
- Core/Honors labels matching the district curriculum's asterisks
- Worked answer feedback checked against the supplied key
- Local quiz progress, starred lessons, and starred questions
- Downloadable copies of the official curriculum, exam-provided formula sheet, review, and key

See [CURRICULUM_AUDIT.md](CURRICULUM_AUDIT.md) for the source-by-source coverage audit and question corrections.

## Run locally

Serve the folder over HTTP so browser modules load correctly:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

Progress is saved in the current browser with local storage. No backend or build step is required.
