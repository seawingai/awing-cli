import { execSync } from 'child_process';

export class Process {
    exec(command: string, log = true, cwd?: string) {
        if (log) {
            console.log(`[Executing]: ${command}`);
        }

        try {
            const options: any = {
                stdio: log ? 'inherit' : 'pipe',
                shell: process.env.ComSpec || 'cmd.exe',
            };
            if (cwd) options.cwd = cwd;
            execSync(command, options);
        } catch (error) {
            console.error('[Failed]:', error);
            process.exit(1);
        }
    }
}
