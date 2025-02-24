import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useAuth = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("Redirecting to /auth/sign-in");  // Check if this runs
            router.push('/auth/sign-in');
        } else {
            setAuthenticated(true);
            console.log("Redirecting to /account");  // Check if this runs
            router.push('/account');
        }
    }, []);

    return authenticated;
};

export default useAuth;
