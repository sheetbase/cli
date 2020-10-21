import * as os from 'os';
import {execSync} from 'child_process';

export class TerminalService {
  constructor() {}

  getCommand(command: string) {
    return os.type() === 'Windows_NT' ? command + '.cmd' : command;
  }

  getRawArgs(commanderRawArgs: string[], command: string, toString = true) {
    const i = commanderRawArgs.indexOf(command) + 1;
    const args = commanderRawArgs.slice(i);
    if (toString) {
      return args.join(' ');
    }
    return args;
  }

  exec(
    command: string,
    cwd = '.',
    stdio: 'ignore' | 'inherit' | 'pipe' = 'inherit',
    raw = false
  ) {
    let finalCommand = command;
    if (!raw) {
      const [cmd, ...cmds] = command.trim().split(' ');
      finalCommand = this.getCommand(cmd) + ' ' + cmds.join(' ');
    }
    return execSync(finalCommand, {cwd, stdio});
  }

  run(
    handlerCommand: string,
    command: string,
    commanderRawArgs: string[],
    cwd = '.',
    forwarded = false
  ) {
    let finalCommand: string;
    if (forwarded) {
      const args = this.getRawArgs(
        commanderRawArgs,
        command,
        false
      ) as string[];
      if (args.length < 1) {
        throw new Error('Missing forwarded command.');
      }
      const forwardedCommand = args.shift();
      const forwardedArgs = args.join(' ');
      finalCommand = (
        handlerCommand +
        ` ${forwardedCommand} ` +
        (forwardedArgs ? ' -- ' + forwardedArgs : '')
      ).replace('-- --', '--');
    } else {
      finalCommand =
        handlerCommand + ' ' + this.getRawArgs(commanderRawArgs, command);
    }
    // run command
    this.exec(finalCommand, cwd);
  }
}
