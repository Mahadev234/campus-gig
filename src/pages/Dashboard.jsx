import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
    const [projects, setProjects] = useState([])
    const [timeEntries, setTimeEntries] = useState([])
    const [selectedProject, setSelectedProject] = useState('')
    const [hours, setHours] = useState('')
    const { currentUser } = useAuth()

    useEffect(() => {
        const fetchProjects = async () => {
            const q = query(collection(db, 'projects'), where('userId', '==', currentUser.uid))
            const querySnapshot = await getDocs(q)
            const projectList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setProjects(projectList)
        }

        const fetchTimeEntries = async () => {
            const q = query(collection(db, 'timeEntries'), where('userId', '==', currentUser.uid))
            const querySnapshot = await getDocs(q)
            const timeEntryList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setTimeEntries(timeEntryList)
        }

        fetchProjects()
        fetchTimeEntries()
    }, [currentUser])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedProject || !hours) return

        await addDoc(collection(db, 'timeEntries'), {
            projectId: selectedProject,
            hours: parseFloat(hours),
            userId: currentUser.uid,
            createdAt: serverTimestamp()
        })

        setSelectedProject('')
        setHours('')
        // Refetch time entries
        const q = query(collection(db, 'timeEntries'), where('userId', '==', currentUser.uid))
        const querySnapshot = await getDocs(q)
        const timeEntryList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setTimeEntries(timeEntryList)
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg leading-6 font-medium text-gray-900">Log Time</h2>
                    <form onSubmit={handleSubmit} className="mt-5 sm:flex sm:items-center">
                        <div className="w-full sm:max-w-xs">
                            <label htmlFor="project" className="sr-only">Project</label>
                            <select
                                id="project"
                                name="project"
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Select a project</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>{project.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full sm:max-w-xs mt-3 sm:mt-0 sm:ml-3">
                            <label htmlFor="hours" className="sr-only">Hours</label>
                            <input
                                type="number"
                                name="hours"
                                id="hours"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                placeholder="Hours worked"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Log Time
                        </button>
                    </form>
                </div>
            </div>
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Time Entries</h2>
                    <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {timeEntries.map((entry) => (
                            <li key={entry.id} className="col-span-1 flex shadow-sm rounded-md">
                                <div className="flex-shrink-0 flex items-center justify-center w-16 bg-indigo-600 text-white text-sm font-medium rounded-l-md">
                                    {entry.hours}h
                                </div>
                                <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                    <div className="flex-1 px-4 py-2 text-sm truncate">
                                        <a href="#" className="text-gray-900 font-medium hover:text-gray-600">
                                            {projects.find(p => p.id === entry.projectId)?.name}
                                        </a>
                                        <p className="text-gray-500">{new Date(entry.createdAt?.toDate()).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}