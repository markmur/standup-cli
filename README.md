# Standup

Manage standup entries from your terminal.

<img width="851" alt="image" src="https://user-images.githubusercontent.com/2034704/153863424-032a7f0a-6b71-4d05-bb63-2e31ffe19833.png">

## Install

```bash
$ npm install --global standup-cli
```

## CLI

```
Usage
  $ standup

Commands
	list			(default) List standup tasks for today
	today			(alias) Run "list" command
	yesterday		List standup stasks for yesterday
	add			Add a task for today
	remove <number>		Remove task from today
	clear			Clear all tasks for today

Examples
  $ standup
  $ standup add "New task for today"
  $ standup list
  $ standup today
  $ standup yesterday
  $ standup remove 1
  $ standup clear
```
