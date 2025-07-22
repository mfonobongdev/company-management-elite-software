import { gql, useMutation } from "@apollo/client";

type BasicAddressInput = {
	street: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;
};

type ContactInput = {
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
	mailingAddress?: BasicAddressInput;
	numberOfFullTimeEmployees?: number;
	numberOfPartTimeEmployees?: number;
	otherInformation?: string;
	primaryContactPerson?: ContactInput;
	registeredAddress?: BasicAddressInput;
	stateOfIncorporation?: string;
	totalNumberOfEmployees?: number;
	website?: string;
	isMailingAddressDifferentFromRegisteredAddress?: boolean;
};

export type UpdateCompanyInput = {
	email?: string;
	phone?: string;
	logoS3Key?: string;
	facebookCompanyPage?: string;
	fax?: string;
	industry?: string;
	legalName?: string;
	linkedInCompanyPage?: string;
	mailingAddress?: BasicAddressInput;
	numberOfFullTimeEmployees?: number;
	numberOfPartTimeEmployees?: number;
	otherInformation?: string;
	primaryContactPerson?: ContactInput;
	registeredAddress?: BasicAddressInput;
	stateOfIncorporation?: string;
	totalNumberOfEmployees?: number;
	website?: string;
	isMailingAddressDifferentFromRegisteredAddress?: boolean;
};

type CreateCompanyData = {
	createCompany: {
		company: Company;
	};
};

type CreateCompanyVars = {
	input: UpdateCompanyInput;
};

const CREATE_COMPANY = gql`
	mutation CreateCompany($input: UpdateCompanyInput!) {
		createCompany(input: $input) {
			company {
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
	}
`;

export default function useCreateCompany() {
	const [createCompany, { data, loading, error }] = useMutation<
		CreateCompanyData,
		CreateCompanyVars
	>(CREATE_COMPANY);

	return {
		createCompany,
		data,
		loading,
		error,
	};
}
