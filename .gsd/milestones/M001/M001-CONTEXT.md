# M001: Unified provider switching, live archiving, and remote workspaces

**Gathered:** 2026-03-18
**Status:** Ready for planning

## Project Description

Extend the existing Craft Agents desktop app so it behaves like one continuous control surface across local work, remote work, and provider changes. The user wants to switch providers mid-session while preserving the same context, archive sessions programmatically from inside a session with immediate UI reflection, and connect headless server/servers from settings so remote workspaces appear in the normal workspace switcher with a remote indicator.

## Why This Milestone

The capability gaps are already hurting real use. The user is exhausting one provider’s limits and wants to keep going in the same session on another provider. They can already programmatically update session title or status and see it immediately, but archiving does not show until restart. They have already set up the local app and a remote server for remote sessions, but they "dont want to start thin client or any other seperate client." This milestone solves those concrete product breaks first instead of adding new standalone surfaces.

## User-Visible Outcome

### When this milestone is complete, the user can:

- keep the same session context, switch from one provider connection to another, and see that backend handoff in the UI
- ask the LLM to archive referenced sessions or archive sessions matching a status filter and watch the archive state update immediately in the sidebar
- configure remote headless servers in settings, activate one, and see that server’s remote workspaces in the normal workspace switcher with a remote indicator
- choose a remote workspace and use it from the same installed app like thin client, without starting a separate client

### Entry point / environment

- Entry point: existing Electron desktop app UI (`apps/electron`), especially settings, workspace switcher, session UI, and sidebar
- Environment: local dev desktop app with optional remote headless WS server
- Live dependencies involved: local session storage, session metadata watchers/events, configured LLM providers, remote Craft Agent headless server transport

## Completion Class

- Contract complete means: provider switch persistence, archive propagation, remote server config, remote workspace listing, and related state indicators are proven by tests, artifact checks, and wiring verification
- Integration complete means: the existing desktop app can activate a remote server, surface remote workspaces in the switcher, open a remote workspace session, and preserve truthful remote/local state in the same UI shell
- Operational complete means: app startup remains local by default, remote activation is explicit, and remote disconnect leaves remote workspaces visible-but-unavailable with clear status

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- a real session can switch from one configured provider/backend to another in the same thread and continue with visible handoff state
- a programmatic archive action from inside a session updates the archive/sidebar state immediately without restarting the app
- a user can configure a remote server in settings, activate it from the app, see its remote workspaces in the workspace switcher, choose one, and run a remote session from the same app shell
- if the active remote server goes down, the app keeps remote workspaces visible as unavailable rather than silently dropping them
- the remote flow does not require starting thin client or any other separate client

## Risks and Unknowns

- Session backend locking is already present in server-core — same-session cross-provider switching may require reworking assumptions deeper than the model picker
- Archive already exists as session metadata — the bug may be in event propagation, watcher notification, or renderer state reconciliation rather than storage itself
- Remote transport already exists in preload/bootstrap — the hard part may be integrating remote workspace identity, activation, and failure handling into local app assumptions without hidden mode switches
- Slice boundaries matter because the user wants separate branches and PRs before sending work upstream to the main repo

## Existing Codebase / Prior Art

- `apps/electron/src/renderer/components/app-shell/input/FreeFormInput.tsx` — existing model/connection picker, including multi-connection grouping and per-session model change callback
- `apps/electron/src/renderer/pages/ChatPage.tsx` — current session-level model change flow into `setSessionModel()`
- `packages/server-core/src/sessions/SessionManager.ts` — session metadata persistence, archive/unarchive methods, connection locking, agent creation, and session model update logic
- `packages/shared/src/config/watcher.ts` — config/session metadata watcher path used for live title/status-like updates
- `apps/electron/src/renderer/App.tsx` — renderer session meta map updates, optimistic archive handling, workspace switching, and app-shell context wiring
- `apps/electron/src/preload/bootstrap.ts` — existing remote WS preload/bootstrap and transport connection state handling
- `apps/electron/src/renderer/components/app-shell/WorkspaceSwitcher.tsx` — current shared workspace switcher UI that will need local+remote truthfulness
- `packages/shared/src/config/storage.ts` — current workspace storage model and `getWorkspaces()` path, currently local-workspace-centric

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions — it is an append-only register; read it during planning, append to it during execution.

## Relevant Requirements

- R001 — allow cross-provider switching in the same session
- R002 — preserve same context instead of falling back to branching by default
- R003 — show visible backend handoff when provider/backend changes
- R004 — support archive requests from inside a session, including referenced sessions and status-filtered bulk archive
- R005 — make archive live-update like title/status metadata updates
- R006 — add remote server configuration in settings
- R007 — support multiple configured servers but only one active at a time
- R008 — always start local
- R009 — surface active remote server workspaces in the normal workspace switcher
- R010 — show remote indicators in that switcher
- R011 — make remote workspace sessions work like thin client from the same app
- R012 — preserve visible but unavailable remote workspaces on disconnect
- R013 — keep slice boundaries PR-friendly for upstreaming
- R014 — avoid hidden mode switches between local and remote behavior

## Scope

### In Scope

- same-session provider/backend switching with preserved context
- visible backend handoff indicators
- archive commands initiated from inside a session
- live archive UI propagation parity with title/status updates
- settings UI and storage for remote server definitions
- one-active-server activation model
- local + active-remote workspace switcher integration
- remote workspace indicators and disconnect visibility
- remote session behavior from the same installed app shell

### Out of Scope / Non-Goals

- starting a separate thin-client app or separate client mode for remote use
- keeping more than one remote server active simultaneously
- hiding remote state so remote workspaces look local
- using automatic branch/new-session handoff as the default provider-switch behavior
- broad remote fleet management beyond save/edit/activate/deactivate

## Technical Constraints

- The current session lifecycle includes connection locking after first backend resolution; planning must account for that explicitly.
- Existing archive behavior already persists state, so fixes should target root-cause propagation rather than layering duplicate state.
- Remote transport already exists and must be reused rather than replaced.
- App startup must remain local by default even after remote server settings are added.
- The workspace switcher must stay truthful: remote is visible as remote, and failure stays visible as failure.

## Integration Points

- LLM connection resolution and agent backend creation — provider switching must interact safely with existing connection/model resolution
- Session metadata persistence and eventing — archive/title/status consistency depends on this path
- Workspace storage and switcher UI — remote workspaces must coexist with local ones in one selector
- Remote WS transport and connection banner state — activation and failure handling must reuse existing transport signals
- Settings UI — remote server definitions need a stable user-facing configuration surface

## Open Questions

- How heavy the session backend lock actually is in practice — current reading suggests some switching is already partially implemented, but planning must prove which flows still assume fixed backend identity
- Whether remote workspaces should be grouped under the active server in the switcher or flattened into one list with source indicators — current thinking favors the least surprising UI that still makes the active server explicit
- What exact UI artifact should represent backend handoff — current thinking favors a durable session-level indicator over a transient toast alone
