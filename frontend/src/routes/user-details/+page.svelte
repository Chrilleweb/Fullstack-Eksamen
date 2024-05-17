<script>
    import { isAuthenticated, user } from '../../auth/auth';
    import ErrorAuth from '../../components/ErrorAuth.svelte';
    export let data;
	const username = data.props.userName;
	const userId = data.props.userId;
    const userEmail = data.props.userEmail;
	const userRole = data.props.role;
	user.set(username);
  </script>

<svelte:head>
	<title>User Details</title>
	<meta name="description" content="User details" />
</svelte:head>
  
{#if userId && isAuthenticated}
<div class="container mx-auto pt-6 px-6 bg-white shadow-md rounded-lg mt-10">
    <h1 class="text-3xl font-bold mb-4">User Details</h1>
    <div class="mb-4">
        <p><span class="font-semibold">Username:</span> {username}</p>
        <p><span class="font-semibold">Email:</span> {userEmail}</p>
        <p><span class="font-semibold">Role:</span> {userRole}</p>
    </div>
</div>
{:else}
<ErrorAuth />
{/if}

  