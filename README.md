# Maths Buddy

An interactive maths revision site for a 3rd grade exam. It runs entirely in the browser, with no build step and no accounts.

## What is inside

- **9 topics**, each with an interactive lesson and an 8-question practice set (stars are saved on the device):
  number names, place value and expanded form, before/after/between, compare and order, number patterns,
  add and subtract (with carrying and borrowing), story problems, flat shapes, solid shapes.
- **Your Worksheets**: the questions from the three worksheets, marked automatically.
- **Mock Test**: 20 mixed questions, one try each, with a score and a review of mistakes.
- **Quick Revision**: a one-page cheat sheet.

## Run it

Open `index.html` in a browser, or serve the folder with any static host:

```
npx serve .
```

## Change the exam date

Edit `MB.config` at the top of `js/core.js` (`examDate` is `YYYY-MM-DD`).

## Layout

| File | Purpose |
| --- | --- |
| `js/core.js` | storage, number words, sound, confetti |
| `js/visuals.js` | base-ten blocks, number lines, shapes, 3D box |
| `js/quiz.js` | question engine (choice, fill-in, tap-to-order, tap-to-pick) |
| `js/topics1.js` .. `topics3.js` | lessons and question generators |
| `js/exam.js` | worksheets and mock test |
| `js/app.js` | routing, home, topic pages, cheat sheet |
