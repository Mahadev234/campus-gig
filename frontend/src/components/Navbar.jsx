import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            await logout();
            navigate('/login');
        }
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <img className="h-10 w-auto" src="/cg-logo.png" alt="Campus Gig" />
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/jobs" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Jobs
                            </Link>
                            {currentUser && currentUser.role === 'student' && (
                                <Link to="/student-dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Dashboard
                                </Link>
                            )}
                            {currentUser && currentUser.role === 'employer' && (
                                <Link to="/employer-dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Employer Dashboard
                                </Link>
                            )}
                            {currentUser && (
                                <Link to="/chat" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Chat
                                </Link>
                            )}
                            {currentUser && (
                                <Link to="/account-settings" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Account Settings
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {currentUser ? (
                                <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-500 hover:text-gray-700">
                                        Login
                                    </Link>
                                    <Link to="/register" className="ml-4 text-gray-500 hover:text-gray-700">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                        {/* Mobile menu button */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                            >
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link to="/jobs" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                            Jobs
                        </Link>
                        {currentUser && currentUser.role === 'student' && (
                            <Link to="/student-dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                                Dashboard
                            </Link>
                        )}
                        {currentUser && currentUser.role === 'employer' && (
                            <Link to="/employer-dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                                Employer Dashboard
                            </Link>
                        )}
                        {currentUser && (
                            <Link to="/chat" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                                Chat
                            </Link>
                        )}
                        {currentUser && (
                            <Link to="/account-settings" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                                Account Settings
                            </Link>
                        )}
                        {currentUser ? (
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                                    Login
                                </Link>
                                <Link to="/register" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}