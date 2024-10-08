// src/pages/SetupRole.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';

export default function SetupRole() {
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const { currentUser, fetchUserData } = useAuth();
    const navigate = useNavigate();

    const handleRoleSelection = async () => {
        try {
            setLoading(true);
            if (currentUser) {
                // Update user's role in Firestore
                await setDoc(doc(db, 'users', currentUser.uid), { role }, { merge: true });
                // Refresh user data to include the updated role
                await fetchUserData(currentUser.uid);
                navigate(role === 'employer' ? '/employer-dashboard' : '/student-dashboard');
            }
        } catch (error) {
            console.error("Error setting role:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Set Up Your Role</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Please select your role to continue.
                </p>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700">I am a:</label>
                        <div className="mt-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    value="student"
                                    checked={role === 'student'}
                                    onChange={() => setRole('student')}
                                    className="form-radio text-indigo-600"
                                />
                                <span className="ml-2">Student</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    type="radio"
                                    value="employer"
                                    checked={role === 'employer'}
                                    onChange={() => setRole('employer')}
                                    className="form-radio text-indigo-600"
                                />
                                <span className="ml-2">Employer</span>
                            </label>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={handleRoleSelection}
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? <Spinner /> : 'Continue'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
