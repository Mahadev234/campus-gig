import { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginTime, setLoginTime] = useState(null);

    async function signup(email, password, role) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;
        await setDoc(doc(db, 'users', userId), { role }); // Set the role based on the parameter
        setCurrentUser({ ...userCredential.user });
        setLoginTime(Date.now());
    }

    async function login(email, password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;
        await fetchUserData(userId);
        setLoginTime(Date.now());
    }

    async function fetchUserData(userId) {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            setCurrentUser({ ...userData, uid: userId });
        } else {
            console.error("No such document!");
            setCurrentUser(null);
        }
    }

    function logout() {
        setCurrentUser(null);
        setLoginTime(null);
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await fetchUserData(user.uid);
                const currentTime = Date.now();
                if (loginTime && (currentTime - loginTime) > 90 * 60 * 1000) {
                    // TTL expired, log out the user
                    await logout();
                } else {
                    setLoginTime(currentTime); // Update login time
                }
            } else {
                setCurrentUser(null);
                setLoginTime(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [loginTime]);

    const isSessionValid = () => {
        if (!loginTime) return false;
        const currentTime = Date.now();
        return (currentTime - loginTime) <= 90 * 60 * 1000; // 90 minutes
    };

    const value = {
        currentUser,
        login,
        signup,
        logout,
        isSessionValid
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};