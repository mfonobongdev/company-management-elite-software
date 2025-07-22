"use client";

import FormPhoneNumberInput from "@/_components/form_phone_number_input";
import useCreateCompany, {
	type Company,
} from "@/_hooks/use_create_company.hook";
import useGetSignedUploadUrl from "@/_hooks/use_get_signed_upload_url.hook";
import useUpdateCompany from "@/_hooks/use_update_company.hook";
import { useUploadImage } from "@/_hooks/use_upload_image.hook";
import useAppStore from "@/_stores/app.store";
import { Form, Formik, useField, useFormikContext } from "formik";
import { isPossibleNumber, isValidNumber } from "libphonenumber-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import FormCheckboxInput from "../../_components/form_checkbox_input.component";
import FormLogoInput from "../../_components/form_logo_input.component";
import FormSection from "../../_components/form_section.component";
import FormTextInput from "../../_components/form_text_input.component";

interface Address {
	street: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;
}

interface PrimaryContactPerson {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
}

interface CompanyFormData {
	id?: string;
	email: string;
	phone: string;
	logoS3Key: string;
	logo: File | string | null;
	facebookCompanyPage: string;
	fax: string;
	industry: string;
	legalName: string;
	linkedInCompanyPage: string;
	mailingAddress: Address;
	numberOfFullTimeEmployees: number;
	numberOfPartTimeEmployees: number;
	otherInformation: string;
	primaryContactPerson: PrimaryContactPerson;
	registeredAddress: Address;
	stateOfIncorporation: string;
	totalNumberOfEmployees: number;
	website: string;
	isMailingAddressDifferentFromRegisteredAddress: boolean;
	__typename?: string;
}

// Type for API submission (omitting the logo field)
type CompanyApiData = Omit<CompanyFormData, "logo">;

interface CompanyFormProps {
	companyId?: string;
	initialValues?: Partial<CompanyFormData>;
	logoUrl?: string;
}

const addressSchema = Yup.object({
	street: Yup.string().trim().required("Street is required"),
	city: Yup.string().trim().required("City is required"),
	state: Yup.string().trim().required("State is required"),
	country: Yup.string().trim().required("Country is required"),
	zipCode: Yup.string()
		.trim()
		.required("Zip code is required")
		.matches(/^[0-9]+$/, "Must be only digits")
		.min(5, "Must be at least 5 digits"),
});

const primaryContactPersonSchema = Yup.object({
	firstName: Yup.string().trim().required("First name is required"),
	lastName: Yup.string().trim().required("Last name is required"),
	email: Yup.string()
		.email("Invalid email")
		.trim()
		.required("Email is required"),
	phone: Yup.string()
		.trim()
		.required("Phone is required")
		.test("valid-phone", "Invalid phone number", (value) => {
			if (!value) return false;
			return isPossibleNumber(value) && isValidNumber(value);
		}),
});

const FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const SUPPORTED_FORMATS = ["image/jpeg", "image/png"];

