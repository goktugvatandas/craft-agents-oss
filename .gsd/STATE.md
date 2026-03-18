# GSD State

**Active Milestone:** M001 — Unified provider switching, live archiving, and remote workspaces
**Active Slice:** S01 — Same-session cross-provider switching
**Active Task:** Slice planning pending
**Phase:** Planning

## Recent Decisions
- Preserve the same session context and thread when switching providers/backends.
- Record backend/provider handoff explicitly in the UI.
- Treat archive as first-class live session metadata, not delayed state.
- Support multiple saved remote servers, but keep only one active at a time.
- Always start local; remote activation is explicit.

## Blockers
- None

## Next Action
Create `S01-PLAN.md` and task plans for same-session cross-provider switching, starting with the existing connection-locking path in `packages/server-core/src/sessions/SessionManager.ts` and the renderer’s current session model/connection change flow.
