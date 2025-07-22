"use client";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

export default function GraphqlProvider({
	children,
}: { children: React.ReactNode }) {
	const client = new ApolloClient({
		uri: "https://be2-fe-task-us-east-1-staging.dcsdevelopment.me/graphql",
		cache: new InMemoryCache(),
	});

	return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
