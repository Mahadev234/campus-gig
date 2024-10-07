import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export default function PostJob() {
    const { currentUser } = useAuth()
    const [job, setJob] = useState({
        title: '',
        description: '',
        budget: '',
        skills: [],
    })
    const [newSkill, setNewSkill] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await addDoc(collection(db, 'jobs'), {
                ...job,
                budget: parseFloat(job.budget),
                userId: currentUser.uid,
                createdAt: serverTimestamp(),
            })
            alert('Job posted successfully!')
            setJob({ title: '', description: '', budget: '', skills: [] })
        } catch (error) {
            console.error('Error posting job: ', error)
            alert('An error occurred while posting the job.')
        }
    }

    const addSkill = () => {
        if (newSkill && !job.skills.includes(newSkill)) {
            setJob(prev => ({ ...prev, skills: [...prev.skills, newSkill] }))
            setNewSkill('')
        }
    }

    const removeSkill = (skillToRemove) => {
        setJob(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }))
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Post a New Job</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Provide details about the job you want to post.
                        </p>
                    </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        required
                                        value={job.title}
                                        onChange={(e) => setJob({ ...job, title: e.target.value })}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Job Description
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={3}
                                            required
                                            value={job.description}
                                            onChange={(e) => setJob({ ...job, description: e.target.value })}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                            placeholder="Describe the job requirements and expectations"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                                        Budget
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="budget"
                                            id="budget"
                                            required
                                            value={job.budget}
                                            onChange={(e) => setJob({ ...job, budget: e.target.value })}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                                        Required Skills
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="skills"
                                            id="skills"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                                            placeholder="Add a required skill"
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
                                        {job.skills.map((skill, index) => (
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
                                    Post Job
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}