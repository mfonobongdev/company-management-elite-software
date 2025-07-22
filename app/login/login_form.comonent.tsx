"use client";

import FormTextInput from "@/_components/form_text_input.component";
import useAppStore from "@/_stores/app.store";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Yup from "yup";

export default function LoginForm() {
	const { setIsAuthenticated } = useAppStore();
	const loginSchema = Yup.object({
		username: Yup.string().required("Username is required").min(3),
		password: Yup.string().required("Password is required").min(5),
	});

	const initialValues: Yup.InferType<typeof loginSchema> = {
		username: "",
		password: "",
	};

	const router = useRouter();

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={loginSchema}
			validateOnBlur={false}
			validateOnChange={false}
			onSubmit={(values, { setSubmitting }) => {
				if (
					values.username === process.env.NEXT_PUBLIC_USERNAME &&
					values.password === process.env.NEXT_PUBLIC_PASSWORD
				) {
					setSubmitting(false);
					setIsAuthenticated(true);
					toast.success("Login successful");
					router.replace("/companies");
				} else {
					toast.error("Invalid username or password");
					setSubmitting(false);
				}
			}}
		>
			{({ errors, handleSubmit, isSubmitting }) => (
				<Form className="space-y-6" onSubmit={handleSubmit}>
					<FormTextInput
						name="username"
						label="Username"
						placeholder="name@example123"
					/>
					<FormTextInput
						name="password"
						label="Password"
						type="password"
						placeholder="********"
					/>
					<button
						className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 font-semibold text-sm/6 text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
						type="submit"
						disabled={isSubmitting}
					>
						Submit
					</button>
				</Form>
			)}
		</Formik>
	);
}
