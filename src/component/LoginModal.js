// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"; // Adjust path if needed
// import { Button } from "./button"; // Adjust path if needed
// import { Input } from "./Input"; // Adjust path if needed
// import { Label } from "./label"; // Adjust path if needed
// import { Separator } from "./separator"; // Adjust path if needed
// import { RadioGroup, RadioGroupItem } from "./radio-group"; // Adjust path if needed
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"; // Adjust path if needed
// import { Mail, Phone, Eye, EyeOff, User, Building, Loader2 } from "lucide-react";
// import React, { useState, useEffect, useRef } from "react";
// import { toast } from "sonner";

// // --- Firebase Imports ---
// import { auth, googleProvider, db } from "../firebase"; // Ensure this path is correct
// import {
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   signInWithPhoneNumber,
//   RecaptchaVerifier,
// } from "firebase/auth";
// import { doc, setDoc, getDoc } from "firebase/firestore";

// export function LoginModal({ isOpen, onClose, onLogin, language, onLanguageChange, currentUserType, currentProfession }) {
//   const [showPassword, setShowPassword] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [userType, setUserType] = useState(currentUserType || "user");
//   const [profession, setProfession] = useState(currentProfession || "");
//   const [otp, setOtp] = useState("");
//   const [confirmationResult, setConfirmationResult] = useState(null);
//   const [showOtpInput, setShowOtpInput] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);

//   const recaptchaRef = useRef(null);

//   useEffect(() => {
//     let verifierInstance;

//     if (isOpen && recaptchaRef.current && !window.recaptchaVerifier) {
//       try {
//         console.log("Initializing RecaptchaVerifier...");
//         verifierInstance = new RecaptchaVerifier(auth, recaptchaRef.current, {
//           'size': 'invisible',
//           'callback': (response) => {
//             console.log("reCAPTCHA solved:", response);
//           },
//           'expired-callback': () => {
//             toast.error(t.recaptchaExpired);
//             console.warn("reCAPTCHA expired. Resetting.");
//             if (window.grecaptcha && window.recaptchaVerifier) {
//                 window.recaptchaVerifier.render().then(widgetId => {
//                     window.grecaptcha.reset(widgetId);
//                 });
//             }
//           }
//         });
//         window.recaptchaVerifier = verifierInstance;
//         console.log("RecaptchaVerifier initialized successfully.");

//       } catch (e) {
//         console.error("Failed to initialize RecaptchaVerifier:", e);
//         toast.error("Error setting up phone login. Please try again.");
//       }
//     }

//     return () => {
//       // Cleanup logic if needed, as discussed.
//     };
//   }, [isOpen, auth]);

//   useEffect(() => {
//     if (currentUserType) setUserType(currentUserType);
//   }, [currentUserType]);

//   useEffect(() => {
//     if (currentProfession) setProfession(currentProfession);
//   }, [currentProfession]);

//   const resetOtpFlow = () => {
//     setOtp("");
//     setConfirmationResult(null);
//     setShowOtpInput(false);
//     setOtpSent(false);
//     if (window.grecaptcha && window.recaptchaVerifier) {
//         window.recaptchaVerifier.render().then(widgetId => {
//             window.grecaptcha.reset(widgetId);
//         });
//     }
//   };

//   const saveUserAdditionalData = async (userUid, type, prof) => {
//     const userDocRef = doc(db, "users", userUid);
//     const userDocSnap = await getDoc(userDocRef);

//     if (!userDocSnap.exists()) {
//       await setDoc(userDocRef, {
//         userType: type,
//         profession: type === "owner" ? prof : "",
//         email: auth.currentUser?.email,
//         phoneNumber: auth.currentUser?.phoneNumber,
//         createdAt: new Date(),
//       }, { merge: true });
//     } else {
//       const existingData = userDocSnap.data();
//       if (existingData.userType !== type || existingData.profession !== (type === "owner" ? prof : "")) {
//         await setDoc(userDocRef, {
//           userType: type,
//           profession: type === "owner" ? prof : "",
//         }, { merge: true });
//       }
//     }
//   };

//   const handleGoogleLogin = async () => {
//     if (loading) return;
//     setLoading(true);
//     resetOtpFlow();
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       console.log("Google Login Success:", result.user);
//       await saveUserAdditionalData(result.user.uid, userType, profession);
//       onLogin(userType, profession);
//       toast.success(t.loginSuccess);
//       onClose();
//     } catch (error) {
//       console.error("Google Login Error:", error.code, error.message);
//       let errorMessage = t.loginFailed;
//       if (error.code === 'auth/popup-closed-by-user') {
//           errorMessage = "Login cancelled by user.";
//       } else if (error.code === 'auth/cancelled-popup-request') {
//           errorMessage = "Login attempt already in progress or blocked by browser.";
//       }
//       toast.error(errorMessage + ": " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendOTP = async () => {
//     if (loading) return;
//     setLoading(true);
//     resetOtpFlow();

