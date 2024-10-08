import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function StudentProfileCreation() {
    const [fullName, setFullName] = useState('')
    const [university, setUniversity] = useState('')
    const [major, setMajor] = useState('')
    const [graduationYear, setGraduationYear] = useState('')
    const [skills, setSkills] = useState('')
    const [bio, setBio] = useState('')
    const [profilePicture, setProfilePicture] = useState(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { currentUser } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!fullName || !university || !major || !graduationYear || !skills || !bio) {
            setError('Please fill in all fields')
            return
        }

        try {
            let profilePictureUrl = ''
            if (profilePicture) {
                const storageRef = ref(storage, `profile-pictures/${currentUser.uid}`)
                await uploadBytes(storageRef, profilePicture)
                profilePictureUrl = await getDownloadURL(storageRef)
            }

            await setDoc(doc(db, 'studentProfiles', currentUser.uid), {
                fullName,
                university,
                major,
                graduationYear,
                skills: skills.split(',').map(skill => skill.trim()),
                bio,
                profilePictureUrl,
                createdAt: new Date(),
                updatedAt: new Date()
            })

            navigate('/student-dashboard')
        } catch (e) {
            setError('Error creating profile: ' + e.message)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Create Your Student Profile</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="mb-4">
                    <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your full name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="university" className="block text-gray-700 text-sm font-bold mb-2">
                        University
                    </label>
                    <input
                        type="text"
                        id="university"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your university"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="major" className="block text-gray-700 text-sm font-bold mb-2">
                        Major
                    </label>
                    <input
                        type="text"
                        id="major"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your major"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="graduationYear" className="block text-gray-700 text-sm font-bold mb-2">
                        Graduation Year
                    </label>
                    <input
                        type="number"
                        id="graduationYear"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your graduation year"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="skills" className="block text-gray-700 text-sm font-bold mb-2">
                        Skills (comma-separated)
                    </label>
                    <input
                        type="text"
                        id="skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="e.g., JavaScript, React, Node.js"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Tell us about yourself"
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="mb-6">
                    <label htmlFor="profilePicture" className="block text-gray-700 text-sm font-bold mb-2">
                        Profile Picture
                    </label>
                    <input
                        type="file"
                        id="profilePicture"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
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
                        onClick={() => navigate('/student-dashboard')}
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}