import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { Button } from "../component/button";
import { Input } from "../component/Input";
import { Label } from "../component/label";
import { Separator } from "../component/separator";
import { RadioGroup, RadioGroupItem } from "../component/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/select";
import { Mail, Eye, EyeOff, User, Building, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../component/dialog";
import { auth, googleProvider, db } from "../firebase";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithPhoneNumber,
    sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function Login() {
    const navigate = useNavigate();
    const {
        isLoggedIn, language, setLanguage, userType: globalUserType, profession: globalProfession,
        loadingUser, signInAnonymouslyAsGuest,  updateUserProfileInFirestore,
    } = useContext(GlobalContext);

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

    const [emailResetOpen, setEmailResetOpen] = useState(false);
    const [emailResetAddress, setEmailResetAddress] = useState("");
    const [emailResetSending, setEmailResetSending] = useState(false);

    const texts = {
        en: {
            welcome: "Welcome to Buddy In Hills", discover: "Discover Nainital & Uttarakhand", userType: "I am a", user: "User", owner: "Business Owner", profession: "Profession/Type", googleLogin: "Login with Google", phone: "Phone Number", sendOTP: "Send OTP", resendOTP: "Resend OTP", verifyOTP: "Verify OTP", email: "Email", password: "Password", login: "Login", guestAccess: "Explore as Guest", newHere: "New here?", signUp: "Sign Up", language: "Language", enterOTP: "Please enter the OTP.", otpSentSuccess: "OTP sent successfully!", otpSendFailed: "Failed to send OTP", otpVerifyFailed: "Failed to verify OTP", loginSuccess: "Logged in successfully!", loginFailed: "Login failed", emailPasswordRequired: "Email and password are required.", validPhoneRequired: "A valid phone number is required.", loading: "Loading...", noAccountPhone: "No account found for this phone number. Please sign up first.", noAccountEmail: "No account found for this email. Please sign up first.", resetPassword: "Forgot Password?", resetPasswordTitle: "Reset Password", resetPasswordDesc: "Enter your email to receive a password reset link.", sendResetEmail: "Send Reset Email", cancel: "Cancel", sendPasswordResetSuccess: "Password reset email sent. Check your inbox.", failedToSendResetEmail: "Failed to send reset email.", profileUpdateFailed: "Logged in, but failed to save profile details. Some features might not work.", wrongUserType: "Account found, but with a different user type. Please select the correct role."
        },
        hi: {
            welcome: "Buddy In Hills में आपका स्वागत है", discover: "नैनीताल और उत्तराखंड का अन्वेषण करें", userType: "मैं हूँ", user: "उपयोगकर्ता", owner: "व्यवसाय मालिक", profession: "पेशा/प्रकार", googleLogin: "Google से लॉगिन करें", phone: "फ़ोन नंबर", sendOTP: "OTP भेजें", resendOTP: "OTP पुनः भेजें", verifyOTP: "OTP सत्यापित करें", email: "ईमेल", password: "पासवर्ड", login: "लॉगिन", guestAccess: "अतिथि के रूप में देखें", newHere: "यहाँ नए हैं?", signUp: "साइन अप", language: "भाषा", enterOTP: "कृपया OTP दर्ज करें।", otpSentSuccess: "OTP सफलतापूर्वक भेजा गया!", otpSendFailed: "OTP भेजने में विफल", otpVerifyFailed: "OTP सत्यापित करने में विफल", loginSuccess: "सफलतापूर्वक लॉगिन किया गया!", loginFailed: "लॉगिन विफल", emailPasswordRequired: "ईमेल और पासवर्ड आवश्यक हैं।", validPhoneRequired: "एक वैध फ़ोन नंबर आवश्यक है।", loading: "लोड हो रहा है...", noAccountPhone: "इस फ़ोन नंबर के लिए कोई खाता नहीं मिला। कृपया पहले साइन अप करें।", noAccountEmail: "इस ईमेल के लिए कोई खाता नहीं मिला। कृपया पहले साइन अप करें।", resetPassword: "पासवर्ड भूल गए?", resetPasswordTitle: "पासवर्ड रीसेट करें", resetPasswordDesc: "पासवर्ड रीसेट लिंक प्राप्त करने के लिए अपना ईमेल दर्ज करें।", sendResetEmail: "रीसेट ईमेल भेजें", cancel: "रद्द करें", sendPasswordResetSuccess: "पासवर्ड रीसेट ईमेल भेजा गया। अपना इनबॉक्स जांचें।", failedToSendResetEmail: "रीसेट ईमेल भेजने में विफल।", profileUpdateFailed: "लॉग इन किया गया, लेकिन प्रोफ़ाइल विवरण सहेजने में विफल। कुछ सुविधाएँ काम नहीं कर सकती हैं।", wrongUserType: "खाता मिला, लेकिन एक अलग उपयोगकर्ता प्रकार के साथ। कृपया सही भूमिका चुनें।"
        }
    };
    const t = texts[language] || texts.en;

    const mapFirebaseAuthError = (error) => "Authentication failed: " + error.code;
    
    useEffect(() => {
        if (!loadingUser && isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, loadingUser, navigate]);
    
    const handleSuccessfulLogin = async (user, method) => {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDocRef);
            
            if (docSnap.exists()) {
                const userData = docSnap.data();
                if (userData.userType !== userType) {
                    await auth.signOut();
                    toast.error(t.wrongUserType);
                    return;
                }
            }
            
            const profileUpdates = {
                userType,
                profession: userType === "owner" ? profession : "",
                signupMethod: docSnap.exists() && docSnap.data().signupMethod ? docSnap.data().signupMethod : method,
            };

            const didUpdate = await updateUserProfileInFirestore(profileUpdates);
            if (!didUpdate) {
                toast.warning(t.profileUpdateFailed);
            }

            toast.success(t.loginSuccess);
            navigate('/');
        
        } catch (dbError) {
            toast.error("Login succeeded, but failed to retrieve profile data. Please try again.");
            await auth.signOut();
        }
    };

    const handleGoogleLogin = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await handleSuccessfulLogin(result.user, 'google');
        } catch (error) {
            
            toast.error(mapFirebaseAuthError(error));
        } finally {
            setLoading(false);
        }
    };
    
    const handleSendOTP = async () => {
      if (loading) return;
      if (!phoneNumber || phoneNumber.length < 10) {
        toast.error(t.validPhoneRequired);
        return;
      }
      setLoading(true);
      try {
        const number = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
        
        const q = query(collection(db, "users"), where("phoneNumber", "==", number));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            toast.error(t.noAccountPhone);
            setLoading(false);
            return;
        }

        const result = await signInWithPhoneNumber(auth, number);
        setConfirmationResult(result);
        setShowOtpInput(true);
        setOtpSent(true);
        toast.success(t.otpSentSuccess);
      } catch (error) {
        
        toast.error(mapFirebaseAuthError(error));
      } finally {
        setLoading(false);
      }
    };
    
    const handleOTPLogin = async () => {
        if (loading || !confirmationResult || !otp) {
            if(!otp) toast.error(t.enterOTP);
            return;
        }
        setLoading(true);
        try {
            const result = await confirmationResult.confirm(otp);
            await handleSuccessfulLogin(result.user, 'phone');
        } catch (error) {
            
            toast.error(mapFirebaseAuthError(error));
        } finally {
            setLoading(false);
        }
    };
    
    const handleEmailLogin = async () => {
        if (loading || !email || !password) {
            if(!email || !password) toast.error(t.emailPasswordRequired);
            return;
        }
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await handleSuccessfulLogin(result.user, 'email');
        } catch (error) {
            
            if (error.code === 'auth/user-not-found') {
                toast.error(t.noAccountEmail);
            } else {
                toast.error(mapFirebaseAuthError(error));
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleGuestAccess = async () => {
      if(signInAnonymouslyAsGuest) {
          const res = await signInAnonymouslyAsGuest();
          if (res.success) {
            toast.success(t.loginSuccess);
            navigate("/");
          } else {
            toast.error("Guest sign-in failed. Please try again.");
          }
      }
    };

    const handleSendPasswordResetEmail = async () => {
       if (emailResetSending) return;
        if (!emailResetAddress) {
            toast.error('Please enter your email address.');
            return;
        }
        setEmailResetSending(true);
        try {
            await sendPasswordResetEmail(auth, emailResetAddress);
            toast.success(t.sendPasswordResetSuccess);
            setEmailResetOpen(false);
        } catch (e) {
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
                        <RadioGroup value={userType} onValueChange={setUserType} className="flex justify-center space-x-6" disabled={loading}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="user" id="user-login" />
                                <Label htmlFor="user-login" className="flex items-center space-x-2 cursor-pointer"><User className="w-4 h-4" /><span>{t.user}</span></Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="owner" id="owner-login" />
                                <Label htmlFor="owner-login" className="flex items-center space-x-2 cursor-pointer"><Building className="w-4 h-4" /><span>{t.owner}</span></Label>
                            </div>
                        </RadioGroup>
                    </div>

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
                    <Button onClick={handleGoogleLogin} variant="outline" className="w-full flex items-center gap-2" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Mail className="w-4 h-4" />{t.googleLogin}</Button>
                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="phone">{t.phone}</Label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input id="phone" placeholder="+91 XXXXX XXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="flex-1" disabled={loading || otpSent} />
                            {!otpSent ? (<Button onClick={handleSendOTP} className="bg-primary shrink-0" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t.sendOTP}</Button>) : (<Button onClick={handleSendOTP} className="bg-primary shrink-0" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t.resendOTP}</Button>)}
                        </div>

                        {showOtpInput && (
                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
                                <Input id="otp" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full" disabled={loading}/>
                                <Button onClick={handleOTPLogin} className="bg-primary shrink-0 w-full sm:w-auto" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t.verifyOTP}</Button>
                            </div>
                        )}
                    </div>
                    <Separator />
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t.email}</Label>
                            <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t.password}</Label>
                            <div className="relative">
                                <Input id="password" type={showEmailPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}/>
                                <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1" onClick={() => setShowEmailPassword(!showEmailPassword)} disabled={loading}>{showEmailPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>
                            </div>
                            <Button variant="link" size="sm" onClick={() => setEmailResetOpen(true)} className="px-0 py-0 h-auto text-sm text-muted-foreground">{t.resetPassword}</Button>
                        </div>
                        <Button onClick={handleEmailLogin} className="w-full bg-primary" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t.login}</Button>
                    </div>
                    <Separator />
                    <Button onClick={handleGuestAccess} variant="outline" className="w-full" disabled={loading}>{t.guestAccess}</Button>

                    <p className="text-center text-sm text-muted-foreground">{t.newHere}{" "}<a href="/signup" className="text-primary cursor-pointer hover:underline">{t.signUp}</a></p>

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
                            <DialogFooter>
                                <Button variant="outline" onClick={()=>setEmailResetOpen(false)}>{t.cancel}</Button>
                                <Button onClick={handleSendPasswordResetEmail} disabled={emailResetSending}>{emailResetSending ? "..." : t.sendResetEmail}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}