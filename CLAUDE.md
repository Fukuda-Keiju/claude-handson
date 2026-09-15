# Claude Handson (ServiceNow Fluent SDK app)

ServiceNow scoped app written with the Fluent SDK (`@servicenow/sdk` 4.12.1).
Scope: `x_2221398_handson`. Target instance: alias `mypdi` (https://dev192510.service-now.com, PDI).

## Layout
- `now.config.json` — app scope/name (do not hand-edit scopeId)
- `src/fluent/*.now.ts` — metadata (tables, business rules, client scripts, ...) via Fluent API
- `src/server/*.ts` — server-side scripts referenced from `.now.ts`
- `@types/servicenow/` — generated typings (run `npm run types` after adding dependencies)

## Commands
- `npm run build` — compile Fluent sources (`now-sdk build`)
- `npm run deploy` — install/update app on `mypdi` (`now-sdk install`)
- `now-sdk explain <topic>` — official docs; run `now-sdk explain` to list topics. Prefer this over memory.
- `now-sdk query <table> -q "<encoded query>" -f a,b` — read live instance data (sys_ids, schemas, choices)

## Rules
- Always build before deploy; report deploy output faithfully.
- `$id: Now.ID['...']` keys must stay stable once deployed (they map to sys_ids).
- Scope names must start with `x_2221398_` and be <= 18 chars.
- Use the `now-sdk` plugin skill for orientation at the start of each session.
