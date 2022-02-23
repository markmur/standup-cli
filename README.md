# standup-cli

Manage standup entries from your terminal.

<img width="1023" alt="image" src="https://user-images.githubusercontent.com/2034704/153878385-a556f6d8-37e7-4c2d-b38f-c1bf444ef96c.png">

## Install

```bash
$ npm install --global standup-cli
```

## CLI

```
Usage
  $ standup

Commands
  list				List standup tasks for today (default)
  today				Run "list" command (alias)
  yesterday			List standup stasks for yesterday
  add				Add a task for today
  remove <number>		Remove task from today
  clear				Clear all tasks for today

Examples
  $ standup
  $ standup add "New task for today"
  $ standup add "New feature" --pr "https://github.com/markmur/standup-cli/pulls/8"
  $ standup list
  $ standup today
  $ standup yesterday
  $ standup remove 1
  $ standup clear

Flags
  --noClear, -n			Do not clear the console
  --pr				Add link to Github pull request
```
