# Commerce Governance Boundary

Cart collects intent only. Treatment systems and quote-required items require human review.

Protected mutations route through `packages/commands`. Apps do not directly mutate Supabase.
