import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export default function JobListing() {
    const [jobs, setJobs] = useState([])

    useEffect(() => {
        const fetchJobs = async () => {
            const jobsCollection = collection(db, 'jobs')
            const jobSnapshot = await getDocs(jobsCollection)
            const jobList = jobSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setJobs(jobList)
        }

        fetchJobs()
    }, [])

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Jobs</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{job.title}</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">{job.description}</p>
                            <p className="mt-2 text-sm text-gray-500">Budget: ${job.budget}</p>
                            <button className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Apply
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}