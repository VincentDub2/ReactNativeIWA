/**
 * Recupére l'adresse de l'API
 * @returns L'adresse de l'API
 */
export const getApiUrl = (): string => {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;
	if (!apiUrl && process.env.NODE_ENV !== "development") {
		throw new Error("L'adresse de l'API n'est pas définie");
	} else if (!apiUrl) {
		return "http://localhost:8090/api/v1";
	}
	return process.env.EXPO_PUBLIC_API_URL as string;
};
