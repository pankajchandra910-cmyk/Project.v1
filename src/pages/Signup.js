import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { Button } from "../component/button";
import { Input } from "../component/Input";
import { Label } from "../component/label";
import { Separator } from "../component/separator";
import { RadioGroup, RadioGroupItem } from "../component/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/select";
import { Eye, EyeOff, User, Building, Loader2 } from "lucide-react";
import { toast } from "sonner";

// --- Firebase Imports ---
import { auth, db, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithPhoneNumber, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const navigate = useNavigate();
  const { language, setLanguage, loadingUser, isLoggedIn } = useContext(GlobalContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("user");
  const [profession, setProfession] = useState("");
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('email'); // 'email' | 'phone' | 'google'

  // Phone signup state
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const texts = {
    en: {
      createAccount: "Create Your Account",
      getStarted: "Get started with Buddy In Hills",
      userName: "Full Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      userType: "I am a",
      user: "User",
      owner: "Business Owner",
      profession: "Profession/Type",
      signup: "Sign Up",
      alreadyHaveAccount: "Already have an account?",
      login: "Login",
      language: "Language",
      passwordMismatch: "Passwords do not match.",
      fillAllFields: "Please fill in all required fields.",
      signupSuccess: "Account created successfully! Redirecting to login...",
      signupFailed: "Sign up failed",
      loading: "Creating account...",
      sendOtp: "Send OTP",
      resendOtp: "Resend OTP",
      enterPhone: "Please enter a phone number.",
      otpSentTo: "OTP sent to ",
      phoneVerified: "Phone verified successfully!",
      invalidOtp: "Invalid OTP",
      noOtpSession: "No OTP session found. Please send OTP first.",
      failedToCreatePhoneAccount: "Failed to create phone account:",
      phoneVerificationNotCompleted: "Please verify your phone number using OTP first.",
      verificationEmailSent: "Verification email sent. Please check your inbox.",
      failedToSendVerificationEmail: "Failed to send verification email:",
      fallbackOtpSaveSuccess: "OTP service unavailable — saved phone as unverified. You can complete verification later.",
      fallbackOtpSaveFailed: "Failed to send OTP and failed to save unverified phone.",
      passwordTooShort: "Password should be at least 6 characters long.",
      verifyOtp: "Verify OTP",
    },
    hi: {
      createAccount: "अपना खाता बनाएँ",
      getStarted: "Buddy In Hills के साथ शुरुआत करें",
      userName: "पूरा नाम",
      email: "ईमेल",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      userType: "मैं हूँ",
      user: "उपयोगकर्ता",
      owner: "व्यवसाय मालिक",
      profession: "पेशा/प्रकार",
      signup: "साइन अप करें",
      alreadyHaveAccount: "पहले से ही एक खाता है?",
      login: "लॉगिन करें",
      language: "भाषा",
      passwordMismatch: "पासवर्ड मेल नहीं खाते।",
      fillAllFields: "कृपया सभी आवश्यक फ़ील्ड भरें।",
      signupSuccess: "खाता सफलतापूर्वक बनाया गया! लॉगिन पर रीडायरेक्ट हो रहा है...",
      signupFailed: "साइन अप विफल",
      loading: "खाता बना रहा है...",
      sendOtp: "OTP भेजें",
      resendOtp: "OTP पुनः भेजें",
      enterPhone: "कृपया एक फ़ोन नंबर दर्ज करें।",
      otpSentTo: "OTP भेजा गया: ",
      phoneVerified: "फ़ोन सफलतापूर्वक सत्यापित हुआ!",
      invalidOtp: "अमान्य OTP",
      noOtpSession: "कोई OTP सत्र नहीं मिला। कृपया पहले OTP भेजें।",
      failedToCreatePhoneAccount: "फ़ोन खाता बनाने में विफल:",
      phoneVerificationNotCompleted: "कृपया पहले OTP का उपयोग करके अपना फ़ोन नंबर सत्यापित करें।",
      verificationEmailSent: "सत्यापन ईमेल भेजा गया। कृपया अपना इनबॉक्स जांचें।",
      failedToSendVerificationEmail: "सत्यापन ईमेल भेजने में विफल:",
      fallbackOtpSaveSuccess: "OTP सेवा अनुपलब्ध — फ़ोन को असत्यापित के रूप में सहेजा गया। आप बाद में सत्यापन पूरा कर सकते हैं।",
      fallbackOtpSaveFailed: "OTP भेजने में विफल और असत्यापित फ़ोन सहेजने में विफल।",
      passwordTooShort: "पासवर्ड कम से कम 6 वर्णों का होना चाहिए।",
      verifyOtp: "OTP सत्यापित करें",
    }
  };

  const t = texts[language] || texts.en;

  useEffect(() => {
    if (!loadingUser && isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, loadingUser, navigate]);

  const handleSignup = async () => {
    if (loading) return;

    if (!userName || !userType) {
      toast.error(t.fillAllFields);
      return;
    }
    if (userType === 'owner' && !profession) {
      toast.error(t.fillAllFields);
      return;
    }

    setLoading(true);
    try {
      let user = null;
      let actualSignupMethod = method;

      if (method === 'google') {
        const result = await signInWithPopup(auth, googleProvider);
        user = result.user;
        actualSignupMethod = 'google';
      } else if (method === 'phone') {
        if (!otpVerified) {
          toast.error(t.phoneVerificationNotCompleted);
          setLoading(false);
          return;
        }

        // If phone method, auth.currentUser should already be the verified user from confirmOtp
        user = auth.currentUser;

        if (!user) {
          throw new Error("Phone verification complete, but no active user session. Please ensure Firebase configuration is correct or try logging in.");
        }
        actualSignupMethod = 'phone';
      } else { // Email method
        if (!email || !password || !confirmPassword) {
          toast.error(t.fillAllFields);
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          toast.error(t.passwordMismatch);
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          toast.error(t.passwordTooShort);
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        actualSignupMethod = 'email';
      }

      if (user && userName) {
        try {
          await updateProfile(user, { displayName: userName });
        } catch (e) {
          console.warn('updateProfile failed:', e);
        }
      }

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          email: user.email || email || null,
          displayName: userName,
          phoneNumber: user.phoneNumber || phone || null, // Ensure phone number is saved
          signupMethod: actualSignupMethod,
          userType: userType,
          profession: userType === "owner" ? profession : "",
          createdAt: serverTimestamp(),
          phoneVerified: method === 'phone' ? otpVerified : (user.phoneNumber && user.phoneNumber.length > 0),
        }, { merge: true });

        try {
          if (method === 'email' && auth.currentUser && auth.currentUser.email && !auth.currentUser.emailVerified) {
            await auth.currentUser.sendEmailVerification();
            toast.success(t.verificationEmailSent);
          }
        } catch (e) {
          console.warn(t.failedToSendVerificationEmail, e);
        }
      }

      toast.success(t.signupSuccess);
      navigate('/');
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(t.signupFailed + ": " + (error.message || String(error)));
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = useCallback(async () => {
    if (!phone) {
      toast.error(t.enterPhone);
      return;
    }
    setLoading(true);
    try {
      const number = phone.startsWith('+') ? phone : `+91${phone}`;
      console.log("Sending OTP to normalized phone number:", number);

      // NO RECAPTCHA VERIFIER HERE - DANGEROUS FOR PRODUCTION
      const result = await signInWithPhoneNumber(auth, number);
      setConfirmationResult(result);
      setOtpSent(true);
      setOtpVerified(false);
      toast.success(t.otpSentTo + number);
    } catch (e) {
      console.error('sendOtp error', e);
      // Fallback logic for quota exceeded etc. can be kept, but main issue is no appVerifier
      const code = e?.code || '';
      const msg = (e && e.message) || '';
      if (code.includes('billing') || msg.toLowerCase().includes('billing') || msg.toLowerCase().includes('recaptcha') || code === 'auth/quota-exceeded') {
        try {
          const cleaned = phone.replace(/[^0-9]/g, '');
          const docId = `phone_${cleaned}`;
          await setDoc(doc(db, 'unverified_phone_signups', docId), {
            phone: phone,
            name: userName || null,
            userType,
            profession,
            signupMethod: 'phone',
            createdAt: serverTimestamp(),
          }, { merge: true });
          toast.success(t.fallbackOtpSaveSuccess);
        } catch (saveErr) {
          console.error('Fallback save unverified phone failed', saveErr);
          toast.error(t.fallbackOtpSaveFailed);
        }
      } else {
        toast.error('Failed to send OTP: ' + (e.message || String(e)));
      }
    } finally {
      setLoading(false);
    }
  }, [phone, userName, userType, profession, t, auth, setLoading, setConfirmationResult, setOtpSent, setOtpVerified, db]);

  const confirmOtp = useCallback(async () => {
    if (!confirmationResult) {
      toast.error(t.noOtpSession);
      return;
    }
    if (!phoneOtp) {
      toast.error("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      await confirmationResult.confirm(phoneOtp);
      setOtpSent(false);
      setOtpVerified(true);
      toast.success(t.phoneVerified);
    } catch (e) {
      console.error('confirmOtp error', e);
      toast.error(t.invalidOtp + ": " + (e.message || ''));
    } finally {
      setLoading(false);
    }
  }, [confirmationResult, phoneOtp, t, setLoading, setOtpSent, setOtpVerified]);


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
          <h2 className="text-3xl font-bold text-primary">{t.createAccount}</h2>
          <p className="text-muted-foreground">{t.getStarted}</p>
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
          <div className="space-y-2">
            <Label htmlFor="userName">{t.userName}</Label>
            <Input
              id="userName"
              placeholder="John Doe"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Signup method selector */}
          <div className="flex items-center justify-center space-x-2">
            <button type="button" className={`px-3 py-1 rounded ${method === 'email' ? 'bg-primary text-white' : 'border'}`} onClick={() => setMethod('email')}>Email</button>
            <button type="button" className={`px-3 py-1 rounded ${method === 'phone' ? 'bg-primary text-white' : 'border'}`} onClick={() => { setMethod('phone'); setOtpVerified(false); }}>Phone</button>
            <button type="button" className={`px-3 py-1 rounded ${method === 'google' ? 'bg-primary text-white' : 'border'}`} onClick={() => setMethod('google')}>Google</button>
          </div>

          {method === 'email' && (
            <>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}

          {method === 'phone' && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <Input
                  id="phone"
                  placeholder="+919876543210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setOtpSent(false);
                    setOtpVerified(false);
                    setPhoneOtp("");
                  }}
                  disabled={loading || otpSent}
                  className="w-full"
                />
                {!otpSent && !otpVerified && (
                  <Button type="button" onClick={sendOtp} disabled={loading} className="w-full sm:w-auto">
                    {t.sendOtp}
                  </Button>
                )}
                {/* Always show resend if OTP was sent but not verified yet */}
                {otpSent && !otpVerified && (
                  <Button type="button" onClick={sendOtp} disabled={loading} className="w-full sm:w-auto">
                    {t.resendOtp}
                  </Button>
                )}
              </div>

              {otpSent && !otpVerified && (
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
                  <Input placeholder="Enter OTP" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} disabled={loading} className="w-full" />
                  <Button type="button" onClick={confirmOtp} disabled={loading} className="w-full sm:w-auto">
                    {t.verifyOtp}
                  </Button>
                </div>
              )}
              {otpVerified && (
                <p className="text-sm text-green-600 mt-2">{t.phoneVerified}</p>
              )}
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <Label>{t.userType}</Label>
            <RadioGroup
              value={userType}
              onValueChange={(value) => setUserType(value)}
              className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6"
              disabled={loading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="user-signup" />
                <Label htmlFor="user-signup" className="flex items-center space-x-2 cursor-pointer">
                  <User className="w-4 h-4" />
                  <span>{t.user}</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owner" id="owner-signup" />
                <Label htmlFor="owner-signup" className="flex items-center space-x-2 cursor-pointer">
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

          <Button onClick={handleSignup} className="w-full bg-primary" disabled={loading || (method === 'phone' && !otpVerified)}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.signup}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t.alreadyHaveAccount}{" "}
            <a href="/login" className="text-primary cursor-pointer hover:underline">
              {t.login}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}