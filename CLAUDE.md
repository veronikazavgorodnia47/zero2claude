# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a learning/practice repository containing two independent mini-projects:

- **`my-server/`** — Express.js server with static file serving and a few API routes. Run with `node app.js` from inside the directory. Serves on port 3000.
- **`project_claude/`** — A client-side bookmark manager app (no build step). Open `index.html` directly in a browser or serve statically. All logic lives in `app.js`; no framework, no bundler.

## Running the Projects

```bash
# Express server
cd my-server && npm install && node app.js
# → http://localhost:3000

# Bookmark manager — open directly in browser
open project_claude/index.html
```

## Architecture Notes

### my-server
Minimal Express 5 app. Routes are defined inline in `app.js`. Static files are served from `public/`. No middleware beyond `express.static`.

### project_claude (Bookmark Manager)
Pure vanilla JS, no dependencies. All state lives in `localStorage` under the key `bookmarks` (array of `{title, url, category}`). The app has one render cycle — `render()` reloads from localStorage, rebuilds category filter tabs, and re-renders the list on every state change.

Key patterns:
- `editingIndex` tracks which bookmark is in inline-edit mode (null = view mode)
- `activeCategory` drives the filter tabs; resets to `'All'` when a category becomes empty
- All user-supplied strings go through `escapeHTML()` before being injected into innerHTML
- URLs are validated with `isSafeUrl()` (must start with `http://` or `https://`) before being rendered as links
- Theme preference (dark/light) is persisted in `localStorage` under `theme` and applied before first render to avoid flash
