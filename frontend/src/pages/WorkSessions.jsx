import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export default function WorkSessions() {
    const { gigId } = useParams()
    const [workSessions, setWorkSessions] = useState([])

    useEffect(() => {
        const q = query(
            collection(db, 'workSessions'),
            where('gigId', '==', gigId)
        )

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const sessions = []
            querySnapshot.forEach((doc) => {
                sessions.push({ id: doc.id, ...doc.data() })
            })
            setWorkSessions(sessions)
        })

        return () => unsubscribe()
    }, [gigId])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Work Sessions for Gig {gigId}</h1>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Student ID</th>
                        <th className="border border-gray-300 px-4 py-2">Duration (seconds)</th>
                        <th className="border border-gray-300 px-4 py-2">Screenshots</th>
                    </tr>
                </thead>
                <tbody>
                    {workSessions.map((session) => (
                        <tr key={session.id}>
                            <td className="border border-gray-300 px-4 py-2">{session.userId}</td>
                            <td className="border border-gray-300 px-4 py-2">{session.duration}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {session.screenshots && session.screenshots.length > 0 ? (
                                    <a href={session.screenshots[0]} target="_blank" rel="noopener noreferrer">View Screenshot</a>
                                ) : (
                                    'No Screenshots'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}