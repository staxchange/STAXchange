# Final Boundary Checkpoint

## Core rule

```txt
apps/* may render UI and call API routes.
API routes may call packages/commands.
packages/commands is the protected mutation gateway.
```

## Forbidden

```txt
app/client direct Supabase mutation
service-role key in browser
OpenAI API key in browser
AI final diagnosis
AI system sizing
AI plumbing/electrical/chemical instruction
automatic invoice approval
direct Simply Accounting sync
automatic accounting posting
```

## Required human review

```txt
sizing
installation
chemical
electrical
plumbing
safety
warranty
compatibility
finance approval
invoice approval
Simply Accounting export
service closeout
```


## Production auth bridge

Dev header fallback is forbidden in production unless explicitly disabled by deployment environment controls.


## Vertical isolation

```txt
STAX / DALENSTAX is the core operating system.
DWG ecommerce/service is the active vertical.
The Collectibles vertical is separate and inactive in this repo.
```

Do not introduce:

```txt
cards_master
vault_items
sports-card marketplace logic
collectibles trust scoring
break room workflows
```
