import React, { FC } from "react";
import { Text } from "ink";
import meow from "meow";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";

// Local
import { SUPPORTED_COMMANDS } from "./cli";
import io, { Task } from "./io";

interface Props {
	command: string;
	args?: string[];
	flags?: meow.Flag<any, any>[];
}

const AddCommand: FC<{ args: Props["args"] }> = ({ args }) => {
	const handleAddTask = () => {
		if (Array.isArray(args) && args.length > 0 && typeof args[0] === "string") {
			io.addTask(args?.[0]);
		}
	};

	React.useEffect(handleAddTask, []);

	return (
		<>
			<Text color="green">Enter a task:</Text>
		</>
	);
};

const ListTasks: FC<{ date: string; tasks?: Task[] }> = ({ date, tasks }) => {
	return (
		<>
			<Gradient name="rainbow">
				<BigText text="Standup" />
			</Gradient>
			<Text italic>{`${io.getDayName(date)}, ${date}
			`}</Text>
			<Text></Text>
			{tasks?.length ? (
				tasks?.map(({ id, content }) => <Text key={id}>{`	- ${content}`}</Text>)
			) : (
				<Text italic>No entries found</Text>
			)}
			<Text>
				{`
				
				`}
			</Text>
		</>
	);
};

const App: FC<Props> = ({ command, args }) => {
	let tasks;
	const today = io.getTodaysDate();
	const yesterday = io.getYesterdaysDate();

	switch (command) {
		case SUPPORTED_COMMANDS.ADD:
			return <AddCommand args={args} />;
		case SUPPORTED_COMMANDS.YESTERDAY:
			tasks = io.getTasks(yesterday);
			return <ListTasks date={yesterday} tasks={tasks} />;
		case SUPPORTED_COMMANDS.LIST:
		case SUPPORTED_COMMANDS.TODAY:
		default:
			tasks = io.getTasks();
			return <ListTasks date={today} tasks={tasks} />;
	}
};

module.exports = App;
export default App;
