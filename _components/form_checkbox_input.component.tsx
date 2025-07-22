import { Field } from "formik";

export default function FormCheckboxInput({
	name,
	label,
}: { name: string; label: string }) {
	return (
		<div className="col-span-2 mb-2">
			<label htmlFor={name} className=" flex items-center">
				<Field type="checkbox" id={name} name={name} className="mr-2" />
				<span className="text-sm">{label}</span>
			</label>
		</div>
	);
}
