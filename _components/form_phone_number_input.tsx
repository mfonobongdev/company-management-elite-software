import { useField, useFormikContext } from "formik";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export default function FormPhoneNumberInput({
	name,
	label,
	required = true,
}: {
	name: string;
	label?: string;
	required?: boolean;
}) {
	const { setFieldValue } = useFormikContext();
	const [field, meta] = useField(name);

	return (
		<div>
			<label htmlFor={name} className="block font-medium text-gray-700 text-sm">
				<span className="flex items-center gap-2">
					{label}
					{required && <span className="text-red-500">*</span>}
				</span>
			</label>
			<div className="[&_.react-international-phone-input]:-my-2 mt-1 w-full [&_.react-international-phone-input]:flex-1">
				<PhoneInput
					{...field}
					defaultCountry="us"
					onChange={(value) => {
						setFieldValue(name, value);
					}}
				/>
			</div>
			{meta.touched && meta.error && (
				<div className="text-red-600 text-sm">{meta.error}</div>
			)}
		</div>
	);
}
