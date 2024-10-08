import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function WorkTracker() {
    const { gigId } = useParams()
    const { currentUser } = useAuth()
    const [isTracking, setIsTracking] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [screenshots, setScreenshots] = useState([])
    const [keyPressCount, setKeyPressCount] = useState(0)
    const [activityRating, setActivityRating] = useState(0)
    const intervalRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(() => {
        if (gigId && currentUser) {
            const q = query(
                collection(db, 'workSessions'),
                where('gigId', '==', gigId),
                where('userId', '==', currentUser.uid),
                orderBy('startTime', 'desc')
            )

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const fetchedScreenshots = []
                querySnapshot.forEach((doc) => {
                    if (doc.data().screenshots) {
                        fetchedScreenshots.push(...doc.data().screenshots)
                    }
                })
                setScreenshots(fetchedScreenshots)
            })

            return () => unsubscribe()
        }
    }, [gigId, currentUser])

    const startTracking = () => {
        setIsTracking(true)
        setElapsedTime(0)
        setKeyPressCount(0)
        intervalRef.current = setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1)
        }, 1000)
        captureScreenshot()
        document.addEventListener('keydown', handleKeyPress);
    }

    const stopTracking = async () => {
        setIsTracking(false)
        clearInterval(intervalRef.current)
        document.removeEventListener('keydown', handleKeyPress);

        try {
            await addDoc(collection(db, 'workSessions'), {
                gigId,
                userId: currentUser.uid,
                startTime: serverTimestamp(),
                duration: elapsedTime,
                screenshots: screenshots,
                keyPressCount: keyPressCount,
            })
        } catch (error) {
            console.error("Error saving work session:", error)
        }
    }

    const handleKeyPress = () => {
        setKeyPressCount(prevCount => prevCount + 1);
    }

    useEffect(() => {
        // Update activity rating based on key presses
        const rating = Math.min(Math.floor(keyPressCount / 10), 5); // Adjust the divisor for sensitivity
        setActivityRating(rating);
    }, [keyPressCount]);

    const captureScreenshot = async () => {
        const video = document.createElement('video')
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
            video.srcObject = stream
            video.onloadedmetadata = () => {
                video.play()
                canvasRef.current.width = video.videoWidth
                canvasRef.current.height = video.videoHeight
                canvasRef.current.getContext('2d').drawImage(video, 0, 0)
                stream.getTracks().forEach(track => track.stop())
                canvasRef.current.toBlob(async (blob) => {
                    const screenshotRef = ref(storage, `screenshots/${gigId}/${Date.now()}.jpg`)
                    await uploadBytes(screenshotRef, blob)
                    const downloadURL = await getDownloadURL(screenshotRef)
                    setScreenshots(prevScreenshots => [...prevScreenshots, downloadURL])
                })
            }
        } catch (error) {
            console.error("Error capturing screenshot:", error)
        }
    }

    useEffect(() => {
        let screenshotInterval
        if (isTracking) {
            screenshotInterval = setInterval(captureScreenshot, 5 * 60 * 1000) // Capture every 5 minutes
        }
        return () => clearInterval(screenshotInterval)
    }, [isTracking])

    return (
        <div className="container mx-auto p-4">
            <Link to={`/gig/${gigId}`} className="flex items-center mb-4 text-blue-500 hover:underline">
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Back to Gig
            </Link>
            <h1 className="text-2xl font-bold mb-4">Work Tracker</h1>
            <div className="mb-4">
                <p className="text-xl">
                    Time Tracked: {Math.floor(elapsedTime / 3600)}h {Math.floor((elapsedTime % 3600) / 60)}m {elapsedTime % 60}s
                </p>
            </div>
            <div className="mb-4">
                <p className="text-xl">
                    Keyboard Activity: {activityRating} {Array(activityRating).fill('⭐').join('')}
                </p>
            </div>
            <div className="mb-4">
                {!isTracking ? (
                    <button
                        onClick={startTracking}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Start Tracking
                    </button>
                ) : (
                    <button
                        onClick={stopTracking}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Stop Tracking
                    </button>
                )}
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Screenshots</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {screenshots.map((screenshot, index) => (
                        <img key={index} src={screenshot} alt={`Screenshot ${index + 1}`} className="w-full h-auto" />
                    ))}
                </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    )
}