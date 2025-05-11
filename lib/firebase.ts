import { initializeApp, getApps, FirebaseOptions } from 'firebase/app';
import { getAnalytics, logEvent as firebaseLogEvent } from 'firebase/analytics';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
};

const isFirebaseConfigValid = () => {
    const requiredKeys = [
        'apiKey', 
        'authDomain', 
        'projectId', 
        'storageBucket', 
        'messagingSenderId', 
        'appId'
    ];
    
    const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof FirebaseOptions]);
    
    if (missingKeys.length > 0) {
        console.error(`Firebase config is missing required keys: ${missingKeys.join(', ')}`);
        console.error('Please set the following environment variables:');
        missingKeys.forEach(key => {
            console.error(`NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`);
        });
        return false;
    }
    
    return true;
};

let analytics: any = null;
let app: any = null;
let auth: any = null;
let db: any = null;

const initFirebase = () => {
    if (typeof window === 'undefined') {
        console.log('Cannot initialize Firebase on server side');
        return;
    }

    try {
        if (getApps().length) {
            console.log('Firebase already initialized, getting existing app');
            const existingApp = getApps()[0];
            app = existingApp;
            auth = getAuth(existingApp);
            db = getFirestore(existingApp);
            
            try {
                analytics = getAnalytics(existingApp);
                console.log("Firebase Analytics obtained from existing app");
            } catch (analyticsError) {
                console.warn('Analytics could not be initialized from existing app:', analyticsError);
            }
            
            return;
        }
        
        if (!isFirebaseConfigValid()) {
            console.error('Firebase initialization was skipped due to invalid configuration');
            return;
        }
        
        console.log('Initializing Firebase with measurement ID:', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);
        
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        
        try {
            analytics = getAnalytics(app);
        } catch (analyticsError) {
            console.error('Analytics could not be initialized:', analyticsError);
        }
        
    } catch (error) {
        console.error("Error initializing Firebase:", error);
    }
};

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window === 'undefined') {
        console.warn('Cannot track events server-side');
        return;
    }

    if (!analytics) {
        initFirebase();
        if (!analytics) {
            console.error('Failed to initialize analytics after attempt');
        }
    }

    try {
        if (analytics) {
            firebaseLogEvent(analytics, eventName, eventParams);

            return true;
        } else {
            console.warn('Firebase Analytics not available', eventName, eventParams);
            if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
                console.warn('Missing Firebase Measurement ID or in development mode');
            }
            return false;
        }
    } catch (error) {
        console.error(`Error tracking event: ${eventName}`, error);
        return false;
    }
};

export const EventTypes = {
    VIEW_MATCH_DETAIL: 'view_match_detail',
    ADD_TO_CART: 'add_to_cart',
    REMOVE_FROM_CART: 'remove_from_cart',
    CLEAR_CART: 'clear_cart',
    PLACE_BET: 'place_bet',
    VIEW_SPORTS_PAGE: 'view_sports_page',
    VIEW_EVENTS_PAGE: 'view_events_page',
    USER_SIGNUP: 'user_signup',
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout'
};

export const registerUser = async (email: string, password: string, displayName: string) => {
    if (!auth) initFirebase();
    
    if (!auth) {
        throw new Error("Authentication is not initialized. Check your Firebase configuration.");
    }
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        
        trackEvent(EventTypes.USER_SIGNUP, { 
            method: 'email', 
            user_id: userCredential.user.uid 
        });
        
        return userCredential.user;
    } catch (error: any) {
        console.error("Error signing up:", error);
        throw error;
    }
};

export const loginUser = async (email: string, password: string) => {
    if (!auth) initFirebase();
    
    if (!auth) {
        throw new Error("Authentication is not initialized. Check your Firebase configuration.");
    }
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        trackEvent(EventTypes.USER_LOGIN, { 
            method: 'email', 
            user_id: userCredential.user.uid 
        });
        
        return userCredential.user;
    } catch (error: any) {
        console.error("Error signing in:", error);
        throw error;
    }
};

export const logoutUser = async () => {
    if (!auth) initFirebase();
    
    if (!auth) {
        throw new Error("Authentication is not initialized. Check your Firebase configuration.");
    }
    
    try {
        if (auth.currentUser) {
            trackEvent(EventTypes.USER_LOGOUT, { 
                user_id: auth.currentUser.uid 
            });
        }
        
        await signOut(auth);
    } catch (error: any) {
        console.error("Error signing out:", error);
        throw error;
    }
};

export const getCurrentUser = (): User | null => {
    if (!auth) initFirebase();
    return auth?.currentUser || null;
};

export const onUserAuthStateChanged = (callback: (user: User | null) => void) => {
    if (!auth) initFirebase();
    
    if (!auth) {
        console.error("Authentication is not initialized. Check your Firebase configuration.");
        callback(null);
        return () => {};
    }
    
    return onAuthStateChanged(auth, callback);
};

if (typeof window !== 'undefined') {
    initFirebase();
}

export { auth, db };
export default analytics;