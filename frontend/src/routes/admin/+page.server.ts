export const load = async (serverLoadEvent) => {
	const { fetch } = serverLoadEvent;
	const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/admin');
	const responseUsers = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/admin/users');
	const data = await response.json();
	const dataUsers = await responseUsers.json();
	const userName: string = data.userName;
	const userId: number = data.userId;
	const userRole: string = data.role;
	return {
		props: {
			userId,
			userName,
			userRole,
			dataUsers
		}
	};
};
export const ssr = true;
