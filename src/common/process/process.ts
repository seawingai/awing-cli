import { execSync } from 'child_process';

export class Process {
    exec(command: string, log = true, cwd?: string) {
        if (log) {
            console.log(`[Executing]: ${command}`);
        }

        try {
            execSync(command, { stdio: 'inherit', cwd });
        } catch (error) {
            console.error('[Failed]:', error);
            process.exit(1);
        }
    }
}
