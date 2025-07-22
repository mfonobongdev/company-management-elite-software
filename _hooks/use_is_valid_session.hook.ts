import useAppStore from "@/_stores/app.store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useIsValidSession() {
	const isAuthenticated = useAppStore.getState().isAuthenticated;
	const router = useRouter();
	const pathname = usePathname();
	const [checkingSession, setCheckingSession] = useState(true);

	// Handle initial auth check
	// when the user comes from the url
	useEffect(() => {
		const handleAuth = () => {
			// Public routes that don't require authentication
			const publicRoutes = ["/login"];
			const isPublicRoute = publicRoutes.includes(pathname);

			// Determine if we need to redirect
			const needsAuthRedirect = !isAuthenticated && !isPublicRoute;
			const needsLoginRedirect = isAuthenticated && pathname === "/login";

			if (needsAuthRedirect) {
				router.replace("/login");
			} else if (needsLoginRedirect) {
				router.replace("/companies");
			} else {
				// Only set checkingSession to false if we're staying on the current page
				setCheckingSession(false);
			}
		};

		handleAuth();
	}, [isAuthenticated, pathname, router]);

	// Handle browser back/forward navigation
	useEffect(() => {
		// Function to handle popstate (browser back/forward buttons)
		const handlePopState = () => {
			// Immediately set checking to true to prevent content flash
			setCheckingSession(true);

			// Check if the new URL requires authentication
			const currentPath = window.location.pathname;
			const publicRoutes = ["/login"];
			const isPublicRoute = publicRoutes.some((route) =>
				currentPath.startsWith(route),
			);

			if (!isAuthenticated && !isPublicRoute) {
				// Redirect immediately if authentication is needed
				window.location.replace("/login");
			} else if (isAuthenticated && currentPath === "/login") {
				window.location.replace("/companies");
			} else {
				// We can stay on this page
				setCheckingSession(false);
			}
		};

		// Add event listener for back/forward navigation
		window.addEventListener("popstate", handlePopState);

		// Clean up
		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, [isAuthenticated]);

	return { checkingSession };
}
