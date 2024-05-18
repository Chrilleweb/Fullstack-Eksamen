export const load = async (serverLoadEvent) => {
	const { fetch } = serverLoadEvent;
	const response = await fetch('http://localhost:8080/auth/home');
	const data = await response.json();
	const userName: string = data.userName;
	const userId: number = data.userId;
	const role: string = data.role;
	return {
		props: {
			userId,
			userName,
			role
		}
	};
};
export const ssr = true;
