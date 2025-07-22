import { motion } from "motion/react";

export default function Spinner() {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<motion.div
				animate={{ rotate: 360 }}
				transition={{
					duration: 1,
					repeat: Number.POSITIVE_INFINITY,
					ease: "linear",
				}}
			>
				<svg
					className="h-6 w-6"
					viewBox="0 0 48 48"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-label="Loading..."
				>
					<title>Spinner</title>
					<rect x="22" width="4" height="12" rx="2" fill="#2D2D2D" />
					<rect x="22" y="36" width="4" height="12" rx="2" fill="#adb5bd" />
					<rect
						y="26"
						width="4"
						height="12"
						rx="2"
						transform="rotate(-90 0 26)"
						fill="#adb5bd"
					/>
					<rect
						x="36"
						y="26"
						width="4"
						height="12"
						rx="2"
						transform="rotate(-90 36 26)"
						fill="#adb5bd"
					/>
					<rect
						x="5.61523"
						y="8.4436"
						width="4"
						height="12"
						rx="2"
						transform="rotate(-45 5.61523 8.4436)"
						fill="#adb5bd"
					/>
					<rect
						x="31.071"
						y="33.8995"
						width="4"
						height="12"
						rx="2"
						transform="rotate(-45 31.071 33.8995)"
						fill="#adb5bd"
					/>
					<rect
						x="8.4436"
						y="42.3848"
						width="4"
						height="12"
						rx="2"
						transform="rotate(-135 8.4436 42.3848)"
						fill="#adb5bd"
					/>
					<rect
						x="33.8994"
						y="16.9288"
						width="4"
						height="12"
						rx="2"
						transform="rotate(-135 33.8994 16.9288)"
						fill="#adb5bd"
					/>
				</svg>
			</motion.div>
		</div>
	);
}
