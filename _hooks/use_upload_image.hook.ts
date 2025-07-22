import axios from "axios";
import useSWRMutation from "swr/mutation";

export const useUploadImage = () => {
	const { trigger, isMutating, data, error } = useSWRMutation(
		"/file-upload",
		(url: string, { arg }: { arg: { uploadUrl: string; file: File } }) =>
			uploadImage(arg.uploadUrl, arg.file),
	);

	return {
		trigger,
		isMutating,
		data,
		error,
	};
};

const uploadImage = async (url: string, file: File) => {
	try {
		const response = await axios.put(url, file, {
			headers: {
				"Content-Type": `${file.type}`,
			},
		});

		return response.data;
	} catch (error) {
		throw error;
	}
};
