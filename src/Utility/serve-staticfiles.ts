import * as fs from 'fs';
import { join } from 'node:path/win32';

export function getFile(relativePath: string): string {
  return fs.readFileSync(join(process.cwd(), relativePath)).toString();
}
