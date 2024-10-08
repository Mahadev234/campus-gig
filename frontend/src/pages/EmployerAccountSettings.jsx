import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function EmployerAccountSettings() {
    const [companyName, setCompanyName] = useState('')
    const [industry, setIndustry] = useState('')
    const [companySize, setCompanySize] = useState('')
    const [website, setWebsite] = useState('')
    const [description, setDescription] = useState('')
    const [logo, setLogo] = useState(null)
    const [currentLogoUrl, setCurrentLogoUrl] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()
    const { currentUser, updateEmail, updatePassword } = useAuth()

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const docRef = doc(db, 'employerProfiles', currentUser.uid)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setCompanyName(data.companyName)
                    setIndustry(data.industry)
                    setCompanySize(data.companySize)
                    setWebsite(data.website)
                    setDescription(data.description)
                    setCurrentLogoUrl(data.logoUrl)
                }
                setEmail(currentUser.email)
            }
        }
        fetchUserData()
    }, [currentUser])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        try {
            const userDocRef = doc(db, 'employerProfiles', currentUser.uid)
            let logoUrl = currentLogoUrl

            if (logo) {
                const storageRef = ref(storage, `company-logos/${currentUser.uid}`)
                await uploadBytes(storageRef, logo)
                logoUrl = await getDownloadURL(storageRef)
            }

            await updateDoc(userDocRef, {
                companyName,
                industry,
                companySize,
                website,
                description,
                logoUrl,
                updatedAt: new Date()
            })

            if (email !== currentUser.email) {
                await updateEmail(email)
            }

            if (password) {
                await updatePassword(password)
            }

            setSuccess('Profile updated successfully')
        } catch (e) {
            setError('Error updating profile: ' + e.message)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="mb-4">
                    <label htmlFor="companyName" className="block text-gray-700 text-sm font-bold mb-2">
                        Company Name
                    </label>
                    <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="industry" className="block text-gray-700 text-sm font-bold mb-2">
                        Industry
                    </label>
                    <input
                        type="text"
                        id="industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="companySize" className="block text-gray-700 text-sm font-bold mb-2">
                        Company Size
                    </label>
                    <select
                        id="companySize"
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501+">501+ employees</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="website" className="block text-gray-700 text-sm font-bold mb-2">
                        Website
                    </label>
                    <input
                        type="url"
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        Company Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="logo" className="block text-gray-700 text-sm font-bold mb-2">
                        Company Logo
                    </label>
                    <input
                        type="file"
                        id="logo"
                        onChange={(e) => setLogo(e.target.files[0])}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        accept="image/*"
                    />
                    {currentLogoUrl && (
                        <img src={currentLogoUrl} alt="Current logo" className="mt-2 w-32 h-32 object-contain" />
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        New Password (leave blank to keep current)
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                {success && <p className="text-green-500 text-xs italic mb-4">{success}</p>}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Update Profile
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/employer-dashboard')}
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}