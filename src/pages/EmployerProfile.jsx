import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function EmployerProfileCreation() {
    const [companyName, setCompanyName] = useState('')
    const [industry, setIndustry] = useState('')
    const [companySize, setCompanySize] = useState('')
    const [website, setWebsite] = useState('')
    const [description, setDescription] = useState('')
    const [logo, setLogo] = useState(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { currentUser } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!companyName || !industry || !companySize || !website || !description) {
            setError('Please fill in all fields')
            return
        }

        try {
            let logoUrl = ''
            if (logo) {
                const storageRef = ref(storage, `company-logos/${currentUser.uid}`)
                await uploadBytes(storageRef, logo)
                logoUrl = await getDownloadURL(storageRef)
            }

            await setDoc(doc(db, 'employerProfiles', currentUser.uid), {
                companyName,
                industry,
                companySize,
                website,
                description,
                logoUrl,
                createdAt: new Date(),
                updatedAt: new Date()
            })

            navigate('/employer-dashboard')
        } catch (e) {
            setError('Error creating profile: ' + e.message)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Create Your Employer Profile</h1>
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
                        placeholder="Enter your company name"
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
                        placeholder="Enter your industry"
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
                        placeholder="https://www.example.com"
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
                        placeholder="Tell us about your company"
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="mb-6">
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
                </div>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Create Profile
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