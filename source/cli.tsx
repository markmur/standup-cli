#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui";

export enum SUPPORTED_COMMANDS {
	ADD = "add",
	LIST = "list",
	TODAY = "today",
	YESTERDAY = "yesterday",
}

function getCommand(cli: meow.Result<any>): {
	command: string;
	args: string[];
} {
	const [command = "list", ...args] = cli.input;

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
		add			Add a stask for today
		list		(default) List standup tasks for today
		today		(alias) Run "list" command
		yesterday	List standup stasks for yesterday

	Options
		--name  Your name

	Examples
	  $ standup
	  $ standup add "New task for today"
	  $ standup list
	  $ standup today
	  $ standup yesterday
`,
	{
		flags: {
			name: {
				type: "string",
			},
		},
	}
);

const { command, args } = getCommand(cli);

render(<App command={command} args={args} />);
