import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

// --- Global Context, Components & Firebase Imports ---
import { GlobalContext } from "../component/GlobalContext";
import { analytics, auth, googleProvider, db } from "../firebase"; // 1. Import analytics
import { logEvent } from "firebase/analytics"; // 2. Import logEvent
import {
    createUserWithEmailAndPassword, signInWithPopup, signInWithPhoneNumber,
    updateProfile, RecaptchaVerifier,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";

// --- Component Imports ---
import { Button } from "../component/button";
import { Input } from "../component/Input";
import { Label } from "../component/label";
import { Separator } from "../component/separator";
import { RadioGroup, RadioGroupItem } from "../component/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/select";

// --- Icon Imports ---
import { Eye, EyeOff, User, Building, Loader2 } from "lucide-react";


export default function Signup() {
    const navigate = useNavigate();
    const { isLoggedIn, language, setLanguage, loadingUser } = useContext(GlobalContext);

    // --- State Management ---
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);

    const [userType, setUserType] = useState("user");
    const [profession, setProfession] = useState("");

    // --- Language Definitions ---
    const texts = {
        en: { createAccount: "Create Your Account", joinCommunity: "Join our community of travelers and owners", userType: "I am a", user: "User", owner: "Business Owner", profession: "Profession/Type", name: "Full Name", googleSignup: "Sign Up with Google", phone: "Phone Number", sendOTP: "Send OTP", verifyOTP: "Verify & Sign Up", email: "Email", password: "Password", signup: "Create Account", haveAccount: "Already have an account?", login: "Login", language: "Language", enterOTP: "Please enter the 6-digit OTP.", otpSentSuccess: "OTP sent successfully!", otpSendFailed: "Failed to send OTP. Please check the number and try again.", otpVerifyFailed: "Failed to verify OTP. It might be incorrect or expired.", signupSuccess: "Account created successfully!", formValidationError: "Please fill in all required fields.", passwordLengthError: "Password must be at least 6 characters.", userExistsError: "An account with this email or phone number already exists. Please log in.", phoneExistsError: "This phone number is already registered. Please log in.",
        },
        hi: { createAccount: "अपना खाता बनाएं", joinCommunity: "यात्रियों और मालिकों के हमारे समुदाय में शामिल हों", userType: "मैं हूँ", user: "उपयोगकर्ता", owner: "व्यवसाय मालिक", profession: "पेशा/प्रकार", name: "पूरा नाम", googleSignup: "Google से साइन अप करें", phone: "फ़ोन नंबर", sendOTP: "OTP भेजें", verifyOTP: "OTP सत्यापित करें और साइन अप करें", email: "ईमेल", password: "पासवर्ड", signup: "खाता बनाएं", haveAccount: "पहले से ही एक खाता है?", login: "लॉगिन", language: "भाषा", enterOTP: "कृपया 6-अंकीय OTP दर्ज करें।", otpSentSuccess: "OTP सफलतापूर्वक भेजा गया!", otpSendFailed: "OTP भेजने में विफल। कृपया नंबर जांचें और पुनः प्रयास करें।", otpVerifyFailed: "OTP सत्यापित करने में विफल। यह गलत या समाप्त हो सकता है।", signupSuccess: "खाता सफलतापूर्वक बन गया!", formValidationError: "कृपया सभी आवश्यक फ़ील्ड भरें।", passwordLengthError: "पासवर्ड कम से " +
        "कम 6 अक्षरों का होना चाहिए।", userExistsError: "इस ईमेल या फोन नंबर वाला खाता पहले से मौजूद है। कृपया लॉग इन करें।", phoneExistsError: "यह फ़ोन नंबर पहले से पंजीकृत है। कृपया लॉग इन करें।",
        }
    };
    const t = texts[language] || texts.en;

    // Redirects if already logged in and user data is loaded
    useEffect(() => { if (!loadingUser && isLoggedIn) navigate("/"); }, [isLoggedIn, loadingUser, navigate]);

    // Sets up invisible reCAPTCHA for phone verification
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => {} // Callback for reCAPTCHA success, optional for invisible
            });
        }
    };

    // Universal function to save user data to Firestore and redirect after successful signup
    const handleSuccessfulSignup = async (user, method) => {
        const userDocRef = doc(db, 'users', user.uid);
        // Use Google's display name if available, otherwise fallback to manually entered name or 'New User'
        const finalName = method === 'google' ? user.displayName : name;

        const userData = {
            uid: user.uid,
            displayName: finalName || 'New User',
            email: user.email || email || '',
            phoneNumber: user.phoneNumber || phoneNumber || '',
            phoneVerified: method === 'phone', // Mark phone as verified if signed up by phone
            userType,
            profession: userType === "owner" ? profession : "",
            signupMethod: method,
            createdAt: serverTimestamp(),
        };

        try {
            await setDoc(userDocRef, userData);
            // Update Auth profile if a name was provided manually and Google didn't provide one
            if (name && !user.displayName) {
                await updateProfile(user, { displayName: name });
            }

            // 3. Log the successful sign_up event using Firebase Analytics
            if (analytics) {
                logEvent(analytics, 'sign_up', {
                    method: method, // 'google', 'email', or 'phone'
                    user_role: userType, // 'user' or 'owner'
                    user_id: user.uid, // Optionally log user ID for analytics
                });
            }

            toast.success(t.signupSuccess);

            // --- CRITICAL REDIRECTION LOGIC ---
            if (userType === 'owner') {
                 navigate(`/owner-dashboard/${userData.profession || 'other'}`);
            } else {
                navigate('/profile'); // Redirects regular users to their profile
            }
        } catch (error) {
            toast.error("Failed to save profile: " + error.message);
            // Log signup failure related to profile saving
            if (analytics) {
                logEvent(analytics, 'profile_save_failed', {
                    method: method,
                    error_code: error.code,
                });
            }
        }
    };

    // Handles Google Signup
    const handleGoogleSignup = async () => {
        // Name is now optional for Google signup as Google provides it (removed !name check)
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const userDocRef = doc(db, 'users', result.user.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                toast.error(t.userExistsError);
                await auth.signOut(); // Sign out the newly created auth user if Firestore profile exists
                navigate('/login'); // Redirect to login
                // Log signup failure
                if (analytics) {
                    logEvent(analytics, 'sign_up_failed', {
                        method: 'google',
                        reason: 'account_already_exists',
                    });
                }
                return;
            }
            await handleSuccessfulSignup(result.user, 'google');
        } catch (error) {
            // Handle specific error for existing account with different credentials
            if (error.code === 'auth/account-exists-with-different-credential') {
                toast.error(t.userExistsError);
                navigate('/login'); // Redirect to login
            } else {
                toast.error(error.message);
            }
            // Log signup failure
            if (analytics) {
                logEvent(analytics, 'sign_up_failed', {
                    method: 'google',
                    error_code: error.code,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Handles Email/Password Signup
    const handleEmailSignup = async () => {
        if (!name || !email || !password) return toast.error(t.formValidationError);
        if (password.length < 6) return toast.error(t.passwordLengthError);
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await handleSuccessfulSignup(userCredential.user, 'email');
        } catch (error) {
            toast.error(error.code === 'auth/email-already-in-use' ? t.userExistsError : error.message);
            // Log signup failure
            if (analytics) {
                logEvent(analytics, 'sign_up_failed', {
                    method: 'email',
                    error_code: error.code,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Handles sending OTP for phone number signup
    const handleSendOTP = async () => {
        if (!name || !phoneNumber) return toast.error(t.formValidationError);
        setLoading(true);

        try {
            const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

            // Check if phone number already exists in Firestore
            const q = query(collection(db, "users"), where("phoneNumber", "==", formattedPhoneNumber));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                toast.error(t.phoneExistsError);
                setLoading(false);
                // Log OTP send failure
                if (analytics) {
                    logEvent(analytics, 'otp_send_failed', {
                        reason: 'phone_already_registered',
                    });
                }
                return;
            }

            setupRecaptcha(); // Ensure reCAPTCHA is set up
            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
            setConfirmationResult(confirmation);
            setShowOtpInput(true);
            toast.success(t.otpSentSuccess);
            // Log OTP sent event
            if (analytics) {
                logEvent(analytics, 'otp_sent', {
                    phone_number_prefix: formattedPhoneNumber.substring(0, 3), // Avoid logging full number
                });
            }
        } catch (error) {
            toast.error(t.otpSendFailed + ` (${error.code})`);
            // Log OTP send failure
            if (analytics) {
                logEvent(analytics, 'otp_send_failed', {
                    reason: 'firebase_error',
                    error_code: error.code,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Handles OTP verification and final signup for phone number
    const handleVerifyOTPAndSignup = async () => {
        if (!otp || otp.length !== 6) return toast.error(t.enterOTP);
        setLoading(true);
        try {
            const result = await confirmationResult.confirm(otp);
            await handleSuccessfulSignup(result.user, 'phone');
        } catch (error) {
            toast.error(t.otpVerifyFailed);
            // Log OTP verification failure
            if (analytics) {
                logEvent(analytics, 'otp_verify_failed', {
                    error_code: error.code,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-green-50 p-4">
            <div id="recaptcha-container"></div> {/* reCAPTCHA container */}
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-primary">{t.createAccount}</h2>
                    <p className="text-muted-foreground">{t.joinCommunity}</p>
                </div>

                {/* Language Selector */}
                <div className="flex justify-center mb-4">
                    <Select value={language} onValueChange={setLanguage}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">🇺🇸 English</SelectItem><SelectItem value="hi">🇮🇳 Hindi</SelectItem></SelectContent></Select>
                </div>

                <div className="space-y-4">
                    {/* User Type Selection */}
                    <div className="space-y-3">
                        <Label>{t.userType}</Label>
                        <RadioGroup value={userType} onValueChange={setUserType} className="flex justify-center space-x-6" disabled={loading}>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="user" id="user-signup" /><Label htmlFor="user-signup" className="flex items-center space-x-2 cursor-pointer"><User className="w-4 h-4" /><span>{t.user}</span></Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="owner" id="owner-signup" /><Label htmlFor="owner-signup" className="flex items-center space-x-2 cursor-pointer"><Building className="w-4 h-4" /><span>{t.owner}</span></Label></div>
                        </RadioGroup>
                    </div>

                    {/* Profession Selection (for Owners) */}
                    {userType === "owner" && (
                        <div className="space-y-2">
                            <Label>{t.profession}</Label>
                            <Select value={profession} onValueChange={setProfession} disabled={loading}>
                                <SelectTrigger><SelectValue placeholder="Select your profession" /></SelectTrigger>
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

                    {/* Full Name Input */}
                    <div className="space-y-2">
                        <Label htmlFor="name">{t.name}</Label>
                        <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} disabled={loading}/>
                    </div>

                    <Separator />

                    {/* Google Signup Button */}
                    <Button onClick={handleGoogleSignup} variant="outline" className="w-full flex items-center gap-2" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<svg role="img" viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>{t.googleSignup}</Button>
                    <Separator />

                    {/* Phone Number OTP Signup */}
                    {!showOtpInput ? (
                        <div className="space-y-2">
                            <Label htmlFor="phone">{t.phone}</Label>
                            <div className="flex gap-2">
                                <Input id="phone" placeholder="+91 XXXXX XXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="flex-1" disabled={loading} />
                                <Button onClick={handleSendOTP} className="bg-primary shrink-0" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin"/> : t.sendOTP}</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="otp">Enter OTP for {phoneNumber}</Label>
                            <div className="flex gap-2">
                                <Input id="otp" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} className="flex-1" disabled={loading}/>
                                <Button onClick={handleVerifyOTPAndSignup} className="bg-primary shrink-0" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin"/> : t.verifyOTP}</Button>
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Email/Password Signup */}
                    <div className="space-y-3">
                        <div className="space-y-2"><Label htmlFor="email">{t.email}</Label><Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}/></div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t.password}</Label>
                            <div className="relative">
                                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}/>
                                <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                        <Button onClick={handleEmailSignup} className="w-full bg-primary" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t.signup}</Button>
                    </div>

                    <Separator />

                    {/* Already have an account? Login Link */}
                    <p className="text-center text-sm text-muted-foreground">{t.haveAccount}{" "}<Link to="/login" className="text-primary cursor-pointer hover:underline">{t.login}</Link></p>
                </div>
            </div>
        </div>
    );
}