import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { Button } from "../component/button";
import { Input } from "../component/Input";
import { Label } from "../component/label";
import { Separator } from "../component/separator";
import { RadioGroup, RadioGroupItem } from "../component/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/select";
import { Eye, EyeOff, User, Building, Loader2 } from "lucide-react";
import { toast } from "sonner"; // For notifications

// --- Firebase Imports ---
import { auth, db, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const navigate = useNavigate();
  const { language, setLanguage } = useContext(GlobalContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userName, setUserName] = useState(""); // For user display name
  const [userType, setUserType] = useState("user");
  const [profession, setProfession] = useState(""); // Initialized to empty string
  const [loading, setLoading] = useState(false);

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
      loading: "Creating account..."
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
      loading: "खाता बना रहा है..."
    }
  };

  const t = texts[language] || texts.en;

  const handleSignup = async () => {
    if (loading) return;

    if (!userName || !email || !password || !confirmPassword) {
      toast.error(t.fillAllFields);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
        // If current user is anonymous, link the anonymous account to email/password
        let user;
        if (auth.currentUser && auth.currentUser.isAnonymous) {
          const cred = EmailAuthProvider.credential(email, password);
          const linked = await linkWithCredential(auth.currentUser, cred);
          user = linked.user;
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          user = userCredential.user;
        }

        // Update user profile with display name
        try {
          await updateProfile(user, { displayName: userName });
        } catch (e) {
          // Non-fatal: profile update may fail if provider doesn't allow it immediately
          console.warn('updateProfile failed:', e);
        }

        // Store additional user data in Firestore
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          email: user.email || email,
          displayName: userName,
          userType: userType,
          profession: userType === "owner" ? profession : "",
          createdAt: serverTimestamp(),
        }, { merge: true });

        toast.success(t.signupSuccess);
        // If we linked an anonymous account, the user is already signed in — send them to home
        navigate(user && user.isAnonymous ? "/" : "/");
    } catch (error) {
      console.error("Signup Error:", error.message);
      toast.error(t.signupFailed + ": " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
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

          <Separator />

          <div className="space-y-3">
            <Label>{t.userType}</Label>
            <RadioGroup
              value={userType}
              onValueChange={(value) => setUserType(value)}
              className="flex justify-center space-x-6"
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

          <Button onClick={handleSignup} className="w-full bg-primary" disabled={loading}>
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