# Service Notification Destinations

The service interface supports notification fanout through `CompositeServiceNotifier`.

Supported destinations:

- Microsoft Teams workflow webhook
- email webhook
- CRM/helpdesk webhook
- legacy generic escalation webhook

Environment variables:

```env
SERVICE_TEAMS_WEBHOOK_URL=
SERVICE_EMAIL_WEBHOOK_URL=
SERVICE_CRM_WEBHOOK_URL=
SERVICE_NOTIFICATION_SHARED_SECRET=
```

Emergency service escalations should route to at least one real human destination before production launch.
