"use client";

import useIsValidSession from "@/_hooks/use_is_valid_session.hook";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
	const { checkingSession } = useIsValidSession();

	if (checkingSession) {
		return <div className="grid h-full place-items-center pt-52" />;
	}

	return <>{children}</>;
}
