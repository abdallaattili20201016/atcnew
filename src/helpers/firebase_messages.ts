// import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp, serverTimestamp, doc, getDoc } from "firebase/firestore";
// import { db } from "./config";

// interface Message {
//   id: string;
//   senderId: string;
//   recipientId: string;
//   content: string;
//   senderName?: string;
//   recipientName?: string;
//   timestamp: Timestamp | string;
// }

// export const fetchMessagesForUser = async (userId: string): Promise<Message[]> => {
//   const q = query(
//     collection(db, "Messages"),
//     where("senderId", "==", userId),
//     orderBy("timestamp", "desc")
//   );

//   const snapshot = await getDocs(q);

//   return snapshot.docs.map((doc) => {
//     const data = doc.data();
//     return {
//       id: doc.id,
//       ...data,
//     } as Message;
//   });
// };

// export const sendMessage = async (senderId: string, recipientId: string, content: string) => {
//   const newMessage = {
//     senderId,
//     recipientId,
//     content,
//     timestamp: serverTimestamp(),
//   };
//   await addDoc(collection(db, "Messages"), newMessage);
// };

// export const fetchRecentChats = async (userId: string): Promise<Message[]> => {
//   try {
//     const q1 = query(
//       collection(db, "Messages"),
//       where("senderId", "==", userId),
//       orderBy("timestamp", "desc"),
//       limit(10)
//     );
//     const q2 = query(
//       collection(db, "Messages"),
//       where("recipientId", "==", userId),
//       orderBy("timestamp", "desc"),
//       limit(10)
//     );
//     const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
//     let results = [...snap1.docs, ...snap2.docs].map((doc) => ({
//       id: doc.id, ...doc.data(),
//     })) as Message[];

//     const map = new Map<string, Message>();
//     results.forEach(m => {
//       const otherUserId = (m.senderId === userId) ? m.recipientId : m.senderId;
//       if (!map.has(otherUserId)) map.set(otherUserId, m);
//       else {
//         const existing = map.get(otherUserId)!;
//         const existingTime = existing.timestamp instanceof Timestamp
//           ? existing.timestamp.toDate().getTime()
//           : new Date(existing.timestamp).getTime();
//         const currentTime = m.timestamp instanceof Timestamp
//           ? m.timestamp.toDate().getTime()
//           : new Date(m.timestamp).getTime();
//         if (currentTime > existingTime) map.set(otherUserId, m);
//       }
//     });
//     results = Array.from(map.values()).sort((a, b) => {
//       const at = a.timestamp instanceof Timestamp ? a.timestamp.toDate() : new Date(a.timestamp);
//       const bt = b.timestamp instanceof Timestamp ? b.timestamp.toDate() : new Date(b.timestamp);
//       return bt.getTime() - at.getTime();
//     });

//     const allUsers = await fetchAllUsers();
//     const userMap = Object.fromEntries(allUsers.map(u => [u.id, u.name || "Unknown"]));
//     results.forEach(m => {
//       m.senderName = userMap[m.senderId] || "Unknown";
//       m.recipientName = (m.recipientId === userId) ? "You" : (userMap[m.recipientId] || "Unknown");
//     });
//     return results;
//   } catch (error) {
//     console.error("Error fetching recent chats:", error);
//     throw error;
//   }
// };

// export const fetchChatHistory = async (userId: string, recipientId: string): Promise<Message[]> => {
//   try {
//     const q = query(
//       collection(db, 'Messages'),
//       where('senderId', 'in', [userId, recipientId]),
//       where('recipientId', 'in', [userId, recipientId]),
//       orderBy('timestamp', 'asc')
//     );

//     const snapshot = await getDocs(q);
//     console.log("Fetched Chat History:", snapshot.docs.map(doc => doc.data()));

//     const allUsers = await fetchAllUsers();
//     const userMap = Object.fromEntries(allUsers.map(u => [u.id, u.name || "Unknown"]));

//     return snapshot.docs.map((doc) => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         senderId: data.senderId,
//         senderName: userMap[data.senderId] || "Unknown",
//         recipientId: data.recipientId,
//         content: data.content,
//         timestamp: data.timestamp,
//       };
//     });
//   } catch (error) {
//     console.error('Error fetching chat history:', error);
//     throw new Error('Failed to fetch chat history');
//   }
// };

// export const fetchAllUsers = async () => {
//   const q = query(collection(db, "users"));
//   const snapshot = await getDocs(q);
//   console.log("Fetched All Users:", snapshot.docs.map(doc => doc.data()));
//   return snapshot.docs.map((doc) => {
//     const data = doc.data();
//     return {
//       id: doc.id,
//       name: data.username || "Unknown",
//       ...data,
//     };
//   });
// };

// export const fetchUserNameById = async (userId: string): Promise<string> => {
//   try {
//     const userDoc = await getDoc(doc(db, "users", userId));
//     if (userDoc.exists()) {
//       return userDoc.data().name || "Unknown";
//     } else {
//       console.warn(`No user found with ID: ${userId}`);
//       return "Unknown";
//     }
//   } catch (error) {
//     console.error("Error fetching user name:", error);
//     return "Unknown";
//   }
// };
