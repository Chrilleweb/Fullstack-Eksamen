export const load = async (serverLoadEvent) => {
	const { fetch } = serverLoadEvent;
	const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/home');
	const data = await response.json();
	const userName: string = data.userName;
	const userEmail: string = data.email;
	const userId: number = data.userId;
	const role: string = data.role;
	return {
		props: {
			userId,
			userName,
			userEmail,
			role
		}
	};
};
export const ssr = true;
