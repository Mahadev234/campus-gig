import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function Chat() {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const { currentUser } = useAuth()

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('createdAt'), limit(50))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setMessages(messages)
        })
        return unsubscribe
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newMessage.trim() === '') return

        await addDoc(collection(db, 'messages'), {
            text: newMessage,
            createdAt: serverTimestamp(),
            uid: currentUser.uid,
            displayName: currentUser.displayName
        })

        setNewMessage('')
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Chat</h1>
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="p-4 h-96 overflow-y-auto">
                    {messages.map((message) => (
                        <div key={message.id} className={`mb-2 ${message.uid === currentUser.uid ? 'text-right' : ''}`}>
                            <span className="inline-block bg-gray-100 rounded-lg px-3 py-2 text-sm">
                                <strong>{message.displayName}: </strong>{message.text}
                            </span>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Send
                    </button>
                </form>
            </div>
        </div>
    )
}