export const load = async (serverLoadEvent) => {
	const { fetch } = serverLoadEvent;
	let token = null;

	if (typeof localStorage !== 'undefined') {
		token = localStorage.getItem('token');
	}

	const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/home', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
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
export const prerender = true;