//     try {
//       if (!phoneNumber || phoneNumber.length < 10) {
//         toast.error(t.validPhoneRequired);
//         setLoading(false);
//         return;
//       }

//       if (!window.recaptchaVerifier) {
//           toast.error("reCAPTCHA is not ready. Please try again in a moment.");
//           console.error("RecaptchaVerifier not initialized before sending OTP.");
//           setLoading(false);
//           return;
//       }

//       const appVerifier = window.recaptchaVerifier;
//       const number = `+91${phoneNumber}`;

//       console.log("Sending OTP to:", number);
//       const result = await signInWithPhoneNumber(auth, number, appVerifier);
//       setConfirmationResult(result);
//       setShowOtpInput(true);
//       setOtpSent(true);
//       toast.success(t.otpSentSuccess);
//       console.log("OTP sent. Confirmation result:", result);
//     } catch (error) {
//       console.error("OTP Send Error:", error.code, error.message);
//       let errorMessage = t.otpSendFailed;
//       if (error.code === 'auth/invalid-phone-number') {
//           errorMessage = "Invalid phone number format.";
//       } else if (error.code === 'auth/too-many-requests') {
//           errorMessage = "Too many OTP requests. Please try again later.";
//       }
//       toast.error(errorMessage + ": " + error.message);
//       resetOtpFlow();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOTPLogin = async () => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       if (!confirmationResult || !otp) {
//         toast.error(t.enterOTP);
//         setLoading(false);
//         return;
//       }

//       console.log("Verifying OTP...");
//       const result = await confirmationResult.confirm(otp);
//       console.log("OTP Login Success:", result.user);
//       await saveUserAdditionalData(result.user.uid, userType, profession);
//       onLogin(userType, profession);
//       toast.success(t.loginSuccess);
//       onClose();
//       resetOtpFlow();
//     } catch (error) {
//       console.error("OTP Login Error:", error.code, error.message);
//       let errorMessage = t.otpVerifyFailed;
//       if (error.code === 'auth/invalid-verification-code') {
//           errorMessage = "Invalid OTP. Please check and try again.";
//       } else if (error.code === 'auth/code-expired') {
//           errorMessage = "OTP expired. Please request a new one.";
//       }
//       toast.error(errorMessage + ": " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEmailLogin = async () => {
//     if (loading) return;
//     setLoading(true);
//     resetOtpFlow();
//     try {
//       if (!email || !password) {
//         toast.error(t.emailPasswordRequired);
//         setLoading(false);
//         return;
//       }
//       const result = await signInWithEmailAndPassword(auth, email, password);
//       console.log("Email Login Success:", result.user);
//       await saveUserAdditionalData(result.user.uid, userType, profession);
//       onLogin(userType, profession);
//       toast.success(t.loginSuccess);
//       onClose();
//     } catch (error) {
//       console.error("Email Login Error:", error.code, error.message);
//       let errorMessage = t.loginFailed;
//       if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
//           errorMessage = "Invalid email or password.";
//       }
//       toast.error(errorMessage + ": " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGuestAccess = () => {
//     onLogin("user", "");
//     onClose();
//     resetOtpFlow();
//   };

//   const texts = {
//     en: {
//       welcome: "Welcome to Buddy In Hills",
//       discover: "Discover Nainital & Uttarakhand",
//       userType: "I am a",
//       user: "User",
//       owner: "Business Owner",
//       profession: "Profession/Type",
//       googleLogin: "Login with Gmail",
//       phone: "Phone Number",
//       sendOTP: "Send OTP",
//       verifyOTP: "Verify OTP",
//       email: "Email",
//       password: "Password",
//       login: "Login",
//       guestAccess: "Explore as Guest",
//       newHere: "New here?",
//       signUp: "Sign Up",
//       language: "Language",
//       enterOTP: "Please enter the OTP.",
//       otpSentSuccess: "OTP sent successfully!",
//       otpSendFailed: "Failed to send OTP",
//       otpVerifyFailed: "Failed to verify OTP",
//       recaptchaExpired: "reCAPTCHA expired, please try again.",
//       loginSuccess: "Logged in successfully!",
//       loginFailed: "Login failed",
//       emailPasswordRequired: "Email and password are required.",
//       validPhoneRequired: "A valid phone number is required.",
//       loading: "Loading..."
//     },
//     hi: {
//       welcome: "Buddy In Hills में आपका स्वागत है",
//       discover: "नैनीताल और उत्तराखंड का अन्वेषण करें",
//       userType: "मैं हूँ",
//       user: "उपयोगकर्ता",
//       owner: "व्यवसाय मालिक",
//       profession: "पेशा/प्रकार",
//       googleLogin: "Gmail से लॉगिन करें",
//       phone: "फ़ोन नंबर",
//       sendOTP: "OTP भेजें",
//       verifyOTP: "OTP सत्यापित करें",
//       email: "ईमेल",
//       password: "पासवर्ड",
//       login: "लॉगिन",
//       guestAccess: "अतिथि के रूप में देखें",
//       newHere: "यहाँ नए हैं?",
//       signUp: "साइन अप",
//       language: "भाषा",
//       enterOTP: "कृपया OTP दर्ज करें।",
//       otpSentSuccess: "OTP सफलतापूर्वक भेजा गया!",
//       otpSendFailed: "OTP भेजने में विफल",
//       otpVerifyFailed: "OTP सत्यापित करने में विफल",
//       recaptchaExpired: "reCAPTCHA समाप्त हो गया, कृपया पुनः प्रयास करें।",
//       loginSuccess: "सफलतापूर्वक लॉगिन किया गया!",
//       loginFailed: "लॉगिन विफल",
//       emailPasswordRequired: "ईमेल और पासवर्ड आवश्यक हैं।",
//       validPhoneRequired: "एक वैध फ़ोन नंबर आवश्यक है।",
//       loading: "लोड हो रहा है..."
//     }
//   };

