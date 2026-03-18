# M001: Unified provider switching, live archiving, and remote workspaces

**Vision:** Make the existing desktop app behave like one truthful control surface across providers, session metadata, and active remote servers, without forcing a separate thin-client workflow.

## Success Criteria

- A live session can switch from one configured provider/backend to another and continue in the same thread.
- The UI records the backend handoff clearly when that switch happens.
- Programmatic archive changes from inside a session appear in the UI immediately, the same way title/status changes do.
- The app can save remote headless server definitions, start local by default, activate one server explicitly, and show that server’s remote workspaces in the normal workspace switcher.
- Remote workspaces are visibly remote, and if the active remote server disconnects they remain visible as unavailable instead of disappearing.
- Selecting a remote workspace runs sessions from the same installed app like thin client, without starting a separate client.

## Key Risks / Unknowns

- Session backend/provider identity is currently locked in parts of server-core after first use — this may block true same-session cross-provider switching.
- Archive state already persists but does not live-refresh like title/status — the missing behavior could be in watcher notification, event emission, or renderer reconciliation.
- Remote WS transport already exists, but workspace storage/switcher assumptions are currently local-centric and may resist truthful local+remote composition.

## Proof Strategy

- Session backend/provider lock semantics → retire in S01 by proving a live session can switch provider/backend and continue in the same thread with visible handoff state.
- Archive live propagation gap → retire in S02 by proving programmatic archive actions update sidebar/archive UI immediately without restart.
- Remote local+active-remote composition risk → retire in S05 by proving the app starts local, activates one remote server explicitly, shows remote workspaces in the switcher, and runs a remote workspace session while preserving disconnect visibility.

## Verification Classes

- Contract verification: targeted tests for session model/connection switching, archive metadata propagation, remote server settings persistence, workspace list composition, and disconnect state; static artifact and wiring checks.
- Integration verification: real desktop app flow exercising provider switch, archive command propagation, remote server activation, remote workspace selection, and remote session start.
- Operational verification: startup remains local by default; active remote disconnect leaves remote workspaces visible-but-unavailable with clear status.
- UAT / human verification: visual truthfulness of backend handoff and remote indicators; whether the combined local+remote switcher feels clear rather than hidden-mode.

## Milestone Definition of Done

This milestone is complete only when all are true:

- all slice deliverables are complete and independently testable
- shared session metadata and workspace switcher components are actually wired into the live app behavior
- the real desktop app entrypoint is exercised for provider switch, archive propagation, remote activation, and remote workspace session use
- success criteria are re-checked against live behavior, not just artifacts or optimistic state updates
- final integrated acceptance scenarios pass without requiring a separate thin-client app

## Requirement Coverage

- Covers: R001, R002, R003, R004, R005, R006, R007, R008, R009, R010, R011, R012, R013, R014
- Partially covers: none
- Leaves for later: R015, R016
- Orphan risks: none

## Slices

- [ ] **S01: Same-session cross-provider switching** `risk:high` `depends:[]`
  > After this: a live session can switch from one configured provider/backend to another and continue in the same thread, with visible backend handoff in the UI.

- [ ] **S03: Remote server configuration and activation** `risk:high` `depends:[]`
  > After this: the app can save multiple remote server definitions, always starts local, and lets the user explicitly activate exactly one remote server.

- [ ] **S04: Unified local + remote workspace switcher** `risk:high` `depends:[S03]`
  > After this: the normal workspace switcher shows local workspaces plus workspaces from the active remote server, with remote indicators that tell the truth.

- [ ] **S02: Programmatic archive live sync** `risk:medium` `depends:[]`
  > After this: archive requests initiated from inside a session, including archive-by-status flows, update the sidebar/archive view immediately without app restart.

- [ ] **S05: Remote workspace session integration and failure states** `risk:medium` `depends:[S03,S04]`
  > After this: selecting a remote workspace runs remote sessions from the same installed app like thin client, and remote disconnect leaves remote workspaces visible but unavailable with clear status.

## Boundary Map

### S01 → downstream session flows

Produces:
- Session-level provider/backend switching that preserves the same session ID and conversation history
- Persisted backend handoff marker/invariant in session metadata or event history
- Updated `setSessionModel` / session model-change semantics that allow cross-provider connection changes after session start
- Renderer-visible handoff state so downstream UI and summaries can explain backend changes truthfully

Consumes:
- Existing session model picker and per-session model change callback in `apps/electron/src/renderer/pages/ChatPage.tsx` and `FreeFormInput.tsx`
- Existing session connection/model update path in `packages/server-core/src/handlers/rpc/settings.ts` and `SessionManager.updateSessionModel()`

### S03 → S04

Produces:
- Persisted remote server definitions in app settings/config
- Activation state for exactly one active remote server at a time
- Startup invariant: app launches local until a remote server is explicitly activated
- Connection state surface for the active remote server that downstream UI can read

Consumes:
- Existing remote WS preload/bootstrap and transport connection state surfaces
- Existing settings UI conventions and config storage patterns

### S03 → S05

Produces:
- Stable notion of “active remote server” and the transport/config data needed to talk to it
- Local-vs-remote startup and activation semantics

Consumes:
- Existing remote transport/client-only machinery instead of replacing it

### S04 → S05

Produces:
- Unified workspace list model containing local workspaces plus workspaces from the active remote server
- Remote indicator semantics for workspace rows and selected workspace display
- Workspace-switcher activation path that can select remote workspaces without pretending they are local

Consumes from S03:
- Active remote server state and saved remote server definitions

### S02 → downstream session/sidebar flows

Produces:
- Archive propagation path that behaves like title/status live metadata updates
- Stable archive/unarchive event or watcher behavior that updates renderer session meta state immediately
- Bulk/programmatic archive semantics for referenced sessions and status-filtered archive commands

Consumes:
- Existing archive persistence in `SessionManager.archiveSession()` / `unarchiveSession()`
- Existing title/status/session metadata watcher and renderer session meta map update paths
