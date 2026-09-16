# Find and Replace

[![Watch the demo](https://img.youtube.com/vi/juK6ar-hdtE/maxresdefault.jpg)](https://youtu.be/juK6ar-hdtE)

A Google Sheets add-on that batch-copies and edits Google Docs by replacing placeholder text with values pulled directly from a spreadsheet.

## What it does

Instead of manually duplicating a template document and swapping in names, dates, or other details one at a time, this add-on lets you:

1. Select a folder of template Google Docs (via the Google Picker API)
2. Provide key-value pairs in a Google Sheet, where each key is a placeholder found in the template (e.g. `{{name}}`) and each value is what it should be replaced with
3. Run the add-on to generate a copy of each document with all placeholders replaced, saved into a new output folder

This is useful for anything that requires generating multiple personalized documents from a single template — certificates, contracts, form letters, and similar batch document workflows.

## How it works

- Built as a **Google Workspace Add-on** using **Google Apps Script**
- Uses the **Picker API** to let users select a source folder of documents without leaving the Sheets interface
- Reads the active row/selection in the bound spreadsheet to get placeholder key-value pairs
- Uses the **Google Drive API** to duplicate each source document into a new folder
- Uses the **Google Docs API** (via `DocumentApp`) to find and replace placeholder text in each duplicated copy

## Tech stack

- Google Apps Script
- Google Workspace Add-on framework (CardService)
- Google Picker API
- Google Drive API / Google Docs API

## Setup

This project is bound to a Google Sheet and deployed through the Apps Script editor. To run it yourself:

1. Clone this repo
2. Push the code to a new Apps Script project using [`clasp`](https://github.com/google/clasp):
   ```bash
   clasp create --type sheets --title "Find and Replace"
   clasp push
   ```
3. In the Apps Script editor, add your own Picker API key to **Script Properties** (Project Settings → Script Properties) under the key `PICKER_API_KEY` — do not hardcode it in source
4. Enable the Google Picker API for the linked Google Cloud project
5. Open the bound Sheet and run the add-on from the Extensions menu

## Notes

- API keys are read from `PropertiesService.getScriptProperties()` at runtime and are never committed to source
- Originally built in 2025 for a medical device QMS consulting company, later published as a Workspace Marketplace add-on