//   const t = texts[language] || texts.en;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="w-full max-w-sm sm:max-w-md mx-auto px-4 overflow-y-auto max-h-[90vh] scrollbar-hide">
//         <DialogHeader>
//           <DialogTitle className="text-center text-2xl text-primary">
//             {t.welcome}
//           </DialogTitle>
//           <p className="text-center text-muted-foreground">
//             {t.discover}
//           </p>
//         </DialogHeader>

//         <div className="space-y-4">
//           <div className="flex justify-center">
//             <Select value={language} onValueChange={onLanguageChange}>
//               <SelectTrigger className="w-32">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="en">🇺🇸 English</SelectItem>
//                 <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-3">
//             <Label>{t.userType}</Label>
//             <RadioGroup
//               value={userType}
//               onValueChange={(value) => setUserType(value)}
//               className="flex justify-center space-x-6"
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="user" id="user" />
//                 <Label htmlFor="user" className="flex items-center space-x-2 cursor-pointer">
//                   <User className="w-4 h-4" />
//                   <span>{t.user}</span>
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="owner" id="owner" />
//                 <Label htmlFor="owner" className="flex items-center space-x-2 cursor-pointer">
//                   <Building className="w-4 h-4" />
//                   <span>{t.owner}</span>
//                 </Label>
//               </div>
//             </RadioGroup>
//           </div>

//           {userType === "owner" && (
//             <div className="space-y-2">
//               <Label>{t.profession}</Label>
//               <Select value={profession} onValueChange={setProfession}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select your profession" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="resort-hotel">Resort/Hotel</SelectItem>
//                   <SelectItem value="rental-bikes">Rental Bikes</SelectItem>
//                   <SelectItem value="cabs-taxis">Cabs/Taxis</SelectItem>
//                   <SelectItem value="local-guides">Local Guide</SelectItem>
//                   <SelectItem value="tours-treks">Tours/Treks</SelectItem>
//                   <SelectItem value="other">Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           <Separator />

//           <Button
//             onClick={handleGoogleLogin}
//             variant="outline"
//             className="w-full flex items-center gap-2"
//             disabled={loading}
//           >
//             {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             <Mail className="w-4 h-4" />
//             {t.googleLogin}
//           </Button>

//           <Separator />

//           <div className="space-y-2">
//             <Label htmlFor="phone">{t.phone}</Label>
//             <div className="flex gap-2">
//               <Input
//                 id="phone"
//                 placeholder="+91 XXXXX XXXXX"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 className="flex-1"
//                 disabled={loading || otpSent}
//               />
//               {!showOtpInput ? (
//                 <Button onClick={handleSendOTP} className="bg-primary" disabled={loading}>
//                   {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                   {t.sendOTP}
//                 </Button>
//               ) : (
//                 <Button onClick={handleOTPLogin} className="bg-primary" disabled={loading}>
//                   {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                   {t.verifyOTP}
//                 </Button>
//               )}
//             </div>
//             {showOtpInput && (
//               <Input
//                 id="otp"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className="mt-2"
//                 disabled={loading}
//               />
//             )}
//              <div id="recaptcha-container" ref={recaptchaRef} className="mt-2"></div>
//           </div>


//           <Separator />

//           <div className="space-y-3">
//             <div className="space-y-2">
//               <Label htmlFor="email">{t.email}</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="your@email.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={loading}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">{t.password}</Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   disabled={loading}
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={loading}
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </Button>
//               </div>
//             </div>
//             <Button onClick={handleEmailLogin} className="w-full bg-primary" disabled={loading}>
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               {t.login}
//             </Button>
//           </div>

//           <Separator />

//           <Button
//             onClick={handleGuestAccess}
//             variant="outline"
//             className="w-full"
//             disabled={loading}
//           >
//             {t.guestAccess}
//           </Button>

//           <p className="text-center text-sm text-muted-foreground">
//             {t.newHere}{" "}
//             <a href="/signup" className="text-primary cursor-pointer hover:underline">
//               {t.signUp}
//             </a>
//           </p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }