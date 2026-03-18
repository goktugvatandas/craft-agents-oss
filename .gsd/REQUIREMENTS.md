# Requirements

This file is the explicit capability and coverage contract for the project.

Use it to track what is actively in scope, what has been validated by completed work, what is intentionally deferred, and what is explicitly out of scope.

Guidelines:
- Keep requirements capability-oriented, not a giant feature wishlist.
- Requirements should be atomic, testable, and stated in plain language.
- Every **Active** requirement should be mapped to a slice, deferred, blocked with reason, or moved out of scope.
- Each requirement should have one accountable primary owner and may have supporting slices.
- Research may suggest requirements, but research does not silently make them binding.
- Validation means the requirement was actually proven by completed work and verification, not just discussed.

## Active

### R001 — Cross-provider switching in the same session
- Class: core-capability
- Status: active
- Description: A running session can switch from one configured provider connection to another without forcing a new session or branch.
- Why it matters: The user hits provider limits in real use and needs to keep working instead of being trapped on one backend.
- Source: user
- Primary owning slice: M001/S01
- Supporting slices: M001/S05
- Validation: mapped
- Notes: Must support switching across providers, not just models within the same provider family.

### R002 — Preserve conversation continuity across provider switch
- Class: continuity
- Status: active
- Description: Provider switching keeps the same conversation context and thread identity.
- Why it matters: The desired experience is "it should work like pi agent changes models," not a disguised branch or session restart.
- Source: user
- Primary owning slice: M001/S01
- Supporting slices: none
- Validation: mapped
- Notes: A fallback branch flow is not acceptable as the default behavior.

### R003 — Visible backend handoff in session UI
- Class: failure-visibility
- Status: active
- Description: When a session switches backend/provider, the UI records that handoff clearly.
- Why it matters: Same-thread continuity becomes confusing if the backend changes silently.
- Source: user
- Primary owning slice: M001/S01
- Supporting slices: none
- Validation: mapped
- Notes: This can be session metadata, timeline event, header indicator, or a combination, but it must be visible.

### R004 — Programmatic archive commands from inside a session
- Class: core-capability
- Status: active
- Description: The user can ask the LLM to archive referenced sessions or archive sessions matching a status-based filter.
- Why it matters: Session organization is already driven from inside sessions, not just by clicking in the sidebar.
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: none
- Validation: mapped
- Notes: Supported commands include direct references and bulk phrases such as "archive all sessions which status is x".

### R005 — Archive state updates live in UI like title/status
- Class: continuity
- Status: active
- Description: Programmatic archive changes appear in the UI immediately, without restart, the same way title and status changes do.
- Why it matters: Archive must behave like first-class session metadata, not delayed state.
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: M001/S05
- Validation: mapped
- Notes: Current observed failure is restart-only visibility.

### R006 — Remote servers configurable from settings
- Class: admin/support
- Status: active
- Description: The app can save remote headless server connection settings from the UI.
- Why it matters: The user wants remote workflows managed from the main app instead of environment variables or a separate client startup path.
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: none
- Validation: mapped
- Notes: This includes server URL/token and any activation metadata needed by the app.

### R007 — Multiple saved remote servers, one active at a time
- Class: operability
- Status: active
- Description: The user can configure multiple remote servers, but only one is active at a time.
- Why it matters: This keeps overhead bounded while still supporting more than one remote target.
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: M001/S04
- Validation: mapped
- Notes: Activation can happen via workspace switcher as long as settings owns configuration.

### R008 — App starts local by default
- Class: launchability
- Status: active
- Description: On app launch, the desktop app starts in local mode until the user explicitly activates a remote server.
- Why it matters: The user does not want the main app to become a hidden thin client on startup.
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: M001/S05
- Validation: mapped
- Notes: Remembering server definitions is allowed; auto-activating one on launch is not.

### R009 — Active remote server contributes workspaces into the main workspace switcher
- Class: integration
- Status: active
- Description: Once a remote server is activated, its workspaces appear in the existing workspace switcher alongside local workspaces.
- Why it matters: The product should feel like one app surface, not separate local and remote apps.
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: M001/S05
- Validation: mapped
- Notes: The workspace switcher is the activation surface the user asked for.

### R010 — Remote workspaces are clearly marked as remote
- Class: quality-attribute
- Status: active
- Description: Remote workspaces have a clear remote indicator and do not masquerade as local workspaces.
- Why it matters: Truthful state matters more than cosmetic simplification here.
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: none
- Validation: mapped
- Notes: This is both a UX and failure-visibility requirement.

### R011 — Remote workspace sessions behave like thin-client sessions from the same app
- Class: core-capability
- Status: active
- Description: Starting and using a session in a remote workspace works like the existing thin-client behavior, but from the same installed desktop app.
- Why it matters: The user explicitly does not want to start thin client or any other separate client.
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: M001/S03, M001/S04
- Validation: mapped
- Notes: Remote session behavior must stay honest about being remote while using the same app shell.

