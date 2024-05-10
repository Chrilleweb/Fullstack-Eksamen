export const load = async (serverLoadEvent) => {
	const { fetch } = serverLoadEvent;
	const response = await fetch('http://localhost:8080/auth/admin');
	const responseUsers = await fetch('http://localhost:8080/auth/admin/users');
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
