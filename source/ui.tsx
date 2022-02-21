import React, {FC} from "react";
import meow from "meow";
import {Box, Text, Newline} from "ink";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";
import Link from "ink-link";

// Local
import {SupportedCommands} from "./cli";
import io, {Task} from "./io";

interface Props {
	command: string;
	args?: string[];
	flags?: meow.Result<any>["flags"];
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

const AddCommand: FC<{args: Props["args"]; flags?: Props["flags"]}> = ({
	args,
	flags = {},
}) => {
	const handleAddTask = () => {
		if (Array.isArray(args) && args.length > 0 && typeof args[0] === "string") {
			io.addTask(args?.[0], flags["pr"] ? (flags["pr"] as string) : undefined);
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

const formatGithubLink = (link: string) => {
	try {
		const url = new URL(link);
		const [owner, repo, , number] = url.pathname.slice(1).split("/");

		return `${owner}/${repo}#${number}`;
	} catch {
		return null;
	}
};

const ListTasks: FC<{date: string; tasks: Task[]}> = ({date, tasks = []}) => {
	return (
		<>
			<Text underline italic color="gray">
				{date}
			</Text>

			{tasks.length > 0 ? (
				tasks.map(({id, content, github_link}, i) => (
					<Box key={id}>
						<Text>
							{i + 1}. {content}{" "}
							{github_link && (
								<Link url={github_link}>
									- <Text>{formatGithubLink(github_link)}</Text>
								</Link>
							)}
						</Text>
					</Box>
				))
			) : (
				<Box>
					<Text italic color="gray">
						No entries yet
					</Text>
				</Box>
			)}

			<Newline />
		</>
	);
};

const App: FC<Props> = ({command, args, flags}) => {
	let tasks;
	const today = io.getTodaysDate();
	const todayDayName = io.getDayName(today);

	let previous = io.getYesterdaysDate();
	let previousDayName = "Yesterday";

	// If it's Monday, get Friday's entries instead of Sunday
	if (todayDayName.toLowerCase() === "monday") {
		previous = io.getDateMinusDays(3);
		previousDayName = io.getDayName(previous);
	}

	const yesterday = io.getYesterdaysDate();

	switch (command) {
		case SupportedCommands.ADD:
			return <AddCommand args={args} flags={flags} />;
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
			const previousTasks = io.getTasks(previous);
			return (
				<>
					<Banner />
					<ListTasks
						date={`${formatDate(yesterday)} (${previousDayName})`}
						tasks={previousTasks}
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
