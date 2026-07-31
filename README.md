# Precalculus Study Guide

A standalone static study site modeled on the sibling `algebra-2` project. It includes:

**Live site:** https://bari2d.github.io/precalculus/

- 9 focused study units and 49 guided lessons
- 9 interactive canvas sandboxes
- 108 cumulative practice questions
- Clear Core/Honors topic labels
- Worked answer feedback for every question
- Local-first quiz progress, starred lessons, and starred questions
- Ignored-question list for setting aside questions and reviewing them later
- Resumable unfinished quizzes, including saved question order and answers
- Optional Google sign-in for cloud sync across devices (shared with Algebra 2)

## Run locally

Serve the folder over HTTP so browser modules load correctly:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

Progress is saved locally first. Sign in with Google from the account button to sync Precalculus progress across devices; it uses the same account service as the Algebra 2 site while keeping each course in its own cloud field. No build step is required.
