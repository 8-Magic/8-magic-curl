import { NextRequest } from "next/server";
import chalk from "chalk";
import boxen, { Options } from "boxen";
import figures, { fallbackSymbols } from "figures";
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

function printType(type: string): string {
	switch (type) {
		case "positive":
			return "YES";
		case "neutral":
			return "IDK";
		case "negative":
			return "NO";
		default:
			return "";
	}
}

const boxenSettings: Options = {
	padding: {
		top: 2,
		bottom: 2,
		left: 6,
		right: 6
	},
	titleAlignment: "center",
	borderStyle: "classic"
};

export async function GET(req: NextRequest) {
	try {
		const fetchData = await fetch("https://api.8.alialmasi.ir/v2/answers");
		const pureData = await fetchData.json();
		const answerObject: AnswerObject = pureData?.data.answer;

		const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";
		const isCli = userAgent.includes("curl");

		const output =
			boxen(
				[
					`${figures.triangleRight} ${printAnswer(answerObject)}`,
					"",
					`   Short: ${chalk.bold(printType(answerObject.type))}`
				].join("\n"),
				{
					padding: boxenSettings.padding,
					margin: 1,
					borderStyle: boxenSettings.borderStyle,
					borderColor: "green",
					title: `${fallbackSymbols.tick} Here's your answer!`,
					titleAlignment: boxenSettings.titleAlignment
				}
			) + "\n";

		const { searchParams } = new URL(req.url);
		const noColor =
			searchParams.get("noColor") || searchParams.get("nocolor") === "1";
		const returnJson =
			searchParams.get("json") || searchParams.get("JSON") === "1";

		if (returnJson) {
			return new Response(JSON.stringify(pureData, null, 2) + "\n", {
				status: 200,
				headers: { "Content-Type": "application/json; charset=utf-8" }
			});
		}

		return new Response(noColor || !isCli ? stripAnsi(output) : output, {
			status: 200,
			headers: { "Content-Type": "text/plain; charset=utf-8" }
		});
	} catch (err: unknown) {
		const errorMsg = boxen(`${JSON.stringify(err, null, 2)}`, {
			padding: boxenSettings.padding,
			borderStyle: boxenSettings.borderStyle,
			borderColor: "red",
			title: `${fallbackSymbols.cross} Failed to fetch data.`,
			titleAlignment: boxenSettings.titleAlignment
		});

		return new Response(stripAnsi(errorMsg), {
			status: 500,
			headers: { "Content-Type": "text/plain; charset=utf-8" }
		});
	}
}
