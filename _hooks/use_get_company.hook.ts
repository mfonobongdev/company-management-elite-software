import { gql, useQuery } from "@apollo/client";

type BasicAddress = {
	street?: string;
	city?: string;
	state?: string;
	country?: string;
	zipCode?: string;
};

type Contact = {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
};

export type Company = {
	id: string;
	email?: string;
	phone?: string;
	logoS3Key?: string;
	facebookCompanyPage?: string;
	fax?: string;
	industry?: string;
	legalName?: string;
	linkedInCompanyPage?: string;
	mailingAddress?: BasicAddress;
	numberOfFullTimeEmployees?: number;
	numberOfPartTimeEmployees?: number;
	otherInformation?: string;
	primaryContactPerson?: Contact;
	registeredAddress?: BasicAddress;
	stateOfIncorporation?: string;
	totalNumberOfEmployees?: number;
	website?: string;
};

export type GetCompanyData = {
	getCompany: Company;
};

type GetCompanyVars = {
	id?: string;
};

const GET_COMPANY = gql`
	query GetCompany($id: String) {
		getCompany(id: $id) {
			id
			email
			phone
			logoS3Key
			facebookCompanyPage
			fax
			industry
			legalName
			linkedInCompanyPage
			mailingAddress {
				street
				city
				state
				country
				zipCode
			}
			numberOfFullTimeEmployees
			numberOfPartTimeEmployees
			otherInformation
			primaryContactPerson {
				firstName
				lastName
				email
				phone
			}
			registeredAddress {
				street
				city
				state
				country
				zipCode
			}
			stateOfIncorporation
			totalNumberOfEmployees
			website
		}
	}
`;

export default function useGetCompany({
	id,
	shouldFetch = true,
}: {
	id?: string;
	shouldFetch?: boolean;
}) {
	const { data, loading, error } = useQuery<GetCompanyData, GetCompanyVars>(
		GET_COMPANY,
		{
			variables: { id },
			skip: !shouldFetch,
		},
	);

	return {
		data,
		loading,
		error,
	};
}
