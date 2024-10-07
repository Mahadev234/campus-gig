import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function Profile() {
    const { currentUser } = useAuth()
    const [profile, setProfile] = useState({
        displayName: '',
        bio: '',
        skills: [],
    })
    const [newSkill, setNewSkill] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            const docRef = doc(db, 'users', currentUser.uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setProfile(docSnap.data())
            }
        }
        fetchProfile()
    }, [currentUser])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const userRef = doc(db, 'users', currentUser.uid)
        await updateDoc(userRef, profile)
        alert('Profile updated successfully!')
    }

    const addSkill = () => {
        if (newSkill && !profile.skills.includes(newSkill)) {
            setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill] }))
            setNewSkill('')
        }
    }

    const removeSkill = (skillToRemove) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }))
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            This information will be displayed publicly so be careful what you share.
                        </p>
                    </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                <div>
                                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        name="displayName"
                                        id="displayName"
                                        value={profile.displayName}
                                        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                        Bio
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows={3}
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                            placeholder="A short bio about yourself"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                                        Skills
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="skills"
                                            id="skills"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                                            placeholder="Add a skill"
                                        />
                                        <button
                                            type="button"
                                            onClick={addSkill}
                                            className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {profile.skills.map((skill, index) => (
                                            <span key={index} className="inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-indigo-100 text-indigo-700">
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(skill)}
                                                    className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                                                >
                                                    <span className="sr-only">Remove {skill}</span>
                                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}