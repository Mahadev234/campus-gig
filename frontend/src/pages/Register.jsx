import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/Spinner'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [role, setRole] = useState('student')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signup } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        if (password !== passwordConfirm) {
            return setError('Passwords do not match')
        }

        try {
            setError('')
            setLoading(true)
            await signup(email, password, role); // Pass the role to the signup function
            navigate(role === 'employer' ? '/employer-dashboard' : '/student-dashboard')
        } catch {
            setError('Failed to create an account')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
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
                            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    type="password"
                                    required
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
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

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {loading ? <Spinner /> : 'Sign up'}
                            </button>
                        </div>
                    </form>

                    {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}

                    <div className="mt-6 text-center">
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}