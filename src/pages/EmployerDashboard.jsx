import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { BriefcaseIcon, UserGroupIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function EmployerDashboard() {
    const { currentUser } = useAuth();
    const [activeGigs, setActiveGigs] = useState([]);
    const [completedGigs, setCompletedGigs] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalHired, setTotalHired] = useState(0);
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (currentUser) {
                const activeGigsQuery = query(
                    collection(db, 'gigs'),
                    where('employerId', '==', currentUser.uid),
                    where('status', '==', 'active'),
                    orderBy('createdAt', 'desc'),
                    limit(5)
                );

                const completedGigsQuery = query(
                    collection(db, 'gigs'),
                    where('employerId', '==', currentUser.uid),
                    where('status', '==', 'completed'),
                    orderBy('completedAt', 'desc'),
                    limit(5)
                );

                const [activeGigsSnapshot, completedGigsSnapshot] = await Promise.all([
                    getDocs(activeGigsQuery),
                    getDocs(completedGigsQuery)
                ]);

                const activeGigsData = activeGigsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const completedGigsData = completedGigsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setActiveGigs(activeGigsData);
                setCompletedGigs(completedGigsData);

                const spent = completedGigsData.reduce((total, gig) => total + gig.payment, 0);
                setTotalSpent(spent);
            }
        };

        fetchDashboardData();
    }, [currentUser]);

    const handleFilterChange = (e) => {
        setFilterDate(e.target.value);
    };

    const filteredActiveGigs = activeGigs.filter(gig => {
        if (!filterDate) return true;
        return new Date(gig.dueDate.toDate()).toLocaleDateString() === new Date(filterDate).toLocaleDateString();
    });

    const stats = [
        { name: 'Active Gigs', value: filteredActiveGigs.length, icon: BriefcaseIcon },
        { name: 'Completed Gigs', value: completedGigs.length, icon: ClockIcon },
        { name: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: CurrencyDollarIcon },
        { name: 'Students Hired', value: totalHired, icon: UserGroupIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">Employer Dashboard</h1>

                    {/* Filter by Due Date */}
                    <div className="mt-5">
                        <input
                            type="date"
                            value={filterDate}
                            onChange={handleFilterChange}
                            className="border rounded p-2"
                        />
                    </div>

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
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredActiveGigs.map((gig) => (
                                        <tr key={gig.id} className="bg-white">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <Link to={`/gig/${gig.id}`} className="hover:text-indigo-600">{gig.title}</Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{gig.studentName}</td>
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
                                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{gig.studentName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                {new Date(gig.completedAt.toDate()).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">${gig.payment.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                {gig.rating ? `${gig.rating}/5` : 'Not rated'}
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
                                            <Link to="/post-gig" className="font-medium text-gray-900 hover:text-indigo-600">
                                                Post a New Gig
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <UserGroupIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <Link to="/browse-students" className="font-medium text-gray-900 hover:text-indigo-600">
                                                Browse Students
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
                                            <Link to="/payment-history" className="font-medium text-gray-900 hover:text-indigo-600">
                                                View Payment History
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Link to Work Sessions */}
                    <div className="mt-8">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">Work Sessions</h2>
                        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {activeGigs.map((gig) => (
                                <div key={gig.id} className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <ClockIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <Link to={`/work-sessions/${gig.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                                                    View Work Sessions for {gig.title}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}