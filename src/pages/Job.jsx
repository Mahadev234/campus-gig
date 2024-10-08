import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function Job() {
    const { id } = useParams()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchJob = async () => {
            const docRef = doc(db, 'jobs', id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setJob({ id: docSnap.id, ...docSnap.data() })
            } else {
                console.log('No such document!')
            }
            setLoading(false)
        }

        fetchJob()
    }, [id])

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (!job) {
        return <div className="text-center mt-8">Job not found</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{job.title}</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <p className="text-gray-600 mb-4">{job.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <h3 className="font-semibold text-gray-700">Budget</h3>
                        <p className="text-gray-600">${job.budget}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-700">Posted On</h3>
                        <p className="text-gray-600">{new Date(job.createdAt.toDate()).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-700">Duration</h3>
                        <p className="text-gray-600">{job.duration}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-700">Skills Required</h3>
                        <p className="text-gray-600">{job.skills.join(', ')}</p>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <Link to={`/apply/${job.id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Apply for this job
                    </Link>
                    <button onClick={() => window.history.back()} className="text-gray-600 hover:text-gray-800">
                        Back to jobs
                    </button>
                </div>
            </div>
        </div>
    )
}