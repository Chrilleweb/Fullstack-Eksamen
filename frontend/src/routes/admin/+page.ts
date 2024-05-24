export const load = async (serverLoadEvent) => {
	const { fetch } = serverLoadEvent;
	let token = null;

	if (typeof localStorage !== 'undefined') {
		token = localStorage.getItem('token');
	}

	const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/admin', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	const responseUsers = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/admin/users', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
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
