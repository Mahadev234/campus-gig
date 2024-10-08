import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function Chat() {
	const { gigId } = useParams();
	const { currentUser } = useAuth();
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');

	useEffect(() => {
		const messagesQuery = query(
			collection(db, 'messages'),
			where('gigId', '==', gigId),
			orderBy('createdAt', 'asc')
		);

		const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
			const fetchedMessages = [];
			querySnapshot.forEach((doc) => {
				fetchedMessages.push({ id: doc.id, ...doc.data() });
			});
			setMessages(fetchedMessages);
		});

		return () => unsubscribe();
	}, [gigId]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (newMessage.trim() === '') return;

		await addDoc(collection(db, 'messages'), {
			gigId,
			senderId: currentUser.uid,
			text: newMessage,
			createdAt: serverTimestamp(),
		});

		setNewMessage('');
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Chat for Gig ID: {gigId}</h1>
			<div className="bg-white p-4 rounded shadow mb-4">
				<div className="max-h-60 overflow-y-auto">
					{messages.map((message) => (
						<div key={message.id} className={`mb-2 ${message.senderId === currentUser.uid ? 'text-right' : 'text-left'}`}>
							<div className={`inline-block p-2 rounded ${message.senderId === currentUser.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
								<p>{message.text}</p>
								<p className="text-xs text-gray-500">{new Date(message.createdAt?.toDate()).toLocaleString()}</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<form onSubmit={handleSubmit} className="flex">
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Type a message..."
					className="flex-1 border rounded p-2"
				/>
				<button type="submit" className="bg-blue-500 text-white rounded px-4 ml-2">Send</button>
			</form>
		</div>
	);
}