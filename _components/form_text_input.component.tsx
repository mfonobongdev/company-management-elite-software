import { Field, useField } from "formik";

export default function FormTextInput({
	name,
	label,
	type = "text",
	as = "input",
	rows = 1,
	placeholder,
	required = true,
}: {
	name: string;
	label?: string;
	type?: string;
	as?: "input" | "textarea";
	rows?: number;
	placeholder?: string;
	required?: boolean;
}) {
	const [field, meta] = useField(name);

	return (
		<div>
			<label htmlFor={name} className="block font-medium text-gray-700 text-sm">
				<span className="flex items-center gap-2">
					{label}
					{required && <span className="text-red-500">*</span>}
				</span>
			</label>
			<Field
				id={name}
				as={as}
				name={name}
				type={type}
				placeholder={placeholder}
				className="mt-1 block w-full rounded-md px-3 py-2 outline-none ring-1 ring-gray-300 placeholder:text-gray-400 placeholder:text-sm focus:ring-blue-400"
				rows={rows}
			/>
			{meta.touched && meta.error && (
				<div className="text-red-600 text-sm">{meta.error}</div>
			)}
		</div>
	);
}