### R012 — Remote disconnect keeps remote workspaces visible but unavailable, with clear status
- Class: failure-visibility
- Status: active
- Description: If the active remote server goes down, remote workspaces remain visible in an unavailable state and the connection problem is clearly surfaced.
- Why it matters: Silent disappearance would feel like hidden mode switching and makes recovery harder.
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: M001/S04
- Validation: mapped
- Notes: This should preserve the user’s mental model during failures.

### R013 — Work is sliceable into separate upstream-ready PRs
- Class: operability
- Status: active
- Description: The milestone should decompose into separate branch/PR-sized slices that can be tested independently before sending upstream.
- Why it matters: The user wants separate branches and PRs to the main repo once everything works.
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: M001/S01, M001/S02, M001/S03, M001/S04
- Validation: mapped
- Notes: Boundaries matter because this is intended for upstream contribution, not just local customization.

### R014 — No hidden mode switches between local and remote behavior
- Class: constraint
- Status: active
- Description: Local and remote behavior must stay explicit; the app should not quietly become a different product mode.
- Why it matters: This is the strongest cross-cutting UX constraint from the discussion.
- Source: inferred
- Primary owning slice: M001/S05
- Supporting slices: M001/S03, M001/S04
- Validation: mapped
- Notes: Remote activation is explicit, remote state is visible, and local startup remains the default.

## Validated

None yet.

## Deferred

### R015 — More than one remote server active simultaneously
- Class: operability
- Status: deferred
- Description: The app can keep multiple remote servers active at the same time and merge all of their workspaces into the switcher.
- Why it matters: This may become useful later for multi-host power users.
- Source: inferred
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred to keep first implementation bounded to one active remote server.

### R016 — Advanced remote server fleet management
- Class: admin/support
- Status: deferred
- Description: The app offers richer remote fleet controls beyond save/edit/activate/deactivate.
- Why it matters: This could matter if remote usage expands to many hosts and environments.
- Source: research
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Not needed for the current project shape.

## Out of Scope

### R017 — Separate dedicated thin-client app flow for remote use
- Class: anti-feature
- Status: out-of-scope
- Description: Remote work requires launching a separate thin-client app or a separate client mode outside the main desktop app.
- Why it matters: This prevents the project from drifting away from the user’s stated product goal.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: The explicit user wording was that they "dont want to start thin client or any other seperate client."

### R018 — Silent backend/provider switching
- Class: anti-feature
- Status: out-of-scope
- Description: A session changes backend/provider without a visible handoff indicator.
- Why it matters: Silent backend drift would make same-thread continuity untrustworthy.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Visible backend handoff is required.

### R019 — Remote workspaces presented as local
- Class: anti-feature
- Status: out-of-scope
- Description: Remote workspaces appear in the switcher without any remote indicator or source truth.
- Why it matters: This would violate the explicit "no hidden mode switches" constraint.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Remote must stay visible as remote.

## Traceability

| ID | Class | Status | Primary owner | Supporting | Proof |
|---|---|---|---|---|---|
| R001 | core-capability | active | M001/S01 | M001/S05 | mapped |
| R002 | continuity | active | M001/S01 | none | mapped |
| R003 | failure-visibility | active | M001/S01 | none | mapped |
| R004 | core-capability | active | M001/S02 | none | mapped |
| R005 | continuity | active | M001/S02 | M001/S05 | mapped |
| R006 | admin/support | active | M001/S03 | none | mapped |
| R007 | operability | active | M001/S03 | M001/S04 | mapped |
| R008 | launchability | active | M001/S03 | M001/S05 | mapped |
| R009 | integration | active | M001/S04 | M001/S05 | mapped |
| R010 | quality-attribute | active | M001/S04 | none | mapped |
| R011 | core-capability | active | M001/S05 | M001/S03, M001/S04 | mapped |
| R012 | failure-visibility | active | M001/S05 | M001/S04 | mapped |
| R013 | operability | active | M001/S05 | M001/S01, M001/S02, M001/S03, M001/S04 | mapped |
| R014 | constraint | active | M001/S05 | M001/S03, M001/S04 | mapped |
| R015 | operability | deferred | none | none | unmapped |
| R016 | admin/support | deferred | none | none | unmapped |
| R017 | anti-feature | out-of-scope | none | none | n/a |
| R018 | anti-feature | out-of-scope | none | none | n/a |
| R019 | anti-feature | out-of-scope | none | none | n/a |

## Coverage Summary

- Active requirements: 14
- Mapped to slices: 14
- Validated: 0
- Unmapped active requirements: 0
