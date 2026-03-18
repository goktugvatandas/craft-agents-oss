# Decisions Register

<!-- Append-only. Never edit or remove existing rows.
     To reverse a decision, add a new row that supersedes it.
     Read this file at the start of any planning or research phase. -->

| # | When | Scope | Decision | Choice | Rationale | Revisable? |
|---|------|-------|----------|--------|-----------|------------|
| D001 | M001 | arch | Provider switching semantics | Preserve the same session context and thread when switching providers/backends | The user wants this to work like Pi agent model changes, not as an automatic branch/new-session fallback | No |
| D002 | M001 | convention | Backend handoff visibility | Record provider/backend handoff explicitly in the UI when a session changes backend | Same-thread continuity becomes misleading if the backend changes silently | No |
| D003 | M001 | pattern | Archive propagation model | Treat archive as first-class live session metadata, with the same immediacy expectation as title/status updates | The current restart-only archive visibility is a product bug, not acceptable behavior | No |
| D004 | M001 | arch | Remote server activation model | Support multiple saved remote servers but keep only one active at a time | This gives the user multiple targets while limiting overhead and reducing state complexity | Yes — if later remote fleet usage needs concurrent activation |
| D005 | M001 | convention | Remote startup behavior | Always start the app in local mode; remote use is explicit activation | The user does not want the main app to become a hidden thin client on launch | No |
| D006 | M001 | scope | Remote UX surface | Remote workspaces must appear in the main workspace switcher with a clear remote indicator, and remote use must not require a separate thin-client app | The product goal is one installed app with truthful local/remote state, not separate clients or hidden modes | No |
