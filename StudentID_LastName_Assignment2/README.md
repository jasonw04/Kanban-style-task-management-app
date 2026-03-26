# ITEC 3020 Assignment 2 - React Kanban App

## Student Information
- Student Name: Replace with your name
- Student Number: Replace with your student number

If this is a group submission, list every group member here before submitting.

## Project Overview
This project is a Kanban-style task management application built with React functional components, plain CSS, and native browser APIs. Users can create, edit, delete, move, and reorder tasks across multiple boards. All application data is saved in localStorage so the task boards persist after refreshing the page.

## Files Included
- `index.html`
- `css/style.css`
- `js/data.js`
- `js/utils.js`
- `js/components.js`
- `js/app.js`
- `README.md`

## How to Run
1. Keep all files in the same folder structure.
2. Open `index.html` in a modern browser.
3. The app will load sample boards automatically the first time.
4. After that, the app will save and reload your own localStorage data.

## Features Implemented
- Create, rename, and delete boards
- Create, edit, and delete tasks
- Task fields include title, description, creation date, due date, label, and priority
- Automatic due-date status updates such as Due Today, Due Soon, and Overdue
- Native HTML5 drag-and-drop for:
  - moving tasks between boards
  - reordering tasks within the same board
- Counters for boards, tasks, overdue items, and task labels
- localStorage persistence after refresh
- Modular React component structure split across multiple files

## Design Reasoning
### Overall Style and Theme
I used a clean modern dashboard theme with glass-style panels, rounded cards, and bold board columns so the app feels organized and visually polished. The layout keeps the most important actions visible at the top and makes each board easy to scan.

### Color Palette
The palette uses deep navy and blue backgrounds with purple and cyan accents. This creates contrast for readability while still giving the app a more modern and energetic look. Status colors were used consistently:
- blue for labels and active drag feedback
- purple for primary actions
- green for safe/on-track states
- yellow for due soon or due today
- red for overdue and destructive actions

### Theme Inspiration
The styling was intentionally kept similar to the visual feel used in Assignment 1, with a card-based layout, strong contrast, rounded elements, and a modern dark theme.

### Usability Choices
- Board controls are placed directly in each column for faster editing
- Tasks use clear pills for label, priority, and due-date status
- Drag-and-drop zones are highlighted so users can understand where tasks will be placed
- Modals keep create/edit interactions focused and prevent clutter inside the board layout
- Stats at the top make it easy to see the current workload right away

## Notes
- Replace the student information above before submitting.
- Rename the final compressed file using the required format:
  - `StudentID_LastName_Assignment2.zip`
