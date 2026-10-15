import { createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../Firebase/Firebase.config';
import useAxiosPublic from '../hooks/useAxiosPublic';

export const AuthContext = createContext(null)

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true); 
    const [loading, setLoading] = useState(false);            

    const axiosPublic = useAxiosPublic();

    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        setLoading(true);
        return signOut(auth);
    };

    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const githubLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, githubProvider);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    const refreshUser = () => {
        setUser({ ...auth.currentUser });
    };

    const authInfo = {
        user,
        loading,        
        initializing,   
        setLoading,
        login,
        register,
        logout,
        googleLogin,
        githubLogin,
        resetPassword,
        refreshUser     
    };

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userInfo = { email: currentUser.email };
                    const res = await axiosPublic.post('/jwt', userInfo);
                    if (res.data.token) {
                        localStorage.setItem('access-token', res.data.token);
                    }
                } catch (err) {
                    console.error('Failed to fetch JWT:', err);
                    localStorage.removeItem('access-token');
                }
            } else {
                localStorage.removeItem('access-token');
            }
            setUser(currentUser);
            setLoading(false);
            setInitializing(false); 
        });
        return () => unSubscribe();
    }, [axiosPublic]);

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;