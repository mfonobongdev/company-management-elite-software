import cn from "classnames";

export default function FormSection({
	title,
	children,
	className,
}: {
	title: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("rounded-lg border border-gray-200 p-6", className)}>
			<h2 className="mb-4 font-semibold text-xl">{title}</h2>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">{children}</div>
		</div>
	);
}
