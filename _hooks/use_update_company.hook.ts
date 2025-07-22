import { gql, useMutation } from "@apollo/client";
import type { Company, UpdateCompanyInput } from "./use_create_company.hook";

// Reuse the types from create company hook
type UpdateCompanyData = {
	updateCompany: {
		company: Company;
	};
};

type UpdateCompanyVars = {
	companyId: string;
	input: UpdateCompanyInput;
};

const UPDATE_COMPANY = gql`
  mutation UpdateCompany($companyId: ID!, $input: UpdateCompanyInput!) {
    updateCompany(companyId: $companyId, input: $input) {
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

export default function useUpdateCompany() {
	const [updateCompany, { data, loading, error }] = useMutation<
		UpdateCompanyData,
		UpdateCompanyVars
	>(UPDATE_COMPANY);

	return {
		updateCompany,
		data,
		loading,
		error,
	};
}
