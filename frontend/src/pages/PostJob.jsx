import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function PostJob() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [budget, setBudget] = useState('')
    const [duration, setDuration] = useState('')
    const [skills, setSkills] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { currentUser } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!title || !description || !budget || !duration || !skills) {
            setError('Please fill in all fields')
            return
        }

        try {
            const docRef = await addDoc(collection(db, 'jobs'), {
                title,
                description,
                budget: parseFloat(budget),
                duration,
                skills: skills.split(',').map(skill => skill.trim()),
                createdAt: serverTimestamp(),
                employerId: currentUser.uid
            })
            console.log('Document written with ID: ', docRef.id)
            navigate('/jobs')
        } catch (e) {
            setError('Error adding document: ' + e.message)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                        Job Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter job title"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        Job Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter job description"
                        rows="4"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="budget" className="block text-gray-700 text-sm font-bold mb-2">
                        Budget ($)
                    </label>
                    <input
                        type="number"
                        id="budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter budget"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">
                        Duration
                    </label>
                    <input
                        type="text"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="e.g., 2 weeks, 1 month"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="skills" className="block text-gray-700 text-sm font-bold mb-2">
                        Required Skills (comma-separated)
                    </label>
                    <input
                        type="text"
                        id="skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="e.g., React, Node.js, MongoDB"
                    />
                </div>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Post Job
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/jobs')}
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}