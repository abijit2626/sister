# Study Buddy

An interactive revision site for 3rd grade exams: **Maths** and **EVS** (Our Wondrous World). It runs entirely in the browser, with no build step and no accounts. Switch subject with the buttons at the top of the home screen.

## What is inside (Maths)

- **9 topics**, each with an interactive lesson and an 8-question practice set (stars are saved on the device):
  number names, place value and expanded form, before/after/between, compare and order, number patterns,
  add and subtract (with carrying and borrowing), story problems, flat shapes, solid shapes.
- **Your Worksheets**: the questions from the three worksheets, marked automatically.
- **Mock Test**: 20 mixed questions, one try each, with a score and a review of mistakes.
- **Quick Revision**: a one-page cheat sheet.

## What is inside (EVS)

Three chapters, each with an interactive lesson (story steps, flip cards, sorting and ordering games, a tomato-plant explorer, bird sounds) and a practice set drawn from a bank of 40+ questions:

- **Going to the Mela** (chapter 2)
- **Getting to Know Plants** (chapter 4)
- **Plants and Animals Live Together** (chapter 5)

Question types: multiple choice, true/false, fill in the blank, match the pairs, sort into groups, put in order, tap the pictures, and short answers you check yourself against a model answer. **Textbook Questions** holds the book's own Discuss / Write / Find out questions, and the **Mock Test** mixes all three chapters.

## Run it

Open `index.html` in a browser, or serve the folder with any static host:

```
npx serve .
```

## Change the exam date

Edit `MB.SUBJECTS` at the top of `js/core.js`. Each subject has an `examDate` (`YYYY-MM-DD`, or `null` to hide the countdown).

## Layout

| File | Purpose |
| --- | --- |
| `js/core.js` | storage, number words, sound, confetti |
| `js/visuals.js` | base-ten blocks, number lines, shapes, 3D box |
| `js/quiz.js` | question engine (choice, fill-in, tap-to-order, tap-to-pick) |
| `js/widgets.js` | lesson widgets for text subjects (cards, story, games) |
| `js/topics1.js` .. `topics3.js` | Maths lessons and question generators |
| `js/evs-ch2.js`, `evs-ch4.js`, `evs-ch5.js` | EVS chapters: lessons and question banks |
| `js/evs-papers.js` | EVS textbook questions and revision sheet |
| `js/exam.js` | worksheets and mock test |
| `js/app.js` | routing, home, topic pages, cheat sheet |
