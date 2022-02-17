import React, {FC} from "react";
import {Box, Text, Newline} from "ink";
import meow from "meow";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";

// Local
import {SupportedCommands} from "./cli";
import io, {Task} from "./io";

interface Props {
	command: string;
	args?: string[];
	flags?: meow.Flag<any, any>[];
}

const RemoveCommand: FC<{args: Props["args"]}> = ({args = []}) => {
	const [number] = args;

	if (isNaN(Number(number))) {
		return (
			<>
				<Text color="red" bold>
					Invalid args.
				</Text>
				<Newline />
				<Text italic>Example usage:</Text>
				<Text>$ standup remove 1</Text>
				<Newline />
			</>
		);
	}

	const handleRemoveTask = () => {
		io.removeTask(Number(number));
	};

	React.useEffect(handleRemoveTask, []);

	return (
		<>
			<Text color="green" bold>
				✔ Task {number} deleted
			</Text>
		</>
	);
};

const ClearCommand: FC = () => {
	const handleRemoveTask = () => {
		io.clearTasks();
	};

	React.useEffect(handleRemoveTask, []);

	return (
		<>
			<Text color="green" bold>
				✔ All tasks deleted
			</Text>
		</>
	);
};

const AddCommand: FC<{args: Props["args"]}> = ({args}) => {
	const handleAddTask = () => {
		if (Array.isArray(args) && args.length > 0 && typeof args[0] === "string") {
			io.addTask(args?.[0]);
		}
	};

	React.useEffect(handleAddTask, []);

	return (
		<>
			<Text color="green" bold>
				✔ Task added
			</Text>
		</>
	);
};

const Banner = () => (
	<Gradient name="rainbow">
		<BigText text="Standup" />
	</Gradient>
);

const formatDate = (date: string) => `${io.getDayName(date)}, ${date}`;

const ListTasks: FC<{date: string; tasks: Task[]}> = ({date, tasks = []}) => {
	if (!tasks.length) {
		return (
			<Box>
				<Text italic>No entries found</Text>
			</Box>
		);
	}

	return (
		<>
			<Text underline italic color="gray">
				{date}
			</Text>

			{tasks.map(({id, content}, i) => (
				<Box key={id}>
					<Text>
						{i + 1}. {content}
					</Text>
				</Box>
			))}

			<Newline />
		</>
	);
};

const App: FC<Props> = ({command, args}) => {
	let tasks;
	const today = io.getTodaysDate();
	const yesterday = io.getYesterdaysDate();

	switch (command) {
		case SupportedCommands.ADD:
			return <AddCommand args={args} />;
		case SupportedCommands.REMOVE:
			return <RemoveCommand args={args} />;
		case SupportedCommands.CLEAR:
			return <ClearCommand />;
		case SupportedCommands.YESTERDAY:
			tasks = io.getTasks(yesterday);
			return <ListTasks date={yesterday} tasks={tasks} />;
		case SupportedCommands.LIST:
		case SupportedCommands.TODAY:
		default:
			const todaysTasks = io.getTasks();
			const yesterdaysTasks = io.getTasks(yesterday);
			return (
				<>
					<Banner />
					<ListTasks
						date={`${formatDate(yesterday)} (Yesterday)`}
						tasks={yesterdaysTasks}
					/>
					<ListTasks
						date={`${formatDate(today)} (Today)`}
						tasks={todaysTasks}
					/>
				</>
			);
	}
};

module.exports = App;
export default App;
