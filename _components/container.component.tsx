export default function Container({ children }: { children: React.ReactNode }) {
	return (
		<div className="mx-auto h-screen max-w-[55rem] py-8 font-inter">
			{children}
		</div>
	);
}
