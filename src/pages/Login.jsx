import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/Spinner'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login, currentUser, isSessionValid } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (currentUser && isSessionValid()) {
            // Navigate based on user role once user state is updated
            if (currentUser.role === 'student') {
                navigate('/student-dashboard')
            } else if (currentUser.role === 'employer') {
                navigate('/employer-dashboard')
            }
        }
    }, [currentUser, isSessionValid, navigate])

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            if (currentUser.role === 'student') {
                navigate('/student-dashboard')
            } else if (currentUser.role === 'employer') {
                navigate('/employer-dashboard')
            }
        } catch (error) {
            console.error("Login error:", error); // Log the error
            setError('Failed to log in: ' + error.message);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {loading ? <Spinner /> : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}


                    <div className="mt-6 text-center">
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Don&apos;t have an account? Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}