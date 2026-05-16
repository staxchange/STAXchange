# Mutation Gateway

`packages/commands` is the only protected mutation gateway.

Apps must not directly mutate protected data or call payment/database mutation clients directly.
