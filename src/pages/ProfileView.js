import React, { useContext, useCallback, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, Edit, Star, Navigation, Loader2 } from 'lucide-react';
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
import { reauthenticateWithCredential, EmailAuthProvider, updateEmail, updateProfile, signInWithPhoneNumber, PhoneAuthProvider, linkWithCredential } from 'firebase/auth';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '../component/dialog';
import { Input } from '../component/Input';
import { Label } from '../component/label';

export default function ProfileView() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isLoggedIn, userName, setUserName, userPhone, setUserPhone, userEmail, setUserEmail,
    loginPlatform, userType, showMobileMenu, setShowMobileMenu, showAIChat, setShowAIChat,
    language, userVisitedPlaces, userRecentBookings, userSavedPlaces, userViewpoints,
    userRoutes, updateUserProfileInFirestore, userPhoneVerified,
  } = useContext(GlobalContext);

  // Local state for UI
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userName);

  // Re-authentication modal state
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [reauthNewEmail, setReauthNewEmail] = useState("");
  const [reauthLoading, setReauthLoading] = useState(false);

  // Phone verification modal state
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState(userPhone || "");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState(null);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  const [showCabBooking, setShowCabBooking] = useState(false);

  // Sync local state with global context changes
  useEffect(() => { setNewName(userName); }, [userName]);
  useEffect(() => { setPhoneToVerify(userPhone); }, [userPhone]);

  // Check for URL query params to trigger modals
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verifyPhone') === '1' && !userPhoneVerified) {
        setPhoneToVerify(userPhone || '');
        setShowPhoneModal(true);
    }
  }, [location.search, userPhone, userPhoneVerified]);


  const handleSaveName = async () => {
    if (!newName) return toast.error("Name cannot be empty.");
    try {
        if(auth.currentUser){
            await updateProfile(auth.currentUser, { displayName: newName });
        }
        await updateUserProfileInFirestore({ displayName: newName });
        setUserName(newName);
        toast.success('Name updated successfully');
        setIsEditingName(false);
    } catch(error) {
        toast.error('Failed to update name');
        // console.error("Name update error: ", error);
    }
  };

  const handleSendPhoneOTP = async () => {
    if (!phoneToVerify || phoneToVerify.length < 10) {
      return toast.error('Please enter a valid phone number with country code.');
    }
    setPhoneLoading(true);
    try {
      // For production, enabling App Check is highly recommended.
      // This setup uses an invisible reCAPTCHA managed by the Firebase SDK.
      const confirmationResult = await signInWithPhoneNumber(auth, phoneToVerify);
      setPhoneConfirmationResult(confirmationResult);
      setPhoneOtpSent(true);
      toast.success('OTP sent to ' + phoneToVerify);
    } catch (e) {
      toast.error('Failed to send OTP: ' + e.code);
      // console.error('Phone OTP error:', e);
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleConfirmPhoneOTP = async () => {
    if (!phoneConfirmationResult || !phoneOtp) {
      return toast.error('Please enter the OTP.');
    }
    setPhoneLoading(true);
    try {
      const phoneCred = PhoneAuthProvider.credential(phoneConfirmationResult.verificationId, phoneOtp);
      await linkWithCredential(auth.currentUser, phoneCred);
      await updateUserProfileInFirestore({ phoneNumber: phoneToVerify, phoneVerified: true });
      setUserPhone(phoneToVerify);
      toast.success('Phone number verified and linked!');
      // Reset and close modal
      setShowPhoneModal(false);
      setPhoneOtp("");
      setPhoneConfirmationResult(null);
      setPhoneOtpSent(false);
    } catch (e) {
      // console.error('Phone OTP confirm failed:', e);
      toast.error('Failed to verify OTP: ' + e.code);
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleUpdateAuthEmail = (newEmail) => {
    const user = auth.currentUser;
    // Check if the user's sign-in method is email/password.
    if (user && user.providerData.some(provider => provider.providerId === 'password')) {
        setReauthNewEmail(newEmail);
        setReauthPassword('');
        setShowReauthModal(true);
    } else {
        toast.info('You can only change the email for accounts created with an email and password.');
    }
  };

  const performReauthAndChangeEmail = async () => {
    const user = auth.currentUser;
    if (!user) return toast.error('No user is logged in.');
    if (!reauthPassword) return toast.error('Please enter your password.');
    if (!reauthNewEmail) return toast.error('Please enter a new email address.');

    setReauthLoading(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, reauthPassword);
      await reauthenticateWithCredential(user, cred);

      await updateEmail(user, reauthNewEmail);
      await updateUserProfileInFirestore({ email: reauthNewEmail });

      setUserEmail(reauthNewEmail); // Update context state
      toast.success('Authentication email updated successfully.');
      setShowReauthModal(false); // Close modal
    } catch (e) {
      toast.error('Failed to update email: ' + e.code);
      // console.error('Email update error:', e);
    } finally {
      setReauthLoading(false);
      setReauthPassword('');
    }
  };

  const handleSearch = useCallback((query) => navigate(`/search?q=${query}`), [navigate]);
  const handleLogoClick = useCallback(() => navigate(userType === "owner" ? "/owner-dashboard" : "/"), [navigate, userType]);


  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="p-8 text-center max-w-sm mx-auto">
          <CardTitle className="mb-4">Please Log In</CardTitle>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your profile.</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} onSearch={handleSearch} userName={userName} onLogoClick={handleLogoClick} onMenuToggle={() => setShowMobileMenu(!showMobileMenu)} showMobileMenu={showMobileMenu}/>
      {showMobileMenu && <MobileMenu onClose={() => setShowMobileMenu(false)} />}

      <main className="container mx-auto px-4 py-8 space-y-8 lg:space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div><h1 className="text-3xl font-bold text-gray-900">My Profile</h1><p className="text-muted-foreground text-base">Manage your travel preferences and bookings</p></div>
          <Button onClick={() => setShowAIChat(true)} className="bg-secondary px-6 py-3 rounded-lg text-lg"><MessageCircle className="w-5 h-5 mr-2" />Ask AI</Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="viewpoints">Viewpoints</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6 md:p-8 bg-white shadow-sm rounded-lg">
                <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-2xl font-semibold text-gray-800">Profile Details</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">Welcome, {userName}! Manage your account information below.</p>
                </CardHeader>
                <CardContent className="space-y-6 p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <Label htmlFor="profile-name">Name</Label>
                            <div className="flex items-center justify-between p-3 mt-1 bg-gray-50 rounded-lg border">
                                {isEditingName ? (<Input id="profile-name" value={newName} onChange={(e) => setNewName(e.target.value)} className="grow bg-transparent border-0 outline-none focus:ring-0" />) : (<span className="text-gray-900">{userName}</span>)}
                                <Button variant="ghost" size="sm" onClick={() => isEditingName ? handleSaveName() : setIsEditingName(true)}>{isEditingName ? 'Save' : <Edit className="w-4 h-4" />}</Button>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="profile-phone">Phone Number</Label>
                            <div className="flex items-center justify-between p-3 mt-1 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3">
                                  <span className="text-gray-900">{userPhone || 'Not provided'}</span>
                                  <Badge variant={userPhoneVerified ? "secondary" : "destructive"}>{userPhoneVerified ? "Verified" : "Unverified"}</Badge>
                                </div>
                                <Button variant="link" size="sm" onClick={() => setShowPhoneModal(true)}>
                                  {userPhoneVerified ? 'Change' : 'Verify'}
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="profile-email">Email Address</Label>
                             <div className="flex items-center justify-between p-3 mt-1 bg-gray-50 rounded-lg border">
                                <span className="text-gray-900">{userEmail}</span>
                                <Button variant="link" size="sm" onClick={() => handleUpdateAuthEmail(userEmail)}>Change</Button>
                             </div>
                        </div>
                         <div>
                            <Label>Login Method</Label>
                            <div className="flex items-center justify-between p-3 mt-1 bg-blue-50 rounded-lg border border-blue-200">
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
                  {userVisitedPlaces && userVisitedPlaces.length > 0 ? (
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
                  {userRecentBookings && userRecentBookings.length > 0 ? (
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
                            'bg-yellow-100 text-yellow-800'
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
                  {userSavedPlaces && userSavedPlaces.length > 0 ? (
                    userSavedPlaces.map((place) => (
                      <div key={place.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-lg text-gray-800">{place.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{place.location}</p>
                        <div className="flex items-center space-x-1 mt-3">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-700">{place.rating}</span>
                        </div>
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
                  {userViewpoints && userViewpoints.length > 0 ? (
                    userViewpoints.map((viewpoint) => (
                      <div 
                        key={viewpoint.id} 
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => navigate(`/viewpoints-details/${viewpoint.id}`)}
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
                  {userRoutes && userRoutes.length > 0 ? (
                    userRoutes.map((route) => (
                      <div 
                        key={route.id} 
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => navigate(`/routes-details/${route.id}`)}
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

      <AIchat isOpen={showAIChat} onClose={() => setShowAIChat(false)} language={language} />
      <CabBookingModal isOpen={showCabBooking} onClose={() => setShowCabBooking(false)} />

      {/* Phone Verification Modal */}
      <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Phone Number</DialogTitle>
            <DialogDescription>{phoneOtpSent ? "Enter the 6-digit code we sent." : "We will send an OTP to this number."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             {!phoneOtpSent ? (
                <>
                  <Label htmlFor="phone-verify">Phone Number</Label>
                  <Input id="phone-verify" value={phoneToVerify} onChange={(e) => setPhoneToVerify(e.target.value)} placeholder="+911234567890" />
                </>
             ) : (
                <>
                  <Label htmlFor="otp-verify">Enter OTP</Label>
                  <Input id="otp-verify" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} placeholder="123456" />
                </>
             )}
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setShowPhoneModal(false)}>Cancel</Button>
            {!phoneOtpSent ? (
              <Button onClick={handleSendPhoneOTP} disabled={phoneLoading}>{phoneLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send OTP'}</Button>
            ) : (
              <Button onClick={handleConfirmPhoneOTP} disabled={phoneLoading}>{phoneLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify & Link'}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reauthentication Modal for Email Change */}
      <Dialog open={showReauthModal} onOpenChange={setShowReauthModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Identity</DialogTitle>
            <DialogDescription>For your security, please enter your current password to change your email.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
                <Label htmlFor="new-email">New Email Address</Label>
                <Input id="new-email" type="email" value={reauthNewEmail} onChange={(e) => setReauthNewEmail(e.target.value)} placeholder="new@example.com" />
            </div>
            <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" value={reauthPassword} onChange={(e) => setReauthPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReauthModal(false)}>Cancel</Button>
            <Button onClick={performReauthAndChangeEmail} disabled={reauthLoading}>{reauthLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Confirm & Update Email'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};