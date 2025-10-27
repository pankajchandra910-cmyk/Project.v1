import React, { useContext, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Edit, Star, Navigation } from 'lucide-react';
import { Button } from '../component/button'; 
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../component/tabs'; 
import { Card, CardHeader, CardTitle, CardContent } from '../component/Card'; 
import { Badge } from '../component/badge'; 
import Header from '../component/Header';
import MobileMenu from "../component/MobileMenu";
import AIchat from '../component/AIchat';
import  CabBookingModal  from '../component/CabBookingModal';
import { GlobalContext } from '../component/GlobalContext'; 
import { toast } from 'sonner';
import { auth } from '../firebase';
import { reauthenticateWithCredential, EmailAuthProvider, updateEmail, updateProfile, signInWithPhoneNumber, RecaptchaVerifier, PhoneAuthProvider, linkWithCredential } from 'firebase/auth';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader, DialogClose } from '../component/dialog';
import { Input } from '../component/Input';

export default function ProfileView() {
  const navigate = useNavigate(); 

  // Destructure state and setters from GlobalContext
  const {
    isLoggedIn,
    userName, setUserName, 
    userPhone, setUserPhone, 
    userEmail, setUserEmail, 
    loginPlatform,
    userType, 
    showMobileMenu, setShowMobileMenu,
    showAIChat, setShowAIChat,
    language,

    // Dynamic user data from context
    userVisitedPlaces,
    userRecentBookings,
    userSavedPlaces,
    userViewpoints,
    userRoutes,
    updateUserProfileInFirestore,
  } = useContext(GlobalContext);

  // Local state for editing profile fields
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userName); // Initialize with current global userName
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState(userPhone); // Initialize with current global userPhone
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(userEmail); // Initialize with current global userEmail

  // Reauth modal state
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [reauthNewEmail, setReauthNewEmail] = useState("");

  // Phone verification modal state
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState(newPhone || "");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState(null);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const recaptchaProfileRef = React.useRef(null);

  // Local state for cab booking modal (if not managed globally)
  const [showCabBooking, setShowCabBooking] = useState(false);

  // Handlers for editing profile details
  const handleSaveName = () => {
    setUserName(newName); // Update global state
    // Update Firebase Auth displayName if possible
    if (auth.currentUser && !auth.currentUser.isAnonymous) {
      updateProfile(auth.currentUser, { displayName: newName }).catch((e) => {
        console.warn('Failed to update auth displayName:', e);
      });
    }
    if (updateUserProfileInFirestore) updateUserProfileInFirestore({ displayName: newName });
    toast.success('Name updated');
    setIsEditingName(false);
  };
  const handleSavePhone = () => {
    // Open phone verification modal where user can send OTP and link credential
    setPhoneToVerify(newPhone.startsWith('+') ? newPhone : `+91${newPhone}`);
    setShowPhoneModal(true);
  };

  const initRecaptchaForProfile = () => {
    try {
      // Ensure the container exists in the DOM. Use the container id string so Firebase can manage loading the
      // grecaptcha script reliably. Using the id avoids timing issues with portal-mounted DOM nodes.
      const containerId = 'recaptcha-profile-container';
      // Create only once
      if (!window.recaptchaVerifierProfile) {
        window.recaptchaVerifierProfile = new RecaptchaVerifier(containerId, { size: 'invisible' }, auth);
      }
      // Ensure the widget is rendered
      if (window.recaptchaVerifierProfile && typeof window.recaptchaVerifierProfile.render === 'function') {
        // render returns a promise that resolves to widgetId
        window.recaptchaVerifierProfile.render().catch((e) => console.warn('reCAPTCHA render warning:', e));
      }
      return window.recaptchaVerifierProfile;
    } catch (e) {
      console.warn('Failed to init recaptcha for profile phone verification:', e);
      return null;
    }
  };

  const handleSendPhoneOTP = async () => {
    if (!phoneToVerify || phoneToVerify.length < 7) {
      toast.error('Please enter a valid phone number with country code.');
      return;
    }
    setPhoneLoading(true);
    try {
      const appVerifier = initRecaptchaForProfile();
      if (!appVerifier) throw new Error('reCAPTCHA unavailable');
      const res = await signInWithPhoneNumber(auth, phoneToVerify, appVerifier);
      setPhoneConfirmationResult(res);
      setPhoneOtpSent(true);
      toast.success('OTP sent to ' + phoneToVerify);
    } catch (e) {
      console.warn('Phone OTP send failed:', e);
      toast.error('Failed to send OTP: ' + (e.message || e.code));
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleConfirmPhoneOTP = async () => {
    if (!phoneConfirmationResult || !phoneOtp) {
      toast.error('Please enter the OTP.');
      return;
    }
    setPhoneLoading(true);
    try {
      const verificationId = phoneConfirmationResult.verificationId || phoneConfirmationResult;
      const phoneCred = PhoneAuthProvider.credential(verificationId, phoneOtp);
      // Link credential to current user
      await linkWithCredential(auth.currentUser, phoneCred);
      // Update Firestore and UI
      await updateUserProfileInFirestore({ phoneNumber: phoneToVerify });
      setUserPhone(phoneToVerify);
      toast.success('Phone number verified and linked to account.');
      setShowPhoneModal(false);
      setIsEditingPhone(false);
      setPhoneOtp("");
      setPhoneConfirmationResult(null);
      setPhoneOtpSent(false);
    } catch (e) {
      console.error('Phone OTP confirm failed:', e);
      toast.error('Failed to verify phone: ' + (e.message || e.code));
    } finally {
      setPhoneLoading(false);
    }
  };
  const handleSaveEmail = () => {
    // Ask the user if they also want to change the authentication email (this requires re-auth)
    const doAuthChange = window.confirm('Also change authentication email (requires entering your password)? Click OK to proceed, Cancel to update profile only.');
    if (doAuthChange) {
      // Delegate to the reauth flow which will update auth and Firestore
      handleChangeAuthEmail(newEmail)
        .then(() => {
          setIsEditingEmail(false);
        })
        .catch((e) => {
          // handleChangeAuthEmail already toasts; leave UI editable
          console.warn('Auth email change cancelled or failed:', e);
        });
    } else {
      setUserEmail(newEmail); // Update global state
      if (updateUserProfileInFirestore) updateUserProfileInFirestore({ email: newEmail });
      toast.success('Email updated (profile only). Use Change Auth Email to update authentication email.');
      setIsEditingEmail(false);
    }
  };

  // If newEmailParam is passed, open a reauthentication modal to securely change auth email
  const handleChangeAuthEmail = async (newEmailParam) => {
    if (!auth.currentUser) {
      toast.error('No authenticated user.');
      return;
    }
    const currentEmail = auth.currentUser.email;
    const newEmail = newEmailParam || currentEmail || '';
    // Open reauth modal with the new email prefilled
    setReauthNewEmail(newEmail);
    setReauthPassword('');
    setShowReauthModal(true);
  };

  // Perform reauthentication using password and update the auth email + Firestore
  const performReauthAndChangeEmail = async () => {
    if (!auth.currentUser) {
      toast.error('No authenticated user.');
      return;
    }
    if (!reauthPassword) {
      toast.error('Please enter your current password to reauthenticate.');
      return;
    }
    setShowReauthModal(false);
    try {
      const currentEmail = auth.currentUser.email;
      const cred = EmailAuthProvider.credential(currentEmail, reauthPassword);
      await reauthenticateWithCredential(auth.currentUser, cred);
      if (reauthNewEmail && reauthNewEmail !== currentEmail) {
        await updateEmail(auth.currentUser, reauthNewEmail);
        if (updateUserProfileInFirestore) await updateUserProfileInFirestore({ email: reauthNewEmail });
        setUserEmail(reauthNewEmail);
        toast.success('Authentication email updated successfully.');
        setIsEditingEmail(false);
      } else {
        toast.success('Reauthentication successful. No email change requested.');
      }
    } catch (e) {
      console.error('Reauth/email change failed:', e);
      toast.error('Failed to reauthenticate or change email: ' + (e.message || e.code));
    } finally {
      setReauthPassword('');
    }
  };

  // Update local state when global userName changes (e.g., after login or initial load)
  // This is important if userName can change from other parts of the app
  React.useEffect(() => {
    setNewName(userName);
  }, [userName]);
  React.useEffect(() => {
    setNewPhone(userPhone);
  }, [userPhone]);
  React.useEffect(() => {
    setNewEmail(userEmail);
  }, [userEmail]);


  const handleSearch = useCallback((query) => {
    navigate(`/search?q=${query}`);
  }, [navigate]);

  const handleLogoClick = useCallback(() => {
    if (userType === "owner") {
      navigate("/owner-dashboard");
    } else {
      navigate("/"); // Navigate to home page for regular users
    }
  }, [navigate, userType]);


  const handleExploreMore = useCallback((category) => {
    // This assumes you have detail pages like /places, /viewpoints, /routes
    // Adjust the navigation path based on your actual routing
    navigate(`/${category.toLowerCase()}`); 
  }, [navigate]);

  // If the user is not logged in, redirect them or show a login prompt
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-sm mx-auto">
          <CardTitle className="mb-4">Please Log In</CardTitle>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to view your profile.
          </p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isLoggedIn={isLoggedIn}
        onSearch={handleSearch}
        userName={userName}
        onLogoClick={handleLogoClick}
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
        showMobileMenu={showMobileMenu}
      />
      {showMobileMenu && <MobileMenu onClose={() => setShowMobileMenu(false)} />}

      <main className="container mx-auto px-4 py-8 space-y-8 lg:space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-muted-foreground text-base">Manage your travel preferences and bookings</p>
          </div>
          <Button onClick={() => setShowAIChat(true)} className="bg-secondary px-6 py-3 rounded-lg text-lg">
            <MessageCircle className="w-5 h-5 mr-2" />
            Ask AI
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 md:grid-cols-5 ">
            <TabsTrigger value="profile" className="text-xs md:text-sm">Profile</TabsTrigger>
            <TabsTrigger value="bookings" className="text-xs md:text-sm">Bookings</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs md:text-sm">Favorites</TabsTrigger>
            <TabsTrigger value="viewpoints" className="text-xs md:text-sm">Viewpoints</TabsTrigger>
            <TabsTrigger value="routes" className="text-xs md:text-sm">Routes</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-semibold text-gray-800">Profile Details</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Welcome, {userName}! Manage your account information below.
                </p>
              </CardHeader>
              <CardContent className="space-y-6 p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {isEditingName ? (
                        <input
                          id="userName"
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="grow bg-transparent outline-none text-gray-900"
                        />
                      ) : (
                        <span className="text-gray-900">{userName}</span>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => isEditingName ? handleSaveName() : setIsEditingName(true)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {isEditingName ? 'Save' : <Edit className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  {/* Phone Number */}
                  <div>
                    <label htmlFor="userPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {isEditingPhone ? (
                        <input
                          id="userPhone"
                          type="tel"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          className="grow bg-transparent outline-none text-gray-900"
                        />
                      ) : (
                        <span className="text-gray-900">{userPhone}</span>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => isEditingPhone ? handleSavePhone() : setIsEditingPhone(true)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {isEditingPhone ? 'Save' : <Edit className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  {/* Email Address */}
                  <div>
                    <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {isEditingEmail ? (
                        <input
                          id="userEmail"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="grow bg-transparent outline-none text-gray-900"
                        />
                      ) : (
                        <span className="text-gray-900">{userEmail}</span>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => isEditingEmail ? handleSaveEmail() : setIsEditingEmail(true)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {isEditingEmail ? 'Save' : <Edit className="w-4 h-4" />}
                      </Button>
                      {/* Only show change-auth-email for non-anonymous authenticated users */}
                      {!isEditingEmail && (
                        <Button variant="outline" size="sm" className="ml-2" onClick={handleChangeAuthEmail}>
                          Change Auth Email
                        </Button>
                      )}
                    </div>
                  </div>
                  {/* Login Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Login Method</label>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-blue-700 font-medium">Logged in via {loginPlatform}</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 text-xs">
                        {userType === 'user' ? 'User' : 'Owner'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-semibold text-gray-800">Visited Places</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-wrap gap-3">
                  {userVisitedPlaces.length > 0 ? (
                    userVisitedPlaces.map((place) => (
                      <Badge 
                        key={place.id} 
                        variant={place.status === 'visited' ? 'secondary' : 'outline'}
                        className={`px-4 py-2 text-sm rounded-full ${place.status === 'visited' ? 'bg-green-100 text-green-800' : 'border-gray-300 text-gray-600'}`}
                      >
                        {place.name} {place.status === 'visited' && '✓'}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic">No places visited yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-semibold text-gray-800">Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                  {userRecentBookings.length > 0 ? (
                    userRecentBookings.map((booking) => (
                      <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div>
                          <h4 className="font-medium text-lg text-gray-800">{booking.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{booking.dates}</p>
                        </div>
                        <Badge 
                          className={`mt-2 sm:mt-0 px-4 py-2 text-sm font-semibold rounded-full ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800' // Example for other statuses
                          }`}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic">No recent bookings.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-semibold text-gray-800">Saved Places</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userSavedPlaces.length > 0 ? (
                    userSavedPlaces.map((place) => (
                      <div key={place.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-lg text-gray-800">{place.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{place.location}</p>
                        <div className="flex items-center space-x-1 mt-3">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-700">{place.rating}</span>
                        </div>
                         {/* Optional: Add a button to view details of the favorited place */}
                        <Button 
                           variant="outline" 
                           size="sm" 
                           className="mt-4 w-full"
                           onClick={() => navigate(`/${place.type}-details/${place.id}`)}
                        >
                           View Details
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-muted-foreground italic">No saved places yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="viewpoints" className="space-y-6">
            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-semibold text-gray-800">Viewpoints within 50km</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Discover amazing viewpoints around Nainital based on your interests
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid gap-4">
                  {userViewpoints.length > 0 ? (
                    userViewpoints.map((viewpoint) => (
                      <div 
                        key={viewpoint.id} 
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => navigate(`/viewpoints-details/${viewpoint.id}`)} // More specific navigation
                      >
                        <div>
                          <h4 className="font-medium text-lg text-gray-800">{viewpoint.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{viewpoint.description}</p>
                          <p className="text-sm text-muted-foreground">{viewpoint.distance}</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-700">{viewpoint.rating}</span>
                          <Button variant="outline" size="sm" className="ml-2">
                            <Navigation className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic">No viewpoints found for you.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-semibold text-gray-800">Adventure Routes & Trails</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Explore trekking routes within 50km of Nainital
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid gap-4">
                  {userRoutes.length > 0 ? (
                    userRoutes.map((route) => (
                      <div 
                        key={route.id} 
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => navigate(`/routes-details/${route.id}`)} // More specific navigation
                      >
                        <div>
                          <h4 className="font-medium text-lg text-gray-800">{route.name}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge 
                              variant={route.difficulty === 'Easy' ? 'secondary' : route.difficulty === 'Moderate' ? 'outline' : 'destructive'}
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                route.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                                route.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {route.difficulty}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{route.distance}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-700">{route.rating}</span>
                          <Button variant="outline" size="sm" className="ml-2">
                            <Navigation className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic">No adventure routes found for you.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* AI Chat Modal */}
      <AIchat 
        isOpen={showAIChat} 
        onClose={() => setShowAIChat(false)}
        language={language}
      />

      {/* Phone Verification Modal */}
      <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Phone Number</DialogTitle>
            <DialogDescription>We'll send an OTP to verify and link your phone number to your account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <label className="block text-sm text-gray-700">Phone to verify</label>
            <Input value={phoneToVerify} onChange={(e) => setPhoneToVerify(e.target.value)} placeholder="+911234567890" />
            <div id="recaptcha-profile-container" ref={recaptchaProfileRef} />
            {!phoneOtpSent ? (
              <Button onClick={handleSendPhoneOTP} disabled={phoneLoading} className="mt-2">{phoneLoading ? 'Sending...' : 'Send OTP'}</Button>
            ) : (
              <>
                <label className="block text-sm text-gray-700">Enter OTP</label>
                <Input value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} placeholder="123456" />
                <div className="flex gap-2 mt-2">
                  <Button onClick={handleConfirmPhoneOTP} disabled={phoneLoading}>{phoneLoading ? 'Verifying...' : 'Verify & Link'}</Button>
                  <Button variant="ghost" onClick={() => { setPhoneOtp(''); setPhoneConfirmationResult(null); setPhoneOtpSent(false); }}>Cancel</Button>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <DialogClose />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reauthentication Modal for Email Change */}
      <Dialog open={showReauthModal} onOpenChange={setShowReauthModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Identity</DialogTitle>
            <DialogDescription>Enter your current password to confirm changing your authentication email.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <label className="block text-sm text-gray-700">New Email</label>
            <Input value={reauthNewEmail} onChange={(e) => setReauthNewEmail(e.target.value)} placeholder="you@example.com" />
            <label className="block text-sm text-gray-700">Current Password</label>
            <Input type="password" value={reauthPassword} onChange={(e) => setReauthPassword(e.target.value)} placeholder="Your current password" />
          </div>
          <DialogFooter>
            <div className="flex gap-2">
              <Button onClick={performReauthAndChangeEmail}>Confirm</Button>
              <Button variant="ghost" onClick={() => setShowReauthModal(false)}>Cancel</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Cab Booking Modal */}
      <CabBookingModal 
        isOpen={showCabBooking} 
        onClose={() => setShowCabBooking(false)}
      />
    </div>
  );
};

