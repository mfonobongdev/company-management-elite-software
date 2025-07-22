"use client";
import Container from "@/_components/container.component";
import PageHeader from "@/_components/page_header.component";
import useAppStore from "@/_stores/app.store";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CompanyList from "./company_list.component";

export default function Home() {
	const router = useRouter();
	const { setIsAuthenticated, companies } = useAppStore();

	return (
		<Container>
			<div className="fixed top-0 right-0 left-0 z-10 bg-white shadow-sm">
				<div className="mx-auto flex w-full max-w-[55rem] justify-between gap-2 pt-8 pb-4">
					<div className="flex items-center gap-2">
						<PageHeader title="Companies" />
						<span className="mt-1 rounded-md bg-gray-200 px-2 py-1 font-bold text-sm">
							{companies.length}
						</span>
					</div>
					<button
						type="button"
						className="rounded-md bg-black/70 px-4 py-2 text-white hover:bg-red-500"
						onClick={() => {
							setIsAuthenticated(false);
							router.replace("/login");
							toast.success("Logged out successfully");
						}}
					>
						Logout
					</button>
				</div>
			</div>
			<div className="grid h-full grid-cols-1 grid-rows-[max-content_1fr] gap-3 pt-20">
				<div className="flex justify-end">
					<button
						type="button"
						className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
						onClick={() => {
							router.push("/");
						}}
					>
						<PlusCircleIcon className="h-6 w-6" />
						Add Company
					</button>
				</div>
				<CompanyList />
			</div>
		</Container>
	);
}
