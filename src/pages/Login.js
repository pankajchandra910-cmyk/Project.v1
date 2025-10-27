import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext"; // Adjust path if needed

// Import all necessary components for the login form directly
import { Button } from "../component/button";
import { Input } from "../component/Input";
import { Label } from "../component/label";
import { Separator } from "../component/separator";
import { RadioGroup, RadioGroupItem } from "../component/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/select";
import { Mail, Phone, Eye, EyeOff, User, Building, Loader2 } from "lucide-react";
import { toast } from "sonner";

// --- Firebase Imports ---
import { auth, googleProvider, db } from "../firebase"; // Adjust path if needed
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { linkWithPopup, linkWithCredential, PhoneAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// You would NOT import LoginModal here if you're directly rendering the form.
// import { LoginModal } from "../component/LoginModal";

export default function Login() {
    const navigate = useNavigate();
    const {
        isLoggedIn,
        language,
        setLanguage,
        userType: globalUserType, // Renamed to avoid conflict with local state
        profession: globalProfession, // Renamed to avoid conflict with local state
        loadingUser,
        signInAnonymouslyAsGuest,
        lastAuthError,
        setLastAuthError,
    } = useContext(GlobalContext);
    const [recaptchaAvailable, setRecaptchaAvailable] = useState(true);

    // Local UI state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const recaptchaRef = useRef(null);
    const [userType, setUserType] = useState(globalUserType || "user");
    const [profession, setProfession] = useState(globalProfession || "");

    // Helper: map firebase auth errors to friendly suggestions
    const mapFirebaseAuthError = (error) => {
        if (!error) return "Authentication failed. Please try again.";
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

    // Initialize reCAPTCHA once when the component mounts (use container id for reliability)
    useEffect(() => {
        try {
            const containerId = 'recaptcha-container';
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(containerId, {
                    size: 'invisible',
                    callback: (response) => { console.log('reCAPTCHA solved:', response); },
                    'expired-callback': () => {
                        toast.error(t.recaptchaExpired);
                        console.warn('reCAPTCHA expired. Resetting.');
                        if (window.grecaptcha && window.recaptchaVerifier) {
                            window.recaptchaVerifier.render().then(widgetId => window.grecaptcha.reset(widgetId));
                        }
                    }
                }, auth);
                if (window.recaptchaVerifier && typeof window.recaptchaVerifier.render === 'function') {
                    window.recaptchaVerifier.render().catch((e) => console.warn('reCAPTCHA render warning:', e));
                }
                console.log('RecaptchaVerifier initialized successfully.');
            }
            setRecaptchaAvailable(true);
        } catch (e) {
            console.warn('Failed to initialize RecaptchaVerifier:', e);
            setRecaptchaAvailable(false);
            if (setLastAuthError) setLastAuthError(e);
            toast.error('Error setting up phone login. Please try again.');
        }
    }, []);

    useEffect(() => {
        if (globalUserType) setUserType(globalUserType);
    }, [globalUserType]);

    useEffect(() => {
        if (globalProfession) setProfession(globalProfession);
    }, [globalProfession]);
    // --- End of state and effects moved from LoginModal ---


    // --- Login page redirection logic (original) ---
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
    // --- End of Login page redirection logic ---

    // --- Login Handlers (moved from LoginModal, adapted for direct use) ---
    const resetOtpFlow = () => {
        setOtp("");
        setConfirmationResult(null);
        setShowOtpInput(false);
        setOtpSent(false);
        if (window.grecaptcha && window.recaptchaVerifier) {
            window.recaptchaVerifier.render().then(widgetId => {
                window.grecaptcha.reset(widgetId);
            });
        }
    };

    const saveUserAdditionalData = async (userUid, type, prof) => {
        const userDocRef = doc(db, "users", userUid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
                userType: type,
                profession: type === "owner" ? prof : "",
                email: auth.currentUser?.email,
                phoneNumber: auth.currentUser?.phoneNumber,
                createdAt: new Date(),
            }, { merge: true });
        } else {
            const existingData = userDocSnap.data();
            if (existingData.userType !== type || existingData.profession !== (type === "owner" ? prof : "")) {
                await setDoc(userDocRef, {
                    userType: type,
                    profession: type === "owner" ? prof : "",
                }, { merge: true });
            }
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
                    await saveUserAdditionalData(linkResult.user.uid, userType, profession);
                    toast.success(t.loginSuccess);
                } catch (linkErr) {
                    // If linking fails (e.g., account exists), fallback to normal sign-in
                    console.warn('Linking anonymous->Google failed, attempting normal sign-in:', linkErr);
                    const result = await signInWithPopup(auth, googleProvider);
                    await saveUserAdditionalData(result.user.uid, userType, profession);
                    toast.success(t.loginSuccess);
                }
            } else {
                const result = await signInWithPopup(auth, googleProvider);
                console.log("Google Login Success:", result.user);
                await saveUserAdditionalData(result.user.uid, userType, profession);
                toast.success(t.loginSuccess);
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
        resetOtpFlow();

        try {
            if (!phoneNumber || phoneNumber.length < 10) {
                toast.error(t.validPhoneRequired);
                setLoading(false);
                return;
            }

            if (!window.recaptchaVerifier) {
                toast.error("reCAPTCHA is not ready. Please try again in a moment.");
                console.error("RecaptchaVerifier not initialized before sending OTP.");
                setLoading(false);
                return;
            }

            const appVerifier = window.recaptchaVerifier;
            const number = `+91${phoneNumber}`;

            console.log("Sending OTP to:", number);
            const result = await signInWithPhoneNumber(auth, number, appVerifier);
            setConfirmationResult(result);
            setShowOtpInput(true);
            setOtpSent(true);
            toast.success(t.otpSentSuccess);
            console.log("OTP sent. Confirmation result:", result);
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
                    const verificationId = confirmationResult.verificationId || confirmationResult;
                    const phoneCred = PhoneAuthProvider.credential(verificationId, otp);
                    const linkResult = await linkWithCredential(auth.currentUser, phoneCred);
                    console.log('Linked anonymous account with phone:', linkResult.user);
                    await saveUserAdditionalData(linkResult.user.uid, userType, profession);
                    toast.success(t.loginSuccess);
                    resetOtpFlow();
                } catch (linkErr) {
                    console.warn('Linking anonymous->phone failed, trying normal confirm:', linkErr);
                    const result = await confirmationResult.confirm(otp);
                    console.log("OTP Login Success:", result.user);
                    await saveUserAdditionalData(result.user.uid, userType, profession);
                    toast.success(t.loginSuccess);
                    resetOtpFlow();
                }
            } else {
                const result = await confirmationResult.confirm(otp);
                console.log("OTP Login Success:", result.user);
                await saveUserAdditionalData(result.user.uid, userType, profession);
                // After successful login, the useEffect for isLoggedIn will handle navigation
                toast.success(t.loginSuccess);
                resetOtpFlow();
            }
        } catch (error) {
            console.error("OTP Login Error:", error.code, error.message);
            if (setLastAuthError) setLastAuthError(error);
            const friendly = mapFirebaseAuthError(error);
            toast.error(friendly);
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
            await saveUserAdditionalData(result.user.uid, userType, profession);
            // After successful login, the useEffect for isLoggedIn will handle navigation
            toast.success(t.loginSuccess);
        } catch (error) {
            console.error("Email Login Error:", error.code, error.message);
            if (setLastAuthError) setLastAuthError(error);
            const friendly = mapFirebaseAuthError(error);
            toast.error(friendly);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestAccess = async () => {
        // Use async/await and handle the safe result from GlobalContext
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
            // Defensive: unexpected errors
            console.error("Guest sign-in unexpected error:", e);
            if (setLastAuthError) setLastAuthError(e);
            toast.error("Unable to start guest session.");
        } finally {
            setLoading(false);
        }
    };
    // --- End of Login Handlers ---

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
            recaptchaExpired: "reCAPTCHA expired, please try again.",
            loginSuccess: "Logged in successfully!",
            loginFailed: "Login failed",
            emailPasswordRequired: "Email and password are required.",
            validPhoneRequired: "A valid phone number is required.",
            loading: "Loading..."
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
            recaptchaExpired: "reCAPTCHA समाप्त हो गया, कृपया पुनः प्रयास करें।",
            loginSuccess: "सफलतापूर्वक लॉगिन किया गया!",
            loginFailed: "लॉगिन विफल",
            emailPasswordRequired: "ईमेल और पासवर्ड आवश्यक हैं।",
            validPhoneRequired: "एक वैध फ़ोन नंबर आवश्यक है।",
            loading: "लोड हो रहा है..."
        }
    };

    const t = texts[language] || texts.en;

    if (loadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    // If already logged in, the useEffect will handle redirection, so this component won't render
    if (isLoggedIn) {
        return null; // Or a simple loading spinner if preferred before redirect
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
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
                            disabled={loading} // Disable if overall form is loading
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
                        <div className="flex gap-2">
                            <Input
                                id="phone"
                                placeholder="+91 XXXXX XXXXX"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="flex-1"
                                disabled={loading || otpSent}
                            />
                            {!showOtpInput ? (
                                <Button onClick={handleSendOTP} className="bg-primary" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t.sendOTP}
                                </Button>
                            ) : (
                                <Button onClick={handleOTPLogin} className="bg-primary" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t.verifyOTP}
                                </Button>
                            )}
                        </div>
                        {showOtpInput && (
                            <Input
                                id="otp"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mt-2"
                                disabled={loading}
                            />
                        )}
                        <div id="recaptcha-container" ref={recaptchaRef} className="mt-2"></div>
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
                                    type={showPassword ? "text" : "password"}
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
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
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
                </div>
            </div>
        </div>
    );
}