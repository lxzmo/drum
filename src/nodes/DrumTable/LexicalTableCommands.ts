import type { LexicalCommand } from 'lexical';

import { createCommand } from 'lexical';

export type InsertTableCommandPayloadHeaders =
  | Readonly<{
      rows: boolean;
      columns: boolean;
    }>
  | boolean;

export type InsertTableCommandPayload = Readonly<{
  columns: string;
  rows: string;
  includeHeaders?: InsertTableCommandPayloadHeaders;
}>;

export const INSERT_TABLE_COMMAND: LexicalCommand<InsertTableCommandPayload> =
  createCommand('INSERT_TABLE_COMMAND');
