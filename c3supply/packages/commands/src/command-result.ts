export interface CommandResult<TSafeDTO> {
  ok: boolean;
  data?: TSafeDTO;
  error?: string;
}

export const ok = <T>(data: T): CommandResult<T> => ({ ok: true, data });

export const fail = <T = never>(error: string): CommandResult<T> => ({
  ok: false,
  error
});
