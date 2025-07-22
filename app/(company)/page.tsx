"use client";

import BackLink from "@/_components/back_link.component";
import Container from "@/_components/container.component";
import { EmptyState } from "@/_components/empty_state.component";
import PageHeader from "@/_components/page_header.component";
import Spinner from "@/_components/spinner.component";
import useGetCompany, {
	type GetCompanyData,
} from "@/_hooks/use_get_company.hook";
import useGetSignedDownloadUrl from "@/_hooks/use_get_signed_download_url.hook";
import { useSearchParams } from "next/navigation";
import CompanyForm from "./company_form.component";

function transformCompanyData(data: GetCompanyData | undefined) {
	if (!data?.getCompany) return undefined;

	const company = data.getCompany;

	// Check if mailing address is different from registered address
	const isMailingAddressDifferent =
		company.registeredAddress?.street !== company.mailingAddress?.street ||
		company.registeredAddress?.city !== company.mailingAddress?.city ||
		company.registeredAddress?.state !== company.mailingAddress?.state ||
		company.registeredAddress?.country !== company.mailingAddress?.country ||
		company.registeredAddress?.zipCode !== company.mailingAddress?.zipCode;

	// Create registered address object
	const registeredAddress = {
		street: company.registeredAddress?.street || "",
		city: company.registeredAddress?.city || "",
		state: company.registeredAddress?.state || "",
		country: company.registeredAddress?.country || "",
		zipCode: company.registeredAddress?.zipCode || "",
	};

	// Only create mailing address if it's different
	const mailingAddress = isMailingAddressDifferent
		? {
				street: company.mailingAddress?.street || "",
				city: company.mailingAddress?.city || "",
				state: company.mailingAddress?.state || "",
				country: company.mailingAddress?.country || "",
				zipCode: company.mailingAddress?.zipCode || "",
			}
		: {
				street: "",
				city: "",
				state: "",
				country: "",
				zipCode: "",
			};

	return {
		...company,
		logo: null,
		isMailingAddressDifferentFromRegisteredAddress: isMailingAddressDifferent,
		mailingAddress,
		registeredAddress,
		primaryContactPerson: {
			firstName: company.primaryContactPerson?.firstName || "",
			lastName: company.primaryContactPerson?.lastName || "",
			email: company.primaryContactPerson?.email || "",
			phone: company.primaryContactPerson?.phone || "",
		},
		phone: company.phone || "",
	};
}

export default function Company() {
	const searchParams = useSearchParams();

	const companyIdFromParams = searchParams.get("companyID");
	const hasCompanyId = companyIdFromParams !== null;

	const companyId = hasCompanyId ? companyIdFromParams : undefined;

	const {
		data: companyData,
		loading,
		error,
	} = useGetCompany({
		id: companyId,
		shouldFetch: hasCompanyId,
	});

	const {
		data: logoData,
		loading: logoLoading,
		error: logoError,
	} = useGetSignedDownloadUrl({
		s3Key: companyData?.getCompany?.logoS3Key,
		shouldFetch: hasCompanyId && !!companyData?.getCompany?.logoS3Key,
	});

	if (loading || logoLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center pt-32">
				<Spinner />
			</div>
		);
	}

	if (error || logoError) {
		return (
			<div className="flex h-full w-full items-center justify-center pt-32">
				<EmptyState
					title="Error loading company"
					description={
						error?.message || logoError?.message || "Please try again later"
					}
				/>
			</div>
		);
	}

	return (
		<Container>
			<div className="fixed top-0 right-0 left-0 z-10 bg-white shadow-sm">
				<div className="mx-auto flex w-full max-w-[55rem] gap-2 pt-8 pb-4">
					<BackLink to="/companies" />
					<PageHeader title={hasCompanyId ? "Edit Company" : "Add Company"} />
				</div>
			</div>
			<div className="pt-28 pb-16">
				<CompanyForm
					companyId={companyId}
					initialValues={transformCompanyData(companyData)}
					logoUrl={logoData?.getSignedDownloadUrl?.url}
				/>
			</div>
		</Container>
	);
}