const companyFormSchema = Yup.object({
	legalName: Yup.string()
		.trim()
		.required("Legal name is required")
		.min(3, "Legal name must be at least 3 characters"),
	industry: Yup.string()
		.trim()
		.required("Industry is required")
		.min(3, "Industry must be at least 3 characters"),
	website: Yup.string()
		.trim()
		.required("Website is required")
		.url("Invalid website URL"),
	email: Yup.string()
		.trim()
		.email("Invalid email")
		.required("Email is required"),
	phone: Yup.string()
		.trim()
		.required("Phone is required")
		.test("valid-phone", "Invalid phone number", (value) => {
			if (!value) return false;
			return isPossibleNumber(value) && isValidNumber(value);
		}),
	logoS3Key: Yup.string(),
	logo: Yup.mixed()
		.required("Logo is required")
		.test("required", "Logo is required", (value) => {
			if (!value || value === null || value === undefined) return false;
			return true;
		})
		.test("fileSize", "File size must be less than 2MB", (value) => {
			if (!value) return false;
			if (typeof value === "string") return true; // Accept existing logo URL
			if (value instanceof File) {
				return value.size <= FILE_SIZE;
			}
			return false;
		})
		.test("fileFormat", "Only JPEG and PNG files are allowed", (value) => {
			if (!value) return false;
			if (typeof value === "string") return true; // Accept existing logo URL
			if (value instanceof File) {
				return SUPPORTED_FORMATS.includes(value.type);
			}
			return false;
		}),
	facebookCompanyPage: Yup.string()
		.trim()
		.required("Facebook page is required")
		.url("Invalid Facebook page URL"),
	fax: Yup.string()
		.trim()
		.required("Fax is required")
		.test("valid-fax", "Invalid fax number", (value) => {
			if (!value) return false;
			return isPossibleNumber(value) && isValidNumber(value);
		}),
	linkedInCompanyPage: Yup.string()
		.trim()
		.required("LinkedIn page is required")
		.url("Invalid LinkedIn page URL"),
	mailingAddress: Yup.object().when(
		"isMailingAddressDifferentFromRegisteredAddress",
		{
			is: true,
			then: () => addressSchema,
			otherwise: () =>
				Yup.object({
					street: Yup.string()
						.trim()
						.min(3, "Street must be at least 3 characters"),
					city: Yup.string()
						.trim()
						.min(3, "City must be at least 3 characters"),
					state: Yup.string()
						.trim()
						.min(3, "State must be at least 3 characters"),
					country: Yup.string()
						.trim()
						.min(3, "Country must be at least 3 characters"),
					zipCode: Yup.string()
						.trim()
						.matches(/^[0-9]+$/, "Must be only digits")
						.min(5, "Must be at least 5 digits"),
				}),
		},
	),
	numberOfFullTimeEmployees: Yup.number()
		.min(0, "Number must be 0 or greater")
		.required("Number of full-time employees is required")
		.test(
			"at-least-one-employee",
			"At least one full-time or part-time employee",
			function (value) {
				const { numberOfPartTimeEmployees } = this.parent;
				return numberOfPartTimeEmployees > 0 || value > 0;
			},
		),
	numberOfPartTimeEmployees: Yup.number()
		.min(0, "Number must be 0 or greater")
		.required("Number of part-time employees is required")
		.test(
			"at-least-one-employee",
			"At least one full-time or part-time employee",
			function (value) {
				const { numberOfFullTimeEmployees } = this.parent;
				return numberOfFullTimeEmployees > 0 || value > 0;
			},
		),
	otherInformation: Yup.string()
		.trim()
		.required("Other information is required")
		.min(3, "Other information must be at least 3 characters"),
	primaryContactPerson: primaryContactPersonSchema,
	registeredAddress: addressSchema,
	stateOfIncorporation: Yup.string()
		.trim()
		.required("State of incorporation is required")
		.min(3, "State of incorporation must be at least 3 characters"),
	totalNumberOfEmployees: Yup.number()
		.min(1, "At least one employee (full-time or part-time) is required")
		.required("Total number of employees is required"),
	isMailingAddressDifferentFromRegisteredAddress: Yup.boolean().required(),
});

const defaultInitialValues: CompanyFormData = {
	legalName: "",
	industry: "",
	website: "",
	email: "",
	phone: "",
	logoS3Key: "",
	logo: null,
	facebookCompanyPage: "",
	fax: "",
	linkedInCompanyPage: "",
	mailingAddress: {
		street: "",
		city: "",
		state: "",
		country: "",
		zipCode: "",
	},
	numberOfFullTimeEmployees: 0,
	numberOfPartTimeEmployees: 0,
	otherInformation: "",
	primaryContactPerson: {
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
	},
	registeredAddress: {
		street: "",
		city: "",
		state: "",
		country: "",
		zipCode: "",
	},
	stateOfIncorporation: "",
	totalNumberOfEmployees: 0,
	isMailingAddressDifferentFromRegisteredAddress: false,
};

const truncateError = (message: string) =>
	message.length > 24 ? `${message.slice(0, 21)}...` : message;

