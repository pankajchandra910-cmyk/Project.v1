import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";

// Import all necessary components for the login form directly
import { Button } from "../component/button";
import { Input } from "../component/Input";
import { Label } from "../component/label";
import { Separator } from "../component/separator";
import { RadioGroup, RadioGroupItem } from "../component/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/select";
import { Mail, Phone, Eye, EyeOff, User, Building, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../component/dialog";

// --- Firebase Imports ---
import { auth, googleProvider, db } from "../firebase";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithPhoneNumber,
    sendPasswordResetEmail,
    fetchSignInMethodsForEmail,
    PhoneAuthProvider, // Keep PhoneAuthProvider for credential linking if needed
} from "firebase/auth";
import { linkWithPopup, linkWithCredential } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";


export default function Login() {
    const navigate = useNavigate();
    const {
        isLoggedIn,
        language,
        setLanguage,
        userType: globalUserType,
        profession: globalProfession,
        loadingUser,
        signInAnonymouslyAsGuest,
        lastAuthError,
        setLastAuthError,
        updateUserProfileInFirestore,
    } = useContext(GlobalContext);

    // Local UI state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showEmailPassword, setShowEmailPassword] = useState(false);

    const [userType, setUserType] = useState(globalUserType || "user");
    const [profession, setProfession] = useState(globalProfession || "");
    // Forgot-password / reset modals state
    const [emailResetOpen, setEmailResetOpen] = useState(false);
    const [emailResetAddress, setEmailResetAddress] = useState("");
    const [emailResetSending, setEmailResetSending] = useState(false);

    const texts = {
        en: {
            welcome: "Welcome to Buddy In Hills",
            discover: "Discover Nainital & Uttarakhand",
            userType: "I am a",
            user: "User",
            owner: "Business Owner",
            profession: "Profession/Type",
            googleLogin: "Login with Gmail",
            phone: "Phone Number",
            sendOTP: "Send OTP",
            resendOTP: "Resend OTP",
            verifyOTP: "Verify OTP",
            email: "Email",
            password: "Password",
            login: "Login",
            guestAccess: "Explore as Guest",
            newHere: "New here?",
            signUp: "Sign Up",
            language: "Language",
            enterOTP: "Please enter the OTP.",
            otpSentSuccess: "OTP sent successfully!",
            otpSendFailed: "Failed to send OTP",
            otpVerifyFailed: "Failed to verify OTP",
            loginSuccess: "Logged in successfully!",
            loginFailed: "Login failed",
            emailPasswordRequired: "Email and password are required.",
            validPhoneRequired: "A valid phone number is required.",
            loading: "Loading...",
            noAccountPhone: "No account found for this phone number. Please sign up first.",
            resetPassword: "Forgot Password?",
            resetPasswordTitle: "Reset password",
            resetPasswordDesc: "Enter your email to receive a password reset link.",
            sendResetEmail: "Send reset email",
            cancel: "Cancel",
            noEmailAssociated: "No email associated with this account. Contact support.",
            enterValidPhone: "Please enter a valid phone number with country code.",
            otpSent: "OTP sent.",
            noAccountEmail: "No account found for this email. Please sign up first.",
            sendPasswordResetSuccess: "Password reset email sent. Check your inbox.",
            failedToSendResetEmail: "Failed to send reset email.",
            fallbackOtpSaveSuccess: "Phone saved as unverified (OTP service unavailable).",
            fallbackOtpSaveFailed: "Failed to save phone for fallback.",
            unableToSavePhone: "Unable to save phone: not signed in. Please sign in or sign up first."
        },
        hi: {
            welcome: "Buddy In Hills में आपका स्वागत है",
            discover: "नैनीताल और उत्तराखंड का अन्वेषण करें",
            userType: "मैं हूँ",
            user: "उपयोगकर्ता",
            owner: "व्यवसाय मालिक",
            profession: "पेशा/प्रकार",
            googleLogin: "Gmail से लॉगिन करें",
            phone: "फ़ोन नंबर",
            sendOTP: "OTP भेजें",
            resendOTP: "OTP पुनः भेजें",
            verifyOTP: "OTP सत्यापित करें",
            email: "ईमेल",
            password: "पासवर्ड",
            login: "लॉगिन",
            guestAccess: "अतिथि के रूप में देखें",
            newHere: "यहाँ नए हैं?",
            signUp: "साइन अप",
            language: "भाषा",
            enterOTP: "कृपया OTP दर्ज करें।",
            otpSentSuccess: "OTP सफलतापूर्वक भेजा गया!",
            otpSendFailed: "OTP भेजने में विफल",
            otpVerifyFailed: "OTP सत्यापित करने में विफल",
            loginSuccess: "सफलतापूर्वक लॉगिन किया गया!",
            loginFailed: "लॉगिन विफल",
            emailPasswordRequired: "ईमेल और पासवर्ड आवश्यक हैं।",
            validPhoneRequired: "एक वैध फ़ोन नंबर आवश्यक है।",
            loading: "लोड हो रहा है...",
            noAccountPhone: "इस फ़ोन नंबर के लिए कोई खाता नहीं मिला। कृपया साइन अप करें।",
            resetPassword: "पासवर्ड भूल गए?",
            resetPasswordTitle: "पासवर्ड रीसेट करें",
            resetPasswordDesc: "पासवर्ड रीसेट लिंक प्राप्त करने के लिए अपना ईमेल दर्ज करें।",
            sendResetEmail: "रीसेट ईमेल भेजें",
            cancel: "रद्द करें",
            noEmailAssociated: "इस खाते से कोई ईमेल संबद्ध नहीं है। सहायता से संपर्क करें।",
            enterValidPhone: "कृपया देश कोड के साथ एक वैध फ़ोन नंबर दर्ज करें।",
            otpSent: "OTP भेजा गया।",
            noAccountEmail: "इस ईमेल के लिए कोई खाता नहीं मिला। कृपया पहले साइन अप करें।",
            sendPasswordResetSuccess: "पासवर्ड रीसेट ईमेल भेजा गया। अपना इनबॉक्स जांचें।",
            failedToSendResetEmail: "रीसेट ईमेल भेजने में विफल।",
            fallbackOtpSaveSuccess: "फ़ोन को असत्यापित के रूप में सहेजा गया (OTP सेवा अनुपलब्ध)।",
            fallbackOtpSaveFailed: "फ़ॉलबैक के लिए फ़ोन सहेजने में विफल।",
            unableToSavePhone: "फ़ोन सहेजने में असमर्थ: साइन इन नहीं किया। कृपया पहले साइन इन या साइन अप करें।"
        }
    };

    const t = texts[language] || texts.en;

    const mapFirebaseAuthError = (error) => {
        if (!error) return t.loginFailed;
        const code = error.code || (error && error.message && error.message.code) || null;
        switch (code) {
            case 'auth/operation-not-allowed':
                return 'This sign-in method is disabled in the Firebase console. Enable it in Firebase Authentication settings.';
            case 'auth/network-request-failed':
                return 'Network error. Check your connection and try again.';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please wait a few minutes and try again.';
            case 'auth/invalid-phone-number':
                return 'Invalid phone number format. Please include your country code.';
            case 'auth/invalid-verification-code':
                return 'Invalid OTP. Please check the code and try again.';
            case 'auth/code-expired':
                return 'OTP expired. Request a new code and try again.';
            case 'auth/popup-closed-by-user':
                return 'Login popup closed. Please try signing in again.';
            case 'auth/cancelled-popup-request':
                return 'Popup request cancelled or blocked. Try again or check your browser settings.';
            case 'auth/account-exists-with-different-credential':
                return 'An account already exists with the same email but different sign-in method. Try signing in with that provider or use password recovery.';
            case 'auth/user-not-found':
                return 'No account found for this email. Please sign up first.';
            case 'auth/wrong-password':
                return 'Incorrect password. Use the Forgot password option if needed.';
            case 'auth/email-already-in-use':
                return 'This email is already registered. Try signing in or use a different email.';
            case 'auth/requires-recent-login':
                return 'This action requires recent authentication. Please sign out and sign in again before retrying.';
            default:
                return 'Authentication failed. Please try again.';
        }
    };

    useEffect(() => {
        if (globalUserType) setUserType(globalUserType);
    }, [globalUserType]);

    useEffect(() => {
        if (globalProfession) setProfession(globalProfession);
    }, [globalProfession]);

    useEffect(() => {
        if (!loadingUser && isLoggedIn) {
            console.log("Login page: Already logged in, redirecting. UserType:", globalUserType, "Profession:", globalProfession);
            if (globalUserType === 'owner' && globalProfession) {
                navigate(`/owner-dashboard/${globalProfession}`);
            } else {
                navigate("/");
            }
        }
    }, [isLoggedIn, loadingUser, globalUserType, globalProfession, navigate]);

    const resetOtpFlow = () => {
        setOtp("");
        setConfirmationResult(null);
        setShowOtpInput(false);
        setOtpSent(false);
    };

    const saveUserAdditionalData = async (userUid, type, prof, phoneNumber = null, email = null, signupMethod = null, phoneVerified = false) => {
        const updates = {
            userType: type,
            profession: type === "owner" ? prof : "",
            updatedAt: new Date(),
        };

        if (email) updates.email = email;
        if (phoneNumber) updates.phoneNumber = phoneNumber;
        if (signupMethod) updates.signupMethod = signupMethod;
        updates.phoneVerified = phoneVerified;
        await updateUserProfileInFirestore(updates);
    };


    const findUserByPhone = async (phone) => {
        try {
            if (!phone) return null;
            const usersRef = collection(db, 'users');
            // Normalize phone for lookup
            const cleanedPhone = phone.replace(/[^0-9]/g, '');
            const normalizedPhone = cleanedPhone.startsWith('+') ? cleanedPhone : `+91${cleanedPhone}`;

            const q = query(usersRef, where('phoneNumber', '==', normalizedPhone));
            const snaps = await getDocs(q);
            if (snaps.empty) return null;
            // return first match DocumentSnapshot so caller can read id and data
            return snaps.docs[0];
        } catch (e) {
            console.warn('findUserByPhone error', e);
            return null;
        }
    };

    const handleGoogleLogin = async () => {
        if (loading) return;
        setLoading(true);
        resetOtpFlow();
        try {
            // If current user is anonymous, link Google credential to preserve the anonymous UID/data
            if (auth.currentUser && auth.currentUser.isAnonymous) {
                try {
                    const linkResult = await linkWithPopup(auth.currentUser, googleProvider);
                    console.log("Linked anonymous account with Google:", linkResult.user);
                    await saveUserAdditionalData(linkResult.user.uid, userType, profession, linkResult.user.phoneNumber, linkResult.user.email, 'google', !!linkResult.user.phoneNumber);
                    toast.success(t.loginSuccess);
                } catch (linkErr) {
                    // If linking fails (e.g., account exists), fallback to normal sign-in
                    console.warn('Linking anonymous->Google failed, attempting normal sign-in:', linkErr);
                    const result = await signInWithPopup(auth, googleProvider);
                    await saveUserAdditionalData(result.user.uid, userType, profession, result.user.phoneNumber, result.user.email, 'google', !!result.user.phoneNumber);
                    toast.success(t.loginSuccess);
                }
            } else {
                const result = await signInWithPopup(auth, googleProvider);
                console.log("Google Login Success:", result.user);
                // After Google login, ensure Firestore user exists and userType matches selection
                const userDocRef = doc(db, 'users', result.user.uid);
                const snap = await getDoc(userDocRef);
                if (!snap.exists()) {
                    // No user doc -- create and allow signup
                    await saveUserAdditionalData(result.user.uid, userType, profession, result.user.phoneNumber, result.user.email, 'google', !!result.user.phoneNumber);
                    toast.success(t.loginSuccess);
                } else {
                    const data = snap.data();
                    if (data.userType && data.userType !== userType) {
                        // mismatch: sign out and show error
                        await auth.signOut();
                        toast.error('Account found but user type does not match selected type. Please choose correct role or sign up.');
                        return;
                    }
                    // Update user profile in Firestore to ensure all data is up-to-date
                    await saveUserAdditionalData(result.user.uid, userType, profession, result.user.phoneNumber, result.user.email, 'google', !!result.user.phoneNumber);
                    toast.success(t.loginSuccess);
                }
            }
        } catch (error) {
            console.error("Google Login Error:", error.code, error.message);
            if (setLastAuthError) setLastAuthError(error);
            const friendly = mapFirebaseAuthError(error);
            toast.error(friendly);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        if (loading) return;
        setLoading(true);
        resetOtpFlow(); // Always reset OTP flow when starting a new send OTP process

        try {
            if (!phoneNumber || phoneNumber.length < 10) {
                toast.error(t.validPhoneRequired);
                setLoading(false);
                return;
            }

            // NO RECAPTCHA VERIFIER HERE - DANGEROUS FOR PRODUCTION
            const number = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

            // Check Firestore for this phone number and userType
            const existing = await findUserByPhone(number);
            if (!existing) {
                toast.error(t.noAccountPhone);
                setLoading(false);
                return;
            }

            console.log("Sending OTP to:", number);
            try {
                // Directly call signInWithPhoneNumber without appVerifier
                const result = await signInWithPhoneNumber(auth, number);
                setConfirmationResult(result);
                setShowOtpInput(true);
                setOtpSent(true);
                toast.success(t.otpSentSuccess);
                console.log("OTP sent. Confirmation result:", result);
            } catch (sendErr) {
                console.error('OTP send failed:', sendErr);
                const code = sendErr?.code || '';
                const msg = (sendErr && sendErr.message) || '';
                if (code.includes('billing') || msg.toLowerCase().includes('billing') || msg.toLowerCase().includes('recaptcha') || code === 'auth/quota-exceeded') {
                    try {
                        if (existing) {
                            const existingDoc = existing;
                            await setDoc(doc(db, 'users', existingDoc.id), { phoneNumber: number, phoneVerified: false, updatedAt: new Date() }, { merge: true });
                            toast.success(t.fallbackOtpSaveSuccess);
                        } else if (auth.currentUser) {
                            const userDocRef = doc(db, 'users', auth.currentUser.uid);
                            await setDoc(userDocRef, { phoneNumber: number, phoneVerified: false, updatedAt: new Date() }, { merge: true });
                            toast.success(t.fallbackOtpSaveSuccess);
                        } else {
                            toast.error(t.unableToSavePhone);
                        }
                    } catch (saveErr) {
                        console.error('Fallback save unverified phone failed', saveErr);
                        toast.error(t.fallbackOtpSaveFailed);
                    }
                } else {
                    const friendly = mapFirebaseAuthError(sendErr);
                    toast.error(t.otpSendFailed + ": " + friendly);
                }
            }
        } catch (error) {
            console.error("OTP Send Error:", error.code, error.message);
            if (setLastAuthError) setLastAuthError(error);
            const friendly = mapFirebaseAuthError(error);
            toast.error(friendly);
            resetOtpFlow();
        } finally {
            setLoading(false);
        }
    };

    const handleOTPLogin = async () => {
        if (loading) return;
        setLoading(true);
        try {
            if (!confirmationResult || !otp) {
                toast.error(t.enterOTP);
                setLoading(false);
                return;
            }

            console.log("Verifying OTP...");
            // If current user is anonymous, link the phone credential to the existing account
            if (auth.currentUser && auth.currentUser.isAnonymous) {
                try {
                    const verificationId = confirmationResult.verificationId;
                    if (!verificationId) throw new Error("No verification ID found in confirmation result.");

                    const phoneCred = PhoneAuthProvider.credential(verificationId, otp);
                    const linkResult = await linkWithCredential(auth.currentUser, phoneCred);
                    console.log('Linked anonymous account with phone:', linkResult.user);
                    await saveUserAdditionalData(linkResult.user.uid, userType, profession, linkResult.user.phoneNumber, linkResult.user.email, 'phone', true);
                    toast.success(t.loginSuccess);
                    resetOtpFlow();
                } catch (linkErr) {
                    console.warn('Linking anonymous->phone failed, trying normal confirm:', linkErr);
                    const result = await confirmationResult.confirm(otp);
                    console.log("OTP Login Success:", result.user);
                    await saveUserAdditionalData(result.user.uid, userType, profession, result.user.phoneNumber, result.user.email, 'phone', true);
                    toast.success(t.loginSuccess);
                    resetOtpFlow();
                }
            } else {
                const result = await confirmationResult.confirm(otp);
                console.log("OTP Login Success:", result.user);
                await saveUserAdditionalData(result.user.uid, userType, profession, result.user.phoneNumber, result.user.email, 'phone', true);
                toast.success(t.loginSuccess);
                resetOtpFlow();
            }
        } catch (error) {
            console.error("OTP Login Error:", error.code, error.message);
            if (setLastAuthError) setLastAuthError(error);
            const friendly = mapFirebaseAuthError(error);
            toast.error(t.otpVerifyFailed + ": " + friendly);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async () => {
        if (loading) return;
        setLoading(true);
        resetOtpFlow();
        try {
            if (!email || !password) {
                toast.error(t.emailPasswordRequired);
                setLoading(false);
                return;
            }
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log("Email Login Success:", result.user);
            await saveUserAdditionalData(result.user.uid, userType, profession, result.user.phoneNumber, result.user.email, 'email', !!result.user.phoneNumber);
            toast.success(t.loginSuccess);
        } catch (error) {
            console.error("Email Login Error:", error.code, error.message);
            if (setLastAuthError) setLastAuthError(error);
            const friendly = mapFirebaseAuthError(error);
            toast.error(friendly);
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                toast.info('Would you like to reset your password?');
                openEmailReset(email);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGuestAccess = async () => {
        if (!signInAnonymouslyAsGuest) {
            navigate("/");
            return;
        }

        setLoading(true);
        try {
            const res = await signInAnonymouslyAsGuest();
            if (res && res.success) {
                toast.success(t.loginSuccess);
                navigate("/");
            } else {
                const err = res && res.error ? res.error : null;
                console.warn("Guest sign-in failed:", err || "unknown error");
                if (setLastAuthError && err) setLastAuthError(err);
                const friendly = mapFirebaseAuthError(err);
                toast.error(friendly);
            }
        } catch (e) {
            console.error("Guest sign-in unexpected error:", e);
            if (setLastAuthError) setLastAuthError(e);
            toast.error("Unable to start guest session.");
        } finally {
            setLoading(false);
        }
    };

    // --- Forgot/Reset flows ---
    const openEmailReset = (prefill) => {
        setEmailResetAddress(prefill || email || "");
        setEmailResetOpen(true);
    };

    const handleSendPasswordResetEmail = async () => {
        if (emailResetSending) return;
        if (!emailResetAddress) {
            toast.error('Please enter your email address.');
            return;
        }
        setEmailResetSending(true);
        try {
            const methods = await fetchSignInMethodsForEmail(auth, emailResetAddress);
            if (!methods || methods.length === 0) {
                toast.error(t.noAccountEmail);
                setEmailResetSending(false);
                return;
            }
            await sendPasswordResetEmail(auth, emailResetAddress);
            toast.success(t.sendPasswordResetSuccess);
            setEmailResetOpen(false);
        } catch (e) {
            console.error('sendPasswordResetEmail error', e);
            toast.error(t.failedToSendResetEmail);
        } finally {
            setEmailResetSending(false);
        }
    };

    if (loadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-green-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-green-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-primary">{t.welcome}</h2>
                    <p className="text-muted-foreground">{t.discover}</p>
                </div>

                <div className="flex justify-center mb-4">
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">🇺🇸 English</SelectItem>
                            <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4">
                    <div className="space-y-3">
                        <Label>{t.userType}</Label>
                        <RadioGroup
                            value={userType}
                            onValueChange={(value) => setUserType(value)}
                            className="flex justify-center space-x-6"
                            disabled={loading}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="user" id="user-login" />
                                <Label htmlFor="user-login" className="flex items-center space-x-2 cursor-pointer">
                                    <User className="w-4 h-4" />
                                    <span>{t.user}</span>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="owner" id="owner-login" />
                                <Label htmlFor="owner-login" className="flex items-center space-x-2 cursor-pointer">
                                    <Building className="w-4 h-4" />
                                    <span>{t.owner}</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {userType === "owner" && (
                        <div className="space-y-2">
                            <Label>{t.profession}</Label>
                            <Select value={profession} onValueChange={setProfession} disabled={loading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your profession" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="resort-hotel">Resort/Hotel</SelectItem>
                                    <SelectItem value="rental-bikes">Rental Bikes</SelectItem>
                                    <SelectItem value="cabs-taxis">Cabs/Taxis</SelectItem>
                                    <SelectItem value="local-guides">Local Guide</SelectItem>
                                    <SelectItem value="tours-treks">Tours/Treks</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <Separator />

                    <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Mail className="w-4 h-4" />
                        {t.googleLogin}
                    </Button>

                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="phone">{t.phone}</Label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                id="phone"
                                placeholder="+91 XXXXX XXXXX"
                                value={phoneNumber}
                                onChange={(e) => {
                                    setPhoneNumber(e.target.value);
                                    if (otpSent && !showOtpInput) {
                                        resetOtpFlow();
                                    }
                                }}
                                className="flex-1"
                                disabled={loading || otpSent} // Disable phone input after OTP is sent
                            />
                            {!otpSent ? (
                                <Button onClick={handleSendOTP} className="bg-primary shrink-0" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t.sendOTP}
                                </Button>
                            ) : (
                                <Button onClick={handleSendOTP} className="bg-primary shrink-0" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t.resendOTP}
                                </Button>
                            )}
                        </div>

                        {showOtpInput && (
                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
                                <Input
                                    id="otp"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full"
                                    disabled={loading}
                                />
                                <Button onClick={handleOTPLogin} className="bg-primary shrink-0 w-full sm:w-auto" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t.verifyOTP}
                                </Button>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t.email}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t.password}</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showEmailPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                                    onClick={() => setShowEmailPassword(!showEmailPassword)}
                                    disabled={loading}
                                >
                                    {showEmailPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                            <Button variant="link" size="sm" onClick={() => openEmailReset(email)} className="px-0 py-0 h-auto text-sm text-muted-foreground">
                                {t.resetPassword}
                            </Button>
                        </div>
                        <Button onClick={handleEmailLogin} className="w-full bg-primary" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t.login}
                        </Button>
                    </div>

                    <Separator />

                    <Button
                        onClick={handleGuestAccess}
                        variant="outline"
                        className="w-full"
                        disabled={loading}
                    >
                        {t.guestAccess}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        {t.newHere}{" "}
                        <a href="/signup" className="text-primary cursor-pointer hover:underline">
                            {t.signUp}
                        </a>
                    </p>

                    {/* Email reset dialog */}
                    <Dialog open={emailResetOpen} onOpenChange={setEmailResetOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{t.resetPasswordTitle}</DialogTitle>
                                <DialogDescription>{t.resetPasswordDesc}</DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 space-y-2">
                                <Label>Email</Label>
                                <Input value={emailResetAddress} onChange={(e)=>setEmailResetAddress(e.target.value)} placeholder="your@email.com" />
                            </div>
                            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                                <Button variant="outline" onClick={()=>setEmailResetOpen(false)}>{t.cancel}</Button>
                                <Button onClick={handleSendPasswordResetEmail} disabled={emailResetSending}>{emailResetSending? t.loading : t.sendResetEmail}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}