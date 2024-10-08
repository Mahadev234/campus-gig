import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'
import { ChartBarIcon, CurrencyDollarIcon, BriefcaseIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline'

export default function StudentDashboard() {
    const { currentUser } = useAuth()
    const [activeGigs, setActiveGigs] = useState([])
    const [completedGigs, setCompletedGigs] = useState([])
    const [earnings, setEarnings] = useState(0)
    const [rating, setRating] = useState(0)

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (currentUser) {
                const activeGigsQuery = query(
                    collection(db, 'gigs'),
                    where('studentId', '==', currentUser.uid),
                    where('status', '==', 'active'),
                    orderBy('createdAt', 'desc'),
                    limit(5)
                )

                const completedGigsQuery = query(
                    collection(db, 'gigs'),
                    where('studentId', '==', currentUser.uid),
                    where('status', '==', 'completed'),
                    orderBy('completedAt', 'desc'),
                    limit(5)
                )

                const [activeGigsSnapshot, completedGigsSnapshot] = await Promise.all([
                    getDocs(activeGigsQuery),
                    getDocs(completedGigsQuery)
                ])

                const activeGigsData = activeGigsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                const completedGigsData = completedGigsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

                setActiveGigs(activeGigsData)

                const totalEarnings = completedGigsData.reduce((total, gig) => total + gig.payment, 0)
                setEarnings(totalEarnings)

                const totalRating = completedGigsData.reduce((total, gig) => total + (gig.rating || 0), 0)
                const averageRating = totalRating / completedGigsData.length || 0
                setRating(averageRating.toFixed(1))
                setCompletedGigs(completedGigsData)
            }
        }

        fetchDashboardData()
    }, [currentUser])

    const stats = [
        { name: 'Active Gigs', value: activeGigs.length, icon: BriefcaseIcon },
        { name: 'Completed Gigs', value: completedGigs.length, icon: ChartBarIcon },
        { name: 'Total Earnings', value: `$${earnings.toFixed(2)}`, icon: CurrencyDollarIcon },
        { name: 'Average Rating', value: rating, icon: StarIcon },
    ]

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>

                    {/* Stats */}
                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((item) => (
                            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                                                <dd className="text-lg font-medium text-gray-900">{item.value}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Active Gigs */}
                    <div className="mt-8">
                        <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                            <h2 className="text-lg leading-6 font-medium text-gray-900 px-6 py-4 bg-gray-50">Active Gigs</h2>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {activeGigs.map((gig) => (
                                        <tr key={gig.id} className="bg-white">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <Link to={`/gig/${gig.id}`} className="hover:text-indigo-600">{gig.title}</Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{gig.clientName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                {new Date(gig.dueDate.toDate()).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">${gig.payment.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Completed Gigs */}
                    <div className="mt-8">
                        <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                            <h2 className="text-lg leading-6 font-medium text-gray-900 px-6 py-4 bg-gray-50">Completed Gigs</h2>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Date</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {completedGigs.map((gig) => (
                                        <tr key={gig.id} className="bg-white">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <Link to={`/gig/${gig.id}`} className="hover:text-indigo-600">{gig.title}</Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{gig.clientName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                {new Date(gig.completedAt.toDate()).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">${gig.payment.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                <div className="flex items-center justify-end">
                                                    <StarIcon className="h-5 w-5 text-yellow-400" />
                                                    <span className="ml-1">{gig.rating || 'N/A'}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h2>
                        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <BriefcaseIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <Link to="/jobs" className="font-medium text-gray-900 hover:text-indigo-600">
                                                Browse Available Gigs
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <ClockIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <Link to="/time-tracker" className="font-medium text-gray-900 hover:text-indigo-600">
                                                Time Tracker
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <CurrencyDollarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <Link to="/earnings" className="font-medium text-gray-900 hover:text-indigo-600">
                                                View Detailed Earnings
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}