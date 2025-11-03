import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
// --- Global Context, Components & Firebase Imports ---
import { GlobalContext } from "../component/GlobalContext";
import { analytics, auth, googleProvider, db } from "../firebase"; // 1. Import analytics
import { logEvent } from "firebase/analytics"; // 2. Import logEvent
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithPhoneNumber,
    sendPasswordResetEmail,
    RecaptchaVerifier,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
// --- Component Imports ---
import { Button } from "../component/button";
import { Input } from "../component/Input";
import { Label } from "../component/label";
import { Separator } from "../component/separator";
import { RadioGroup, RadioGroupItem } from "../component/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/select";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../component/dialog";
import { Mail, Eye, EyeOff, User, Building, Loader2 } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const {
        isLoggedIn,
        language,
        setLanguage,
        loadingUser,
        userType: currentUserType,
        signInAnonymouslyAsGuest,
    } = useContext(GlobalContext);

    // --- State Management ---
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [userType, setUserType] = useState("user"); // Role selected on the login page
    const [profession, setProfession] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);

    // Modal States
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    const [showGuestRoleModal, setShowGuestRoleModal] = useState(false);
    const [guestSelectedRole, setGuestSelectedRole] = useState("user");

    // --- Language Definitions ---
    const texts = {
        en: { welcome: "Welcome to Buddy In Hills", discover: "Discover Nainital & Uttarakhand", userType: "I am a", user: "User", owner: "Business Owner", profession: "Profession/Type", googleLogin: "Login with Google", phone: "Phone Number", sendOTP: "Send OTP", verifyOTP: "Verify OTP", email: "Email", password: "Password", login: "Login", guestAccess: "Explore as Guest", newHere: "New here?", signUp: "Sign Up", language: "Language", otpSentSuccess: "OTP sent successfully!", loginSuccess: "Logged in successfully!", resetPassword: "Forgot Password?", resetPasswordTitle: "Reset Password", wrongUserType: "Account found, but with a different role. Please select the correct role.", noAccount: "No account found. Please sign up first.", sendPasswordResetSuccess: "Password reset email sent. Check your inbox.", failedToSendResetEmail: "Failed to send reset email.", continue: "Continue", cancel: "Cancel", continueAsGuest: "Continue as Guest", personalizeExperience: "Please select your role to personalize your experience.", validPhoneRequired: "A valid phone number is required.", enterOTP: "Please enter the OTP." },
        hi: { welcome: "Buddy In Hills में आपका स्वागत है", discover: "नैनीताल और उत्तराखंड का अन्वेषण करें", userType: "मैं हूँ", user: "उपयोगकर्ता", owner: "व्यवसाय मालिक", profession: "पेशा/प्रकार", googleLogin: "Google से लॉगिन करें", phone: "फ़ोन नंबर", sendOTP: "OTP भेजें", verifyOTP: "OTP सत्यापित करें", email: "ईमेल", password: "पासवर्ड", login: "लॉगिन", guestAccess: "अतिथि के रूप में देखें", newHere: "यहाँ नए हैं?", signUp: "साइन अप", language: "भाषा", otpSentSuccess: "OTP सफलतापूर्वक भेजा गया!", loginSuccess: "सफलतापूर्वक लॉगिन किया गया!", resetPassword: "पासवर्ड भूल गए?", resetPasswordTitle: "पासवर्ड रीसेट करें", wrongUserType: "खाता मिला, लेकिन एक अलग उपयोगकर्ता प्रकार के साथ। कृपया सही भूमिका चुनें।", noAccount: "कोई खाता नहीं मिला। कृपया पहले साइन अप करें।", sendPasswordResetSuccess: "पासवर्ड रीसेट ईमेल भेजा गया। अपना इनबॉक्स जांचें।", failedToSendResetEmail: "रीसेट ईमेल भेजने में विफल।", continue: "जारी रखें", cancel: "रद्द करें", continueAsGuest: "अतिथि के रूप में जारी रखें", personalizeExperience: "अपना अनुभव निजीकृत करने के लिए कृपया अपनी भूमिका चुनें।", validPhoneRequired: "एक वैध फ़ोन नंबर आवश्यक है।", enterOTP: "कृपया OTP दर्ज करें।" }
    };
    const t = texts[language] || texts.en;

    // --- Core Logic & Handlers ---

    // Redirects any logged-in (non-guest) user away from the login page.
    useEffect(() => {
        if (!loadingUser && isLoggedIn && currentUserType !== 'guest') {
            const redirectPath = currentUserType === 'owner' ? `/owner-dashboard/resort-hotel` : '/';
            navigate(redirectPath);
        }
    }, [isLoggedIn, loadingUser, currentUserType, navigate]);

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
        }
    };

    /**
     * Central function for handling all successful REGISTERED user logins.
     * It sets GA, fetches user data, validates the role, and navigates.
     */
    const handleLoginSuccess = async (user, method) => {
        // 3. Log the successful login event using Firebase Analytics
        if (analytics) {
            logEvent(analytics, 'login', {
                method: method, // Tracks 'google', 'email', or 'phone'
                user_id: user.uid, // Optionally log user ID for analytics
            });
        }

        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        const userData = docSnap.exists() ? docSnap.data() : {};

        // Final check: The role selected on the page MUST match the role in the database.
        if (userData.userType !== userType) {
            await auth.signOut();
            toast.error(t.wrongUserType);
            return;
        }

        toast.success(t.loginSuccess);
        if (userData.userType === 'owner') {
            navigate(`/owner-dashboard/${userData.profession || 'resort-hotel'}`);
        } else {
            navigate('/');
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const userDocRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) {
                // This is a new user signing up via Google.
                const newUser = {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    userType: userType, // The role selected on the page
                    profession: userType === "owner" ? profession : "",
                    signupMethod: 'google',
                    createdAt: serverTimestamp(),
                    phoneVerified: false,
                };
                await setDoc(userDocRef, newUser);
                toast.info("Welcome! Your account has been created.");
            }
            // Proceed to the standard success handler for both new and existing users.
            await handleLoginSuccess(user, 'google');

        } catch (error) {
            toast.error(`Google Login Failed: ${error.code}`);
             // Log login failure
            if (analytics) {
                logEvent(analytics, 'login_failed', {
                    method: 'google',
                    error_code: error.code,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async () => {
        if (!email || !password) return toast.error("Email and password are required.");
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await handleLoginSuccess(result.user, 'email');
        } catch (error) {
            toast.error(t.noAccount);
             // Log login failure
            if (analytics) {
                logEvent(analytics, 'login_failed', {
                    method: 'email',
                    error_code: error.code,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        if (!phoneNumber) return toast.error(t.validPhoneRequired);
        setLoading(true);
        try {
            const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
            const q = query(collection(db, "users"), where("phoneNumber", "==", formattedNumber));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // Log failed OTP attempt due to no account
                if (analytics) {
                    logEvent(analytics, 'otp_send_failed', {
                        reason: 'no_account_found',
                    });
                }
                return toast.error(t.noAccount);
            }

            setupRecaptcha();
            const confirmation = await signInWithPhoneNumber(auth, formattedNumber, window.recaptchaVerifier);
            setConfirmationResult(confirmation);
            setShowOtpInput(true);
            setOtpSent(true);
            toast.success(t.otpSentSuccess);
             // Log OTP sent event
            if (analytics) {
                logEvent(analytics, 'otp_sent', {
                    phone_number_prefix: formattedNumber.substring(0, 3), // Avoid logging full number
                });
            }
        } catch (error) {
            toast.error(`Failed to send OTP: ${error.code}`);
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

    const handleOTPLogin = async () => {
        if (!otp) return toast.error(t.enterOTP);
        setLoading(true);
        try {
            const result = await confirmationResult.confirm(otp);
            await handleLoginSuccess(result.user, 'phone');
        } catch (error) {
            toast.error(`Failed to verify OTP: ${error.code}`);
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

    const handleSendPasswordReset = async () => {
        if (!resetEmail) return toast.error('Please enter your email address.');
        setResetLoading(true);
        try {
            await sendPasswordResetEmail(auth, resetEmail);

            // 4. Log the password reset event using Firebase Analytics
            if (analytics) {
                logEvent(analytics, 'password_reset_request', {
                    email_domain: resetEmail.split('@')[1], // Log domain instead of full email
                });
            }

            toast.success(t.sendPasswordResetSuccess);
            setResetModalOpen(false);
        } catch (error) {
            toast.error(`${t.failedToSendResetEmail}: ${error.code}`);
            // Log password reset failure
            if (analytics) {
                logEvent(analytics, 'password_reset_failed', {
                    error_code: error.code,
                });
            }
        } finally {
            setResetLoading(false);
        }
    };

    // --- Guest Flow ---

    /**
     * Entry point for guest access. It opens a modal for role selection.
     */
    const handleGuestAccess = () => {
        if (isLoggedIn && currentUserType === 'guest') {
            navigate("/");
        } else {
            setShowGuestRoleModal(true);
        }
        // Log guest access attempt
        if (analytics) {
            logEvent(analytics, 'guest_access_initiated');
        }
    };

    /**
     * Creates a new anonymous guest session after they've selected a role in the modal.
     * NOTE: The `logEvent` for guest login is now handled within the
     * `signInAnonymouslyAsGuest` function in GlobalContext for better consistency,
     * so we don't duplicate it here.
     */
    const handleConfirmGuestLogin = async () => {
        setLoading(true);
        setShowGuestRoleModal(false);
        const res = await signInAnonymouslyAsGuest(guestSelectedRole); // Pass the selected role
        if (res.success) {
            toast.success(t.loginSuccess);
            navigate("/");
        } else {
            toast.error("Guest sign-in failed.");
            // Log guest sign-in failure
            if (analytics) {
                logEvent(analytics, 'guest_sign_in_failed', {
                    selected_role: guestSelectedRole,
                });
            }
        }
        setLoading(false);
    };


    // --- Render Logic ---

    if (loadingUser) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div id="recaptcha-container"></div>
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md space-y-6">

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-primary">{t.welcome}</h2>
                    <p className="text-muted-foreground">{t.discover}</p>
                </div>

                <div className="flex justify-center">
                    <Select value={language} onValueChange={setLanguage}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">🇺🇸 English</SelectItem><SelectItem value="hi">🇮🇳 Hindi</SelectItem></SelectContent></Select>
                </div>

                <div className="space-y-4">
                    <div className="space-y-3">
                        <Label>{t.userType}</Label>
                        <RadioGroup value={userType} onValueChange={setUserType} className="flex justify-center space-x-6" disabled={loading}>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="user" id="user-login" /><Label htmlFor="user-login" className="flex items-center gap-2 cursor-pointer"><User className="w-4 h-4" />{t.user}</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="owner" id="owner-login" /><Label htmlFor="owner-login" className="flex items-center gap-2 cursor-pointer"><Building className="w-4 h-4" />{t.owner}</Label></div>
                        </RadioGroup>
                    </div>

                    {userType === "owner" && (
                        <div className="space-y-2">
                            <Label>{t.profession}</Label>
                            <Select value={profession} onValueChange={setProfession} disabled={loading}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>
                                <SelectItem value="resort-hotel">Resort/Hotel</SelectItem>
                                <SelectItem value="rental-bikes">Rental Bikes</SelectItem>
                                <SelectItem value="cabs-taxis">Cabs/Taxis</SelectItem>
                                <SelectItem value="local-guides">Local Guide</SelectItem>
                                <SelectItem value="tours-treks">Tours/Treks</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent></Select>
                        </div>
                    )}

                    <Separator />

                    <Button onClick={handleGoogleLogin} variant="outline" className="w-full" disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}{t.googleLogin}</Button>

                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="phone">{t.phone}</Label>
                        <div className="flex gap-2">
                            <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={loading || otpSent} placeholder="+91 XXXXX XXXXX" />
                            <Button onClick={handleSendOTP} disabled={loading || otpSent}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.sendOTP}</Button>
                        </div>
                        {showOtpInput && (
                            <div className="flex items-center gap-2 mt-2">
                                <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={loading} placeholder="Enter OTP" />
                                <Button onClick={handleOTPLogin} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.verifyOTP}</Button>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <div className="space-y-2"><Label htmlFor="email">{t.email}</Label><Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} placeholder="your@email.com" /></div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t.password}</Label>
                            <div className="relative">
                                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} placeholder="••••••••" />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>
                            </div>
                            <Button variant="link" size="sm" onClick={() => setResetModalOpen(true)} className="px-0 h-auto">{t.resetPassword}</Button>
                        </div>
                        <Button onClick={handleEmailLogin} className="w-full" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t.login}</Button>
                    </div>

                    <Separator />

                    <Button onClick={handleGuestAccess} variant="outline" className="w-full" disabled={loading}>{t.guestAccess}</Button>
                    <p className="text-center text-sm">{t.newHere}{" "}<Link to="/signup" className="text-primary hover:underline">{t.signUp}</Link></p>
                </div>
            </div>

            {/* --- Modals --- */}
            <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
                <DialogContent><DialogHeader><DialogTitle>{t.resetPasswordTitle}</DialogTitle></DialogHeader><div className="mt-4 space-y-2"><Label htmlFor="reset-email">Email</Label><Input id="reset-email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="your@email.com" /></div><DialogFooter><Button variant="outline" onClick={() => setResetModalOpen(false)}>{t.cancel}</Button><Button onClick={handleSendPasswordReset} disabled={resetLoading}>{resetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Reset Link'}</Button></DialogFooter></DialogContent>
            </Dialog>

            <Dialog open={showGuestRoleModal} onOpenChange={setShowGuestRoleModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t.continueAsGuest}</DialogTitle>
                        <DialogDescription>{t.personalizeExperience}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>I am a:</Label>
                        <RadioGroup value={guestSelectedRole} onValueChange={setGuestSelectedRole} className="flex space-x-6 mt-2">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="user" id="guest-user" /><Label htmlFor="guest-user" className="flex items-center gap-2 cursor-pointer"><User className="w-4 h-4" />{t.user}</Label></div>
                          </RadioGroup>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowGuestRoleModal(false)}>{t.cancel}</Button>
                        <Button onClick={handleConfirmGuestLogin} disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.continue}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}