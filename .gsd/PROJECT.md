# Project

## What This Is

Craft Agents OSS is an Electron desktop app with shared server-core and headless server infrastructure for running agent sessions across local workspaces. This project extends the existing app so one installed desktop client can switch LLM providers mid-session, treat archiving as live session metadata, and connect to remote headless servers without forcing a separate thin-client app workflow.

## Core Value

One app should remain a continuous control surface for real agent work even when the user changes providers, reorganizes sessions programmatically, or moves execution to a remote machine.

## Current State

The codebase already has a working Electron app, shared session metadata/storage, multiple LLM connections, archive state in session data, and a headless WS server plus thin-client transport mode. What is missing is the user-facing continuity across those capabilities: provider switching is still constrained by backend-locking assumptions, programmatic archive changes do not refresh the UI like title/status changes, and remote server workspaces are not integrated into the normal settings and workspace switcher flow.

## Architecture / Key Patterns

- Electron renderer + main process live in `apps/electron/`.
- Reusable session and RPC logic lives in `packages/server-core/`.
- Shared config, storage, session metadata, watcher code, and protocol types live in `packages/shared/`.
- Workspace selection is routed through a shared workspace switcher UI in the renderer.
- Session metadata is persisted to `session.jsonl` and reflected into renderer state via events, watchers, and session meta maps.
- Remote transport already exists through WS-mode preload/bootstrap, but currently behaves like a separate thin-client mode instead of an integrated local+remote product surface.

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [ ] M001: Unified provider switching, live archiving, and remote workspaces — Make the existing desktop app behave like one truthful control surface across providers, session metadata, and active remote servers.
