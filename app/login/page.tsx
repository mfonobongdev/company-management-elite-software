"use client";

import Container from "@/_components/container.component";
import PageHeader from "@/_components/page_header.component";
import LoginForm from "./login_form.comonent";

export default function Login() {
	return (
		<Container>
			<div className="grid h-full place-items-center">
				<div className="grid w-1/2 grid-cols-1 grid-rows-[max-content_1fr] gap-8">
					<PageHeader title="Login" />
					<LoginForm />
				</div>
			</div>
		</Container>
	);
}
