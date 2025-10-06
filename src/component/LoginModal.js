import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Input } from "./Input";
import { Label } from "./label";
import { Separator } from "./separator";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Mail, Phone, Eye, EyeOff, User, Building } from "lucide-react";
import { useState, useEffect } from "react"; // Import useEffect

export function LoginModal({ isOpen, onClose, onLogin, language, onLanguageChange, currentUserType, currentProfession }) {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(currentUserType || "user"); // Initialize with prop
  const [profession, setProfession] = useState(currentProfession || ""); // Initialize with prop

  // Use useEffect to update local state if props change (e.g., from GlobalContext)
  useEffect(() => {
    if (currentUserType) setUserType(currentUserType);
  }, [currentUserType]);

  useEffect(() => {
    if (currentProfession) setProfession(currentProfession);
  }, [currentProfession]);


  const handleGoogleLogin = () => {
    onLogin(userType, profession);
  };

  const handleOTPLogin = () => {
    if (phoneNumber) {
      onLogin(userType, profession);
    }
  };

  const handleEmailLogin = () => {
    if (email && password) {
      onLogin(userType, profession);
    }
  };

  const handleGuestAccess = () => {
    onLogin("user", ""); // No profession for guest
  };

  const texts = {
    en: {
      welcome: "Welcome to NainiExplore",
      discover: "Discover Nainital & Uttarakhand",
      userType: "I am a",
      user: "User",
      owner: "Business Owner",
      profession: "Profession/Type",
      googleLogin: "Login with Gmail",
      phone: "Phone Number",
      sendOTP: "Send OTP",
      email: "Email",
      password: "Password",
      login: "Login",
      guestAccess: "Explore as Guest",
      newHere: "New here?",
      signUp: "Sign Up",
      language: "Language"
    },
    hi: {
      welcome: "NainiExplore में आपका स्वागत है",
      discover: "नैनीताल और उत्तराखंड का अन्वेषण करें",
      userType: "मैं हूँ",
      user: "उपयोगकर्ता",
      owner: "व्यवसाय मालिक",
      profession: "पेशा/प्रकार",
      googleLogin: "Gmail से लॉगिन करें",
      phone: "फ़ोन नंबर",
      sendOTP: "OTP भेजें",
      email: "ईमेल",
      password: "पासवर्ड",
      login: "लॉगिन",
      guestAccess: "अतिथि के रूप में देखें",
      newHere: "यहाँ नए हैं?",
      signUp: "साइन अप",
      language: "भाषा"
    }
  };

  const t = texts[language] || texts.en;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm sm:max-w-md mx-auto px-4 overflow-y-auto max-h-[90vh] scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-primary">
            {t.welcome}
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            {t.discover}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>{t.userType}</Label>
            <RadioGroup
              value={userType}
              onValueChange={(value) => setUserType(value)}
              className="flex justify-center space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="user" />
                <Label htmlFor="user" className="flex items-center space-x-2 cursor-pointer">
                  <User className="w-4 h-4" />
                  <span>{t.user}</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner" className="flex items-center space-x-2 cursor-pointer">
                  <Building className="w-4 h-4" />
                  <span>{t.owner}</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {userType === "owner" && (
            <div className="space-y-2">
              <Label>{t.profession}</Label>
              <Select value={profession} onValueChange={setProfession}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your profession" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resort-hotel">Resort/Hotel</SelectItem>
                  <SelectItem value="rental-bikes">Rental Bikes</SelectItem>
                  <SelectItem value="cabs-taxis">Cabs/Taxis</SelectItem>
                  <SelectItem value="local-guide">Local Guide</SelectItem>
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
          >
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
              />
              <Button onClick={handleOTPLogin} className="bg-primary">
                {t.sendOTP}
              </Button>
            </div>
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
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={handleEmailLogin} className="w-full bg-primary">
              {t.login}
            </Button>
          </div>

          <Separator />

          <Button
            onClick={handleGuestAccess}
            variant="outline"
            className="w-full"
          >
            {t.guestAccess}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t.newHere}{" "}
            <span className="text-primary cursor-pointer hover:underline">
              {t.signUp}
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}