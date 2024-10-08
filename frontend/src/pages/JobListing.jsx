import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export default function JobListing() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchJobs = async () => {
            const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(20))
            const querySnapshot = await getDocs(q)
            const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setJobs(jobsData)
            setLoading(false)
        }

        fetchJobs()
    }, [])

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <Link key={job.id} to={`/job/${job.id}`} className="block">
                        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                            <p className="text-gray-600 mb-4">{job.description.substring(0, 100)}...</p>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>${job.budget}</span>
                                <span>{new Date(job.createdAt.toDate()).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}