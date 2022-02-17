#!/usr/bin/env node
import React from "react";
import {render} from "ink";
import meow from "meow";
import App from "./ui";

function clearConsole() {
	process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
	console.clear();
}

export enum SupportedCommands {
	ADD = "add",
	LIST = "list",
	TODAY = "today",
	YESTERDAY = "yesterday",
	REMOVE = "remove",
	CLEAR = "clear",
}

const DEFAULT = "list";

function getCommand(cli: meow.Result<any>): {
	command: string;
	args: string[];
} {
	const [command = DEFAULT, ...args] = cli.input;

	return {
		command,
		args,
	};
}

const cli = meow(
	`
	Usage
	  $ standup

	Commands
		list				(default) List standup tasks for today
		today				(alias) Run "list" command
		yesterday			List standup stasks for yesterday
		add				Add a task for today
		remove <number>			Remove task from today
		clear				Clear all tasks for today

	Examples
	  $ standup
	  $ standup add "New task for today"
	  $ standup list
	  $ standup today
	  $ standup yesterday
	  $ standup remove 1
	  $ standup clear

	Flags
		--noClear, -n		Do not clear the console for "list", "today" and "yesterday" commands
`,
	{
		flags: {
			noClear: {
				type: "boolean",
				alias: "n",
				default: false,
				isMultiple: false,
				isRequired: false,
			},
		},
	},
);

const {command, args} = getCommand(cli);

if (
	[
		SupportedCommands.LIST,
		SupportedCommands.TODAY,
		SupportedCommands.YESTERDAY,
	].includes(command as SupportedCommands) &&
	!cli.flags.noClear
) {
	clearConsole();
}

render(<App command={command} args={args} />);
