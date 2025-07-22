import { motion } from "motion/react";

export default function PageHeader({ title }: { title: string }) {
	return (
		<div>
			<motion.h1
				className=" font-bold font-inter text-3xl text-black/70"
				initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
				animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
				transition={{ duration: 0.5 }}
			>
				{title}
			</motion.h1>
		</div>
	);
}
