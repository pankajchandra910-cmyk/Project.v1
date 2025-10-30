// src/pages/Login.js

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";

// --- Component Imports ---
import { Button } from "../component/button";
import { Input } from "../component/Input";
import { Label } from "../component/label";
import { Separator } from "../component/separator";
import { RadioGroup, RadioGroupItem } from "../component/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/select";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../component/dialog";

// --- Icon & Library Imports ---
import { Mail, Eye, EyeOff, User, Building, Loader2 } from "lucide-react";
import { toast } from "sonner";

// --- Firebase Imports ---
import { auth, googleProvider, db } from "../firebase";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithPhoneNumber,
    sendPasswordResetEmail,
    RecaptchaVerifier,
    linkWithCredential,
    GoogleAuthProvider,
    EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";

export default function Login() {
    // --- Hooks ---
    const navigate = useNavigate();
    const {
        isLoggedIn,
        language,
        setLanguage,
        loadingUser,
        userType: currentUserType,
        signInAnonymouslyAsGuest,
    } = useContext(GlobalContext);

    // --- Component State ---
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [userType, setUserType] = useState("user"); // Role selected on the login page
    const [profession, setProfession] = useState("");
    const [loading, setLoading] = useState(false);
    const [showEmailPassword, setShowEmailPassword] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);

    // Forgot Password Modal State
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    
    // --- Language & Text Definitions ---
    const texts = {
        en: { welcome: "Welcome to Buddy In Hills", discover: "Discover Nainital & Uttarakhand", userType: "I am a", user: "User", owner: "Business Owner", profession: "Profession/Type", googleLogin: "Login with Google", phone: "Phone Number", sendOTP: "Send OTP", resendOTP: "Resend OTP", verifyOTP: "Verify OTP", email: "Email", password: "Password", login: "Login", guestAccess: "Explore as Guest", newHere: "New here?", signUp: "Sign Up", language: "Language", enterOTP: "Please enter the OTP.", otpSentSuccess: "OTP sent successfully!", otpSendFailed: "Failed to send OTP", otpVerifyFailed: "Failed to verify OTP", loginSuccess: "Logged in successfully!", loginFailed: "Login failed", emailPasswordRequired: "Email and password are required.", validPhoneRequired: "A valid phone number is required.", loading: "Loading...", noAccountPhone: "No account found. Please sign up first.", noAccountEmail: "No account found. Please sign up first.", resetPassword: "Forgot Password?", resetPasswordTitle: "Reset Password", resetPasswordDesc: "Enter your email to receive a password reset link.", sendResetLink: "Send Reset Link", cancel: "Cancel", sendPasswordResetSuccess: "Password reset email sent. Check your inbox.", failedToSendResetEmail: "Failed to send reset email.", wrongUserType: "Account found, but with a different role. Please select the correct role." },
        hi: { welcome: "Buddy In Hills में आपका स्वागत है", discover: "नैनीताल और उत्तराखंड का अन्वेषण करें", userType: "मैं हूँ", user: "उपयोगकर्ता", owner: "व्यवसाय मालिक", profession: "पेशा/प्रकार", googleLogin: "Google से लॉगिन करें", phone: "फ़ोन नंबर", sendOTP: "OTP भेजें", resendOTP: "OTP पुनः भेजें", verifyOTP: "OTP सत्यापित करें", email: "ईमेल", password: "पासवर्ड", login: "लॉगिन", guestAccess: "अतिथि के रूप में देखें", newHere: "यहाँ नए हैं?", signUp: "साइन अप", language: "भाषा", enterOTP: "कृपया OTP दर्ज करें।", otpSentSuccess: "OTP सफलतापूर्वक भेजा गया!", otpSendFailed: "OTP भेजने में विफल", otpVerifyFailed: "OTP सत्यापित करने में विफल", loginSuccess: "सफलतापूर्वक लॉगिन किया गया!", loginFailed: "लॉगिन विफल", emailPasswordRequired: "ईमेल और पासवर्ड आवश्यक हैं।", validPhoneRequired: "एक वैध फ़ोन नंबर आवश्यक है।", loading: "लोड हो रहा है...", noAccountPhone: "इस फ़ोन नंबर के लिए कोई खाता नहीं मिला। कृपया पहले साइन अप करें।", noAccountEmail: "इस ईमेल के लिए कोई खाता नहीं मिला। कृपया पहले साइन अप करें।", resetPassword: "पासवर्ड भूल गए?", resetPasswordTitle: "पासवर्ड रीसेट करें", resetPasswordDesc: "पासवर्ड रीसेट लिंक प्राप्त करने के लिए अपना ईमेल दर्ज करें।", sendResetLink: "रीसेट लिंक भेजें", cancel: "रद्द करें", sendPasswordResetSuccess: "पासवर्ड रीसेट ईमेल भेजा गया। अपना इनबॉक्स जांचें।", failedToSendResetEmail: "रीसेट ईमेल भेजने में विफल।", wrongUserType: "खाता मिला, लेकिन एक अलग उपयोगकर्ता प्रकार के साथ। कृपया सही भूमिका चुनें।" }
   };
    const t = texts[language] || texts.en;
    
    // --- Side Effects ---
    // Redirects if already logged in and user data is loaded
    useEffect(() => {
        if (!loadingUser && isLoggedIn && currentUserType !== 'guest') {
            const redirectPath = currentUserType === 'owner' ? `/owner-dashboard/${profession || 'other'}` : '/profile';
            navigate(redirectPath);
        }
    }, [isLoggedIn, loadingUser, currentUserType, navigate, profession]);

    // Sets up invisible reCAPTCHA for phone authentication
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
        }
    };

    // --- Authentication Logic & Handlers ---

    // Handles successful login/signup/upgrade by saving user data and redirecting
    const handleLoginOrUpgradeSuccess = async (user) => {
        const userDocRef = doc(db, "users", user.uid);
        let userData;

        // If the current user is a guest, this means they are upgrading their account.
        if (currentUserType === 'guest') {
            userData = {
                uid: user.uid,
                displayName: user.displayName || 'New User',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                phoneVerified: !!user.phoneNumber, // true if phoneNumber exists
                userType: userType, // Use the role selected on the page during upgrade
                profession: userType === "owner" ? profession : "",
                signupMethod: user.providerData[0]?.providerId.includes('google') ? 'google' : 'email', // Determine based on provider
                createdAt: serverTimestamp(),
            };
            await setDoc(userDocRef, userData);
            toast.success("Guest account successfully upgraded!");
        } else {
            // Regular login: fetch existing user data
            const docSnap = await getDoc(userDocRef);
            if (!docSnap.exists()) {
                // This scenario should ideally not happen for non-guest logins,
                // as new users via Google are now handled directly in handleGoogleLogin.
                // However, as a fallback or for other methods, we ensure consistency.
                userData = {
                    uid: user.uid,
                    displayName: user.displayName || 'New User',
                    email: user.email || '',
                    phoneNumber: user.phoneNumber || '',
                    phoneVerified: !!user.phoneNumber,
                    userType: userType, // Use the role selected on the page
                    profession: userType === "owner" ? profession : "",
                    signupMethod: user.providerData[0]?.providerId.includes('google') ? 'google' : 'email',
                    createdAt: serverTimestamp(),
                };
                await setDoc(userDocRef, userData);
                toast.info("Welcome! Your account has been created.");
            } else {
                 userData = docSnap.data();
            }
        }

        // Final check for user type consistency before proceeding
        // This is crucial to prevent users from logging in with the wrong role
        if (!userData || userData.userType !== userType) {
            await auth.signOut(); // Sign out if role mismatch
            toast.error(t.wrongUserType);
            return;
        }

        // Successful login/upgrade and role validation
        toast.success(t.loginSuccess);
        if (userData.userType === 'owner') {
            navigate(`/owner-dashboard/${userData.profession || 'other'}`);
        } else {
            navigate('/profile');
        }
    };

    // UPDATED GOOGLE LOGIN LOGIC (Handles both existing and new users, and guest upgrades)
    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            if (currentUserType === 'guest' && auth.currentUser) {
                // Case: Guest user upgrading their account with Google
                const credential = GoogleAuthProvider.credential(auth.currentUser.uid); // Create a credential from current user
                const result = await linkWithCredential(auth.currentUser, credential); // Link Google to the guest account
                await handleLoginOrUpgradeSuccess(result.user);
            } else {
                // Case: Regular Google Login (or new user signing up with Google for the first time)
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
                const userDocRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    // User exists in Firestore, proceed with normal login flow
                    await handleLoginOrUpgradeSuccess(user);
                } else {
                    // New user: Create their profile in Firestore directly
                    const userData = {
                        uid: user.uid,
                        displayName: user.displayName || 'New User',
                        email: user.email,
                        userType: userType, // Use the role selected on the page
                        profession: userType === "owner" ? profession : "",
                        signupMethod: 'google',
                        createdAt: serverTimestamp(),
                        phoneVerified: false,
                        phoneNumber: user.phoneNumber || "",
                    };
                    await setDoc(userDocRef, userData);
                    toast.info("Welcome! Your account has been created.");
                    await handleLoginOrUpgradeSuccess(user); // Now proceed as a newly created user
                }
            }
        } catch (error) { 
            // Handle specific error for existing account with different credentials
            if (error.code === 'auth/account-exists-with-different-credential') {
                const pendingCred = GoogleAuthProvider.credentialFromError(error);
                const email = error.email;
                
                // Prompt user to link accounts or sign in with existing method
                toast.error(`An account with ${email} already exists. Please sign in with your original method (e.g., Email/Password) to link this Google account.`);
                // You might want to provide UI to allow them to sign in with email/password and then link.
            } else {
                toast.error(`Google Login Failed: ${error.code}`); 
            }
        } finally { 
            setLoading(false); 
        }
    };
    
    // Handles email/password login (or guest upgrade)
    const handleEmailLogin = async () => {
        if (!email || !password) return toast.error(t.emailPasswordRequired);
        setLoading(true);
        try {
            if (currentUserType === 'guest' && auth.currentUser) {
                // Case: Guest user upgrading with email/password
                const credential = EmailAuthProvider.credential(email, password);
                const result = await linkWithCredential(auth.currentUser, credential);
                await handleLoginOrUpgradeSuccess(result.user);
            } else {
                // Case: Regular email/password login
                const result = await signInWithEmailAndPassword(auth, email, password);
                await handleLoginOrUpgradeSuccess(result.user);
            }
        } catch (error) { 
            toast.error(t.noAccountEmail); 
        } finally { 
            setLoading(false); 
        }
    };
    
    // Allows user to proceed as a guest
    const handleGuestAccess = async () => {
      setLoading(true);
      const res = await signInAnonymouslyAsGuest();
      if (res.success) {
        toast.success(t.loginSuccess);
        navigate("/");
      } else {
        toast.error("Guest sign-in failed.");
      }
      setLoading(false);
    };

    // Handles sending password reset email
    const handleSendPasswordReset = async () => {
       if (!resetEmail) return toast.error('Please enter your email address.');
       setResetLoading(true);
       try {
           await sendPasswordResetEmail(auth, resetEmail);
           toast.success(t.sendPasswordResetSuccess);
           setResetModalOpen(false);
       } catch (e) { toast.error(`${t.failedToSendResetEmail}: ${e.code}`); }
       finally { setResetLoading(false); }
    };
    
    // Handles sending OTP for phone number login
    const handleSendOTP = async () => {
        if (!phoneNumber) return toast.error(t.validPhoneRequired);
        setLoading(true);
        try {
            const number = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
            
            // Check if phone number exists in Firestore for an account
            const q = query(collection(db, "users"), where("phoneNumber", "==", number));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                toast.error(t.noAccountPhone);
                setLoading(false); // Important: stop loading if no account is found
                return;
            }
            
            setupRecaptcha();
            const confirmation = await signInWithPhoneNumber(auth, number, window.recaptchaVerifier);
            setConfirmationResult(confirmation);
            setShowOtpInput(true);
            setOtpSent(true);
            toast.success(t.otpSentSuccess);
        } catch (error) { toast.error(`${t.otpSendFailed}: ${error.code}`); }
        finally { setLoading(false); }
    };
    
    // Handles OTP verification and login
    const handleOTPLogin = async () => {
        if (!otp) return toast.error(t.enterOTP);
        setLoading(true);
        try {
            const result = await confirmationResult.confirm(otp);
            await handleLoginOrUpgradeSuccess(result.user);
        } catch (error) { toast.error(`${t.otpVerifyFailed}: ${error.code}`); }
        finally { setLoading(false); }
    };
    
    // --- UI Rendering ---

    if (loadingUser && !isLoggedIn) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div id="recaptcha-container"></div> {/* reCAPTCHA container */}
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md space-y-6">
                
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-primary">{t.welcome}</h2>
                    <p className="text-muted-foreground">{t.discover}</p>
                </div>

                {/* Language Selector */}
                <div className="flex justify-center">
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">🇺🇸 English</SelectItem>
                            <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4">
                    {/* User Type Selection */}
                    <div className="space-y-3">
                        <Label>{t.userType}</Label>
                        <RadioGroup value={userType} onValueChange={setUserType} className="flex justify-center space-x-6" disabled={loading}>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="user" id="user-login" /><Label htmlFor="user-login" className="flex items-center gap-2 cursor-pointer"><User className="w-4 h-4" /><span>{t.user}</span></Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="owner" id="owner-login" /><Label htmlFor="owner-login" className="flex items-center gap-2 cursor-pointer"><Building className="w-4 h-4" /><span>{t.owner}</span></Label></div>
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

                    <Separator />

                    {/* Google Login Button */}
                    <Button onClick={handleGoogleLogin} variant="outline" className="w-full flex items-center gap-2" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Mail className="w-4 h-4" />{t.googleLogin}</Button>
                    <Separator />

                    {/* Phone Number OTP Login */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">{t.phone}</Label>
                        <div className="flex gap-2">
                            <Input id="phone" placeholder="+91 XXXXX XXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="flex-1" disabled={loading || otpSent} />
                            <Button onClick={handleSendOTP} className="bg-primary shrink-0" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin"/> : (otpSent ? t.resendOTP : t.sendOTP)}</Button>
                        </div>
                        {showOtpInput && (
                            <div className="flex items-center gap-2 mt-2">
                                <Input id="otp" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full" disabled={loading}/>
                                <Button onClick={handleOTPLogin} className="bg-primary shrink-0" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin"/> : t.verifyOTP}</Button>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Email/Password Login */}
                    <div className="space-y-3">
                        <div className="space-y-2"><Label htmlFor="email">{t.email}</Label><Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}/></div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t.password}</Label>
                            <div className="relative">
                                <Input id="password" type={showEmailPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}/>
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowEmailPassword(!showEmailPassword)}>
                                    {showEmailPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                            <Button variant="link" size="sm" onClick={() => setResetModalOpen(true)} className="px-0 py-0 h-auto text-sm text-muted-foreground">{t.resetPassword}</Button>
                        </div>
                        <Button onClick={handleEmailLogin} className="w-full bg-primary" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t.login}</Button>
                    </div>

                    <Separator />

                    {/* Guest Access & Sign Up Link */}
                    <Button onClick={handleGuestAccess} variant="outline" className="w-full" disabled={loading}>{t.guestAccess}</Button>
                    <p className="text-center text-sm text-muted-foreground">{t.newHere}{" "}<Link to="/signup" className="text-primary cursor-pointer hover:underline">{t.signUp}</Link></p>

                    {/* Forgot Password Dialog */}
                    <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader><DialogTitle>{t.resetPasswordTitle}</DialogTitle><DialogDescription>{t.resetPasswordDesc}</DialogDescription></DialogHeader>
                            <div className="mt-4 space-y-2"><Label htmlFor="reset-email">Email</Label><Input id="reset-email" value={resetEmail} onChange={(e)=>setResetEmail(e.target.value)} placeholder="your@email.com" /></div>
                            <DialogFooter><Button variant="outline" onClick={()=>setResetModalOpen(false)}>{t.cancel}</Button><Button onClick={handleSendPasswordReset} disabled={resetLoading}>{resetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.sendResetLink}</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}