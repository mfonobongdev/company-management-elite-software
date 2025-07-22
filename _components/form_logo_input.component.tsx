import { ArrowDownTrayIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { useField, useFormikContext } from "formik";
import { type ChangeEvent, useEffect, useState } from "react";

export default function FormLogoInput({
	name,
	logoUrl,
}: {
	name: string;
	logoUrl?: string;
}) {
	const { values, setFieldValue, setFieldTouched } = useFormikContext<{
		logoS3Key: string;
		logo: File | string | null;
	}>();
	const [field, meta] = useField(name);

	const [preview, setPreview] = useState<string | null>(logoUrl || null);

	useEffect(() => {
		if (logoUrl) {
			setFieldValue(name, logoUrl);
		}
	}, [logoUrl, name, setFieldValue]);

	const handleFileChange = async (
		event: ChangeEvent<HTMLInputElement>,
	): Promise<void> => {
		const selectedFile = event.target.files?.[0];
		if (!selectedFile) return;

		setFieldTouched(name, true);
		setFieldValue(name, selectedFile);

		let isValidFile = true;

		// Validate file type
		if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
			isValidFile = false;
		}

		// Validate file size (2MB = 2 * 1024 * 1024 bytes)
		if (selectedFile.size > 2 * 1024 * 1024) {
			isValidFile = false;
		}

		if (isValidFile) {
			// Create preview
			const fileReader = new FileReader();
			fileReader.onload = () => {
				setPreview(fileReader.result as string);
			};
			fileReader.readAsDataURL(selectedFile);
		} else {
			setPreview(null);
		}
	};

	return (
		<div className="col-span-full">
			<label
				htmlFor={name}
				className="flex items-center gap-2 font-medium text-gray-900 text-sm/6"
			>
				Logo
				<span className="text-red-500">*</span>
			</label>
			<div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-900/25 border-dashed p-4">
				{/* Preview */}
				<div className="flex h-56 w-full flex-col items-center justify-center">
					{preview ? (
						<div className="h-full w-full items-center justify-center gap-2 rounded-md border border-gray-200 border-dashed">
							<img
								src={preview}
								alt="File preview"
								className="mx-auto h-full w-auto object-contain"
							/>
						</div>
					) : (
						<div>
							<PhotoIcon
								aria-hidden="true"
								className="mx-auto h-12 w-12 text-gray-300"
							/>
						</div>
					)}
				</div>

				{/* Upload */}
				<div className="flex flex-col items-center justify-center">
					<div className="mt-4 flex text-gray-600 text-sm/6">
						<label
							htmlFor={name}
							className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
						>
							{field.value ? (
								<span>Change file</span>
							) : (
								<span>Upload a file</span>
							)}

							<input
								id={name}
								name={name}
								type="file"
								className="sr-only"
								onChange={handleFileChange}
							/>
						</label>
					</div>
					<p className="text-gray-600 text-xs/5">PNG or JPG up to 2MB</p>
					{logoUrl && typeof values.logo === "string" && (
						<a
							href={logoUrl}
							target="_blank"
							download={"logo.png"}
							className="mt-4 flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
							rel="noreferrer"
						>
							<ArrowDownTrayIcon className="h-4 w-4" />
							Download logo
						</a>
					)}
				</div>
			</div>
			{meta.touched && meta.error && (
				<div className="text-red-600 text-sm">{meta.error}</div>
			)}
		</div>
	);
}
