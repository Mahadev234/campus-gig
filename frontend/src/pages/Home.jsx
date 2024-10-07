import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
// Updated import path for Heroicons v2
import { UserIcon, BriefcaseIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/outline'
import freelancerLogo from '../assets/freelancer.png' // Import the image
import fiverrLogo from '../assets/fiverr.png' // Import the image
import upworkLogo from '../assets/upwork.png' // Import the image
import toptalLogo from '../assets/toptal.png' // Import the image
import weworkremotelyLogo from '../assets/weworkremotely.png' // Import the image

export default function Home() {
    const { currentUser } = useAuth()

    const stats = [
        { name: 'Active Students', stat: '5,000+', icon: UserIcon },
        { name: 'Completed Gigs', stat: '10,000+', icon: BriefcaseIcon },
        { name: 'Average Earnings', stat: '$500/month', icon: CurrencyDollarIcon },
        { name: 'Client Satisfaction', stat: '4.8/5', icon: StarIcon },
    ]

    return (
        <div className="bg-white">
            <main>
                {/* Hero section */}
                <div className="relative">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100"></div>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
                            <div className="absolute inset-0">
                                <img
                                    className="h-full w-full object-cover"
                                    src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100"
                                    alt="Students collaborating"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-700 mix-blend-multiply"></div>
                            </div>
                            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                                <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                    <span className="block text-white">Exclusive Freelancing Platform</span>
                                    <span className="block text-indigo-200">for Students</span>
                                </h1>
                                <p className="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-200 sm:max-w-3xl">
                                    Empowering Students to Kickstart Their Freelancing Journey
                                </p>
                                <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                                    {currentUser ? (
                                        <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                                            <Link
                                                to="/jobs"
                                                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8"
                                            >
                                                Browse Gigs
                                            </Link>
                                            <Link
                                                to="/post-job"
                                                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 sm:px-8"
                                            >
                                                Post a Gig
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                                            <Link
                                                to="/register"
                                                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8"
                                            >
                                                Get started
                                            </Link>
                                            <Link
                                                to="/login"
                                                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 sm:px-8"
                                            >
                                                Log in
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats section */}
                <div className="bg-gray-50 pt-12 sm:pt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                Trusted by students across universities
                            </h2>
                            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus repellat laudantium.
                            </p>
                        </div>
                    </div>
                    <div className="mt-10 pb-12 bg-white sm:pb-16">
                        <div className="relative">
                            <div className="absolute inset-0 h-1/2 bg-gray-50" />
                            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="max-w-4xl mx-auto">
                                    <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-4">
                                        {stats.map((item) => (
                                            <div key={item.name} className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">{item.name}</dt>
                                                <dd className="order-1 text-4xl font-extrabold text-indigo-600">
                                                    <item.icon className="h-8 w-8 mx-auto mb-2" aria-hidden="true" />
                                                    {item.stat}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Who We Are section */}
                <div className="bg-white">
                    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Who We Are</h2>
                            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                                Bridging the Gap
                            </p>
                            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                                Our platform is designed to bridge the gap between students and freelancing opportunities. We provide a unique space where students can connect with each other and with professionals looking for talented individuals.
                            </p>
                        </div>
                    </div>
                </div>

                {/* What We Offer section */}
                <div className="bg-gray-50">
                    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">What We Offer</h2>
                            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                                Two Types of Work Opportunities
                            </p>
                        </div>
                        <div className="mt-12 grid gap-8 md:grid-cols-2">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Student-to-Student</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Collaborate on projects, share skills, and gain real-world experience.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Employees-to-Student</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Get hired by professionals and businesses seeking fresh, innovative talent.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us section */}
                <div className="bg-white">
                    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Why Choose Us</h2>
                            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                                Empowering Students
                            </p>
                        </div>
                        <div className="mt-12 grid gap-8 md:grid-cols-2">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Zero Freelancing Fees</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        We believe in empowering students without financial barriers. That's why we charge no fees for freelancing.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Minimal Commission</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        To keep our platform sustainable, we only take a small 3-5% commission based on the gig.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparison with other platforms */}
                <div className="bg-gray-50">
                    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">How We Compare</h2>
                            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                                Leading Freelancing Platforms
                            </p>
                        </div>
                        <div className="mt-12 grid gap-8 md:grid-cols-3 lg:grid-cols-5">
                            {[ // Update the logos to use the imported image
                                { name: 'Freelancer', logo: freelancerLogo },
                                { name: 'Fiverr', logo: fiverrLogo },
                                { name: 'Upwork', logo: upworkLogo },
                                { name: 'Toptal', logo: toptalLogo },
                                { name: 'We Work Remotely', logo: weworkremotelyLogo },
                            ].map((platform) => (
                                <div key={platform.name} className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <img src={platform.logo} alt={platform.name} className="h-12 w-auto mx-auto" />
                                        <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900 text-center">{platform.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}