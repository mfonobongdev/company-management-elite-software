import { EmptyState } from "@/_components/empty_state.component";
import type { Company } from "@/_hooks/use_create_company.hook";
import useAppStore from "@/_stores/app.store";
import { useRouter } from "next/navigation";

export default function CompanyList() {
	const { companies } = useAppStore();

	return (
		<div className="h-full w-full overflow-y-auto rounded-lg border border-gray-200 p-4">
			{companies.length <= 0 ? (
				<EmptyState
					title="No companies found"
					description="Add a company to get started"
				/>
			) : (
				companies.map((company) => (
					<CompanyListItem key={company.id} company={company} />
				))
			)}
		</div>
	);
}

function CompanyListItem({ company }: { company: Company }) {
	const router = useRouter();

	return (
		<div className="flex items-center justify-between border-gray-200 border-b py-4 text-sm">
			<div className="flex flex-col gap-1">
				<div>{capitalize(company?.legalName ?? "")}</div>
				<div className="font-mono text-gray-500 text-xs">{company.id}</div>
				<div className="font-mono text-gray-500 text-xs">
					{capitalize(company.mailingAddress?.city ?? "")}
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<div>
					{capitalize(company.primaryContactPerson?.firstName ?? "")}{" "}
					{capitalize(company.primaryContactPerson?.lastName ?? "")}
				</div>
				<div className="font-mono text-gray-500 text-xs">
					{company.primaryContactPerson?.email}
				</div>
				<div className="font-mono text-gray-500 text-xs">
					{company.primaryContactPerson?.phone}
				</div>
			</div>
			<button
				type="button"
				className="rounded-md bg-black/70 px-4 py-2 text-sm text-white hover:bg-blue-500"
				onClick={() => {
					router.push(`/?companyID=${company.id}`);
				}}
			>
				View
			</button>
		</div>
	);
}

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
