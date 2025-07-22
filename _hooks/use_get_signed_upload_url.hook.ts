import { gql, useLazyQuery } from "@apollo/client";

type SignedLinkData = {
	url: string;
	key: string;
};

type SignedFileUploadInput = {
	contentType: string;
	fileName: string;
};

type GetSignedUploadUrlData = {
	getSignedUploadUrl: SignedLinkData;
};

type GetSignedUploadUrlVars = {
	input?: SignedFileUploadInput;
};

const GET_SIGNED_UPLOAD_URL = gql`
	query GetSignedUploadUrl($input: SignedFileUploadInput) {
		getSignedUploadUrl(input: $input) {
			key
			url
		}
	}
`;

export default function useGetSignedUploadUrl() {
	const [getSignedUploadUrl, { data, loading, error }] = useLazyQuery<
		GetSignedUploadUrlData,
		GetSignedUploadUrlVars
	>(GET_SIGNED_UPLOAD_URL);

	return {
		getSignedUploadUrl,
		data,
		loading,
		error,
	};
}
