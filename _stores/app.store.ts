import type { Company } from "@/_hooks/use_create_company.hook";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppStore {
	isAuthenticated: boolean;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	companies: Company[];
	addCompany: (company: Company) => void;
	updateCompany: (company: Company) => void;
}

export const useAppStore = create<AppStore>()(
	persist(
		(set) => ({
			isAuthenticated: false,
			setIsAuthenticated: (isAuthenticated: boolean) =>
				set({ isAuthenticated }),
			companies: [],
			addCompany: (company: Company) =>
				set((state) => ({ companies: [...state.companies, company] })),
			updateCompany: (company: Company) =>
				set((state) => ({
					companies: state.companies.map((c) =>
						c.id === company.id ? company : c,
					),
				})),
		}),
		{
			name: "app-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export default useAppStore;
