import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Handles the Google Sign-In process.
 * Creates a user document in Firestore if it's their first time.
 * @returns {boolean} - True on success, false on failure.
 */
export const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if the user document already exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    // If the user is new, create a new document for them
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        firstName: user.displayName ? user.displayName.split(' ')[0] : '',
        lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '',
        email: user.email,
        uid: user.uid,
      });
    }
    return true; // Indicate success
  } catch (err) {
    console.error('Error with Google Sign-In:', err);
    alert(err.message || 'Google sign-in failed');
    return false; // Indicate failure
  }
};