export default function CompanyForm({
	companyId,
	initialValues = {},
	logoUrl,
}: CompanyFormProps) {
	const router = useRouter();
	const { createCompany: createCompanyMutation } = useCreateCompany();
	const { updateCompany: updateCompanyMutation } = useUpdateCompany();
	const addCompany = useAppStore.getState().addCompany;
	const updateCompany = useAppStore.getState().updateCompany;
	const { trigger } = useUploadImage();
	const { getSignedUploadUrl } = useGetSignedUploadUrl();
	const [isUploadingLogo, setIsUploadingLogo] = useState(false);

	const formMode = companyId ? "edit" : "create";

	const handleSubmit = async (
		values: CompanyFormData,
		{ setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
	) => {
		try {
			setSubmitting(true);

			let formattedValues = { ...values };

			// Only handle file upload if we have a new File object
			if (values.logo instanceof File) {
				try {
					setIsUploadingLogo(true);
					//get signed upload url
					const { data: uploadUrlData } = await getSignedUploadUrl({
						variables: {
							input: {
								contentType: values.logo.type,
								fileName: values.logo.name,
							},
						},
					});

					if (!uploadUrlData?.getSignedUploadUrl.key) {
						throw new Error("Failed to get upload URL");
					}

					//upload image to s3
					const { data: uploadData } = await trigger({
						uploadUrl: uploadUrlData.getSignedUploadUrl.url as string,
						file: values.logo,
					});

					formattedValues = {
						...formattedValues,
						logoS3Key: uploadUrlData.getSignedUploadUrl.key,
					};
				} catch (error) {
					throw new Error("Failed to upload logo");
				} finally {
					setIsUploadingLogo(false);
				}
			}

			switch (formMode) {
				case "create":
					await handleCreateCompany(formattedValues);
					break;
				case "edit":
					await handleUpdateCompany(formattedValues, companyId as string);
					break;
				default:
					throw new Error(`Unsupported form mode: ${formMode}`);
			}

			//redirect to company list
			router.push("/companies");
		} catch (error) {
			toast.error(
				truncateError(
					error instanceof Error ? error.message : "Failed to submit form",
				),
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleCreateCompany = async (values: CompanyFormData) => {
		// Format values for create
		const { logo, __typename, ...apiValues } = {
			...values,
			phone: values.phone || "",
			mailingAddress: {
				...(!values.isMailingAddressDifferentFromRegisteredAddress
					? values.registeredAddress
					: values.mailingAddress),
				zipCode: values.isMailingAddressDifferentFromRegisteredAddress
					? values.mailingAddress.zipCode || ""
					: values.registeredAddress.zipCode || "",
			},
			registeredAddress: {
				...values.registeredAddress,
				zipCode: values.registeredAddress.zipCode || "",
			},
			primaryContactPerson: {
				...values.primaryContactPerson,
				phone: values.primaryContactPerson.phone || "",
			},
		};

		//create company
		const { data: createCompanyData, errors: createCompanyErrors } =
			await createCompanyMutation({
				variables: { input: apiValues },
			});

		if (createCompanyErrors) {
			toast.error(
				truncateError(
					`Failed to create company: ${createCompanyErrors.map((error) => error.message).join(", ")}`,
				),
			);
			return;
		}

		//add company to app store
		if (createCompanyData?.createCompany.company) {
			toast.success("Company created successfully");
			addCompany(createCompanyData.createCompany.company as Company);
		}
	};

	const handleUpdateCompany = async (
		values: CompanyFormData,
		companyId: string,
	) => {
		// Format values for update
		const { logo, id, __typename, ...apiValues } = {
			...values,
			phone: values.phone || "",
			mailingAddress: {
				...(!values.isMailingAddressDifferentFromRegisteredAddress
					? values.registeredAddress
					: values.mailingAddress),
				zipCode: values.isMailingAddressDifferentFromRegisteredAddress
					? values.mailingAddress.zipCode || ""
					: values.registeredAddress.zipCode || "",
			},
			registeredAddress: {
				...values.registeredAddress,
				zipCode: values.registeredAddress.zipCode || "",
			},
			primaryContactPerson: {
				...values.primaryContactPerson,
				phone: values.primaryContactPerson.phone || "",
			},
		};

		//update company
		const { data: updateCompanyData, errors: updateCompanyErrors } =
			await updateCompanyMutation({
				variables: { companyId, input: apiValues },
			});

		if (updateCompanyErrors) {
			toast.error(
				truncateError(
					`Failed to update company: ${updateCompanyErrors.map((error) => error.message).join(", ")}`,
				),
			);
			return;
		}

		//update company in app store
		if (updateCompanyData?.updateCompany.company) {
			toast.success("Company updated successfully");
			updateCompany(updateCompanyData.updateCompany.company as Company);
		}
	};

	return (
		<Formik
			initialValues={{ ...defaultInitialValues, ...initialValues }}
			validationSchema={companyFormSchema}
			onSubmit={handleSubmit}
		>
			{({ errors, handleSubmit, isSubmitting, values }) => (
				<Form className="space-y-6" onSubmit={handleSubmit}>
					{/* Company Information */}
					<FormSection title="Company Information">
						<FormLogoInput name="logo" logoUrl={logoUrl} />
						<FormTextInput name="legalName" label="Legal Name" />
						<FormTextInput name="industry" label="Industry" />
						<FormTextInput name="email" type="email" label="Email" />
						{/* <FormTextInput name="phone" type="tel" label="Phone" /> */}
						<FormPhoneNumberInput name="phone" label="Phone" />
						<FormTextInput
							name="website"
							type="url"
							label="Website"
							placeholder="https://www.example.com"
						/>
					</FormSection>

					{/* Address Information */}
					<FormSection title="Address Information">
						<FormSection title="Registered Address" className="col-span-2">
							<FormTextInput name="registeredAddress.street" label="Street" />
							<FormTextInput name="registeredAddress.city" label="City" />
							<FormTextInput name="registeredAddress.state" label="State" />
							<FormTextInput name="registeredAddress.country" label="Country" />
							<FormTextInput
								name="registeredAddress.zipCode"
								label="Zip Code"
							/>
						</FormSection>

						<FormCheckboxInput
							name="isMailingAddressDifferentFromRegisteredAddress"
							label="Specify a different mailing address (uses registered address by default)"
						/>

						{values.isMailingAddressDifferentFromRegisteredAddress && (
							<FormSection title="Mailing Address" className="col-span-2">
								<FormTextInput name="mailingAddress.street" label="Street" />
								<FormTextInput name="mailingAddress.city" label="City" />
								<FormTextInput name="mailingAddress.state" label="State" />
								<FormTextInput name="mailingAddress.country" label="Country" />
								<FormTextInput name="mailingAddress.zipCode" label="Zip Code" />
							</FormSection>
						)}
					</FormSection>

					{/* Primary Contact Person */}
					<FormSection title="Primary Contact Person">
						<FormTextInput
							name="primaryContactPerson.firstName"
							label="First Name"
						/>
						<FormTextInput
							name="primaryContactPerson.lastName"
							label="Last Name"
						/>
						<FormTextInput name="primaryContactPerson.email" label="Email" />
						<FormPhoneNumberInput
							name="primaryContactPerson.phone"
							label="Phone"
						/>
					</FormSection>

					{/* Employee Information */}
					<FormSection title="Employee Information">
						<FormTextInput
							name="numberOfFullTimeEmployees"
							label="Full-time Employees"
							type="number"
						/>
						<FormTextInput
							name="numberOfPartTimeEmployees"
							label="Part-time Employees"
							type="number"
						/>
						<TotalEmployeesField name="totalNumberOfEmployees" />
					</FormSection>

					{/* Social Media & Additional Information */}
					<FormSection title="Social Media & Additional Information">
						<FormTextInput
							name="facebookCompanyPage"
							label="Facebook Company Page"
							type="url"
						/>
						<FormTextInput
							name="linkedInCompanyPage"
							label="LinkedIn Company Page"
							type="url"
						/>
						<FormPhoneNumberInput name="fax" label="Fax" />
						<FormTextInput
							name="stateOfIncorporation"
							label="State of Incorporation"
						/>
						<div className="col-span-2 mt-4">
							<FormTextInput
								name="otherInformation"
								label="Other Information"
								as="textarea"
								rows={4}
							/>
						</div>
					</FormSection>

					<div className="flex justify-end">
						<button
							type="submit"
							disabled={isSubmitting}
							className={`rounded-md bg-indigo-600 px-4 py-2 text-white ${
								isSubmitting
									? "cursor-not-allowed opacity-50"
									: "hover:bg-indigo-700"
							}`}
						>
							{isUploadingLogo
								? "Uploading Logo..."
								: isSubmitting
									? "Saving..."
									: "Save Company Information"}
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
}

interface TotalEmployeesFieldProps {
	name: string;
	className?: string;
}

function TotalEmployeesField({ name, className }: TotalEmployeesFieldProps) {
	const {
		values: { numberOfFullTimeEmployees, numberOfPartTimeEmployees },
		setFieldValue,
	} = useFormikContext<{
		numberOfFullTimeEmployees: number;
		numberOfPartTimeEmployees: number;
	}>();

	const [field, meta] = useField(name);

	useEffect(() => {
		const fullTime = Number(numberOfFullTimeEmployees) || 0;
		const partTime = Number(numberOfPartTimeEmployees) || 0;
		setFieldValue(name, fullTime + partTime);
	}, [
		numberOfFullTimeEmployees,
		numberOfPartTimeEmployees,
		setFieldValue,
		name,
	]);

	return (
		<div className="col-span-2">
			<label
				htmlFor={name}
				className="flex items-center gap-2 font-medium text-gray-700 text-sm"
			>
				Total Employees
				<span className="text-red-500">*</span>
			</label>
			<input
				{...field}
				id={name}
				type="number"
				disabled
				className={`mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 ${className}`}
			/>
			{meta.touched && meta.error && (
				<div className="text-red-600 text-sm">{meta.error}</div>
			)}
		</div>
	);
}
