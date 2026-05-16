# Tech Support Human Handoff Workflow

Workflow:

```txt
NEW
→ AI_TRIAGE
→ HUMAN_REVIEW_REQUIRED
→ ASSIGNED
→ CLOSED
```

Customer path:

```txt
/support
→ /api/support-chat
→ AI triage package
→ deterministic handoff rules
→ support command layer
→ human support queue
```

Escalation reasons:

- human requested
- safety or damage risk
- installation or sizing
- warranty or order support
- quote or pricing support
- part identification or compatibility
- repeated unresolved conversation
- AI unavailable

The AI assistant is not the final technical authority. It collects details and routes work to human support when required.
