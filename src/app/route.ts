import { NextRequest } from "next/server";
import chalk from "chalk";
import boxen from "boxen";
import figures from "figures";
import stripAnsi from "strip-ansi";
import type { AnswerObject } from "@/data/types";

function printAnswer({ answer, type }: AnswerObject): string {
	switch (type) {
		case "positive":
			return chalk.greenBright(answer);
		case "neutral":
			return chalk.yellowBright(answer);
		case "negative":
			return chalk.redBright(answer);
		default:
			return chalk.white(answer);
	}
}

export async function GET(req: NextRequest) {
	try {
		const fetchData = await fetch("https://api.8.alialmasi.ir/v2/answers");
		const pureData = await fetchData.json();
		const answerObject: AnswerObject = pureData?.data.answer;

		const output = boxen(
			[
				`${chalk.green.bold(figures.tick)} ${chalk.bold(
					"Here's your answer!"
				)}`,
				"",
				`${figures.triangleRight} ${printAnswer(answerObject)}`
			].join("\n"),
			{
				padding: 1,
				borderStyle: "singleDouble",
				borderColor: "green"
			}
		);

		const { searchParams } = new URL(req.url);
		const noColor =
			searchParams.get("noColor") || searchParams.get("nocolor") === "1";
		const returnJson =
			searchParams.get("json") || searchParams.get("JSON") === "1";

		if (returnJson) {
			return new Response(JSON.stringify(pureData), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			});
		}

		return new Response(noColor ? stripAnsi(output) : output, {
			status: 200,
			headers: { "Content-Type": "text/plain; charset=utf-8" }
		});
	} catch (err: unknown) {
		const errorMsg = boxen(
			`${figures.cross} Failed to fetch data.
			${JSON.stringify(err, null, 2)}`,
			{
				padding: 1,
				borderStyle: "classic",
				borderColor: "red"
			}
		);

		return new Response(stripAnsi(errorMsg), {
			status: 500,
			headers: { "Content-Type": "text/plain; charset=utf-8" }
		});
	}
}
