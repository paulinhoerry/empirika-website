# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current State

This is the Empirika website project. It is currently an empty scaffold — there is no source code, build system, or framework set up yet. When the site is scaffolded (framework chosen, package.json created, etc.), update this file with build/dev/lint commands and architecture notes.

## Design Workflow: Impeccable

The [impeccable](https://github.com/pbakaus/impeccable) design skill (v4) is installed at `.agents/skills/impeccable/` and tracked in `skills-lock.json`. It governs all frontend/UI design work in this project.

Key points when doing UI work here:

- Run `node .agents/skills/impeccable/scripts/context.mjs` once per session before design work (pass `--target <path>` for a specific file or route). It loads PRODUCT.md, DESIGN.md, and surface briefs if they exist.
- The skill provides sub-commands (`shape`, `critique`, `audit`, `polish`, `bolder`, `quieter`, `animate`, `typeset`, `layout`, `live`, etc.) — each has a playbook under `.agents/skills/impeccable/reference/` that must be loaded before acting on it.
- `init` captures durable product context into PRODUCT.md; `document` generates DESIGN.md from existing code. Neither exists yet — a new surface or visual world should route through `init` then new-work.
- Load `.agents/skills/impeccable/reference/craft-floor.md` immediately before editing UI (it defines the quality floor and bans).
- Verify UI in bounded screenshot passes (desktop + mobile batched), not per-tweak loops.
