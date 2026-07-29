# Precalculus Study Guide

A standalone static study site modeled on the sibling `algebra-2` project. It includes:

**Live site:** https://bari2d.github.io/precalculus/

- 9 focused study units and 49 guided lessons
- 9 interactive canvas sandboxes
- 108 cumulative practice questions
- Clear Core/Honors topic labels
- Worked answer feedback for every question
- Local quiz progress, starred lessons, and starred questions

## Run locally

Serve the folder over HTTP so browser modules load correctly:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

Progress is saved in the current browser with local storage. No backend or build step is required.
