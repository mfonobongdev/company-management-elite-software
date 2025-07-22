import { gql, useQuery } from "@apollo/client";

type SignedLinkData = {
	url: string;
	key: string;
};

type GetSignedDownloadUrlData = {
	getSignedDownloadUrl: SignedLinkData;
};

type GetSignedDownloadUrlVars = {
	s3Key?: string;
};

const GET_SIGNED_DOWNLOAD_URL = gql`
	query GetSignedDownloadUrl($s3Key: String) {
		getSignedDownloadUrl(s3Key: $s3Key) {
			url
			key
		}
	}
`;

export default function useGetSignedDownloadUrl({
	s3Key,
	shouldFetch = true,
}: GetSignedDownloadUrlVars & {
	shouldFetch?: boolean;
}) {
	const { data, loading, error } = useQuery<
		GetSignedDownloadUrlData,
		GetSignedDownloadUrlVars
	>(GET_SIGNED_DOWNLOAD_URL, {
		variables: {
			s3Key,
		},
		skip: !shouldFetch,
	});

	return {
		data,
		loading,
		error,
	};
}
