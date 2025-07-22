import { motion } from "motion/react";

export function EmptyState({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<motion.div
			className="flex h-full w-full items-center justify-center"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{
				duration: 0.5,
				delay: 0.2,
				ease: "easeIn",
			}}
		>
			<div className="mb-20 flex h-[27rem] w-[27rem] flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-100/40 p-10">
				<div>
					<svg
						className="h-40 w-40 text-gray-500"
						fill="none"
						strokeWidth={1.5}
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
						/>
					</svg>
				</div>
				<div className="text-center font-semibold text-2xl text-black/70">
					{title}
				</div>
				<div className="text-center text-base text-black/50">{description}</div>
			</div>
		</motion.div>
	);
}
