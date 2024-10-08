import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function StudentAccountSettings() {
    const [fullName, setFullName] = useState('')
    const [university, setUniversity] = useState('')
    const [major, setMajor] = useState('')
    const [graduationYear, setGraduationYear] = useState('')
    const [skills, setSkills] = useState('')
    const [bio, setBio] = useState('')
    const [profilePicture, setProfilePicture] = useState(null)
    const [currentProfilePictureUrl, setCurrentProfilePictureUrl] = useState('')
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
                const docRef = doc(db, 'studentProfiles', currentUser.uid)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setFullName(data.fullName)
                    setUniversity(data.university)
                    setMajor(data.major)
                    setGraduationYear(data.graduationYear)
                    setSkills(data.skills.join(', '))
                    setBio(data.bio)
                    setCurrentProfilePictureUrl(data.profilePictureUrl)
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
            const userDocRef = doc(db, 'studentProfiles', currentUser.uid)
            let profilePictureUrl = currentProfilePictureUrl

            if (profilePicture) {
                const storageRef = ref(storage, `profile-pictures/${currentUser.uid}`)
                await uploadBytes(storageRef, profilePicture)
                profilePictureUrl = await getDownloadURL(storageRef)
            }

            await updateDoc(userDocRef, {
                fullName,
                university,
                major,
                graduationYear,
                skills: skills.split(',').map(skill => skill.trim()),
                bio,
                profilePictureUrl,
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
                    <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
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
                    {currentProfilePictureUrl && (
                        <img src={currentProfilePictureUrl} alt="Current profile" className="mt-2 w-32 h-32 object-cover rounded-full" />
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