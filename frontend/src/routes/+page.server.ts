import Cookies from 'js-cookie';
const token = Cookies.get('token');
export const load = async (serverLoadEvent) => {
	const { fetch } = serverLoadEvent;
	const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/home', {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': `Bearer ${token}`
		},
		credentials: 'include' // Ensure cookies are included in the request
	  });
	const data = await response.json();
	const userName: string = data.userName;
	const userId: number = data.userId;
	const role: string = data.role;
	console.log(response);
	console.log(data);
	console.log(token);
	return {
		props: {
			userId,
			userName,
			role
		}
	};
};
export const ssr = true;
