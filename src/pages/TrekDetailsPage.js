import React, { useState, useCallback, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { GlobalContext } from "../component/GlobalContext";
import { trekDetailsData } from "../assets/dummy"; // Assuming you have this utility
import { analytics } from "../firebase"; // Import analytics from your firebase.js
import { logEvent } from "firebase/analytics"; // Import logEvent

// --- Component Imports ---
import { Button } from "../component/button";
import { Card, CardContent, CardHeader, CardTitle } from "../component/Card";
import { Badge } from "../component/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/tabs";
import { FAQSection } from "../component/FAQSection";
import { ImageWithFallback } from "../component/ImageWithFallback";

// --- Icon Imports ---
import {
  ArrowLeft, Star, MapPin, Navigation, Clock, Mountain, ChevronLeft, ChevronRight,
  AlertTriangle, Users, Calendar, Backpack, Route, TreePine, Thermometer, Shield,
  Camera, Sunrise, Info, Phone, Mail, ListTodo, Footprints,
} from "lucide-react";

// Map for dynamically rendering icons
const iconMap = {
  Clock, Route, Mountain, Thermometer, Shield, AlertTriangle, Users, Calendar, Backpack,
  TreePine, Camera, Sunrise, Info, Phone, Mail, ListTodo, Walking: Footprints,
};

export default function TrekDetails() {
    const navigate = useNavigate();
    const { trekId } = useParams();
    const { setSelectedItemId, setSelectedDetailType, setFocusArea } = useContext(GlobalContext);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [trekData, setTrekData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to safely parse price
    const getPriceValue = (priceString) => {
        return priceString ? parseFloat(priceString.replace(/[^0-9.-]+/g, "")) : 0;
    };

    // --- Data Fetching and Initial Analytics Event ---
    useEffect(() => {
        setLoading(true);
        setError(null);
        if (trekId) {
            const data = trekDetailsData[trekId];
            if (data) {
                setTrekData(data);
                setLoading(false);
                setCurrentImageIndex(0);

                // --- Analytics Event: Log view_item event for the trek ---
                if (analytics) {
                    logEvent(analytics, 'view_item', {
                        currency: 'INR', // Assuming default currency, adjust as needed
                        value: getPriceValue(data.price),
                        items: [{
                            item_id: data.id || trekId,
                            item_name: data.name,
                            item_category: 'Trek',
                            item_variant: data.difficulty,
                            price: getPriceValue(data.price),
                            quantity: 1
                        }]
                    });
                }
                // --- End of Analytics Tracking ---
            } else {
                setError("Trek not found.");
                setLoading(false);
                setTrekData(null);
            }
        } else {
            setError("No trek ID provided.");
            setLoading(false);
            setTrekData(null);
        }
    }, [trekId]);

    // --- Handlers with Analytics Tracking ---
    const handleBack = useCallback(() => {
        if (analytics) {
            logEvent(analytics, 'navigation_back', {
                from_page: 'Trek Details',
                trek_name: trekData?.name || 'N/A'
            });
        }
        navigate(-1);
    }, [navigate, trekData]);

    const handleBookNow = useCallback((id) => {
        if (analytics) {
            logEvent(analytics, 'begin_checkout', {
                currency: 'INR',
                value: getPriceValue(trekData?.price),
                items: [{
                    item_id: trekData?.id || id,
                    item_name: trekData?.name,
                    item_category: 'Trek',
                    item_variant: trekData?.difficulty,
                    price: getPriceValue(trekData?.price),
                    quantity: 1
                }]
            });
        }
        navigate(`/book-item/${id}`);
    }, [navigate, trekData]);

    const handleHireGuide = useCallback(() => {
        if (analytics) {
            logEvent(analytics, 'select_content', {
                content_type: 'contact_guide_button',
                item_id: trekData?.guide?.name || 'N/A',
                trek_name: trekData?.name
            });
        }
        setSelectedDetailType("guide");
        navigate(`/guides?location=${encodeURIComponent(trekData?.location || "")}`);
    }, [navigate, trekData, setSelectedDetailType]);

    const handleGetDirections = useCallback((lat, lng, name) => {
        if (analytics) {
            logEvent(analytics, 'get_directions', {
                destination_name: name,
                trek_name: trekData?.name,
                destination_latitude: lat,
                destination_longitude: lng
            });
        }
        setFocusArea(trekData?.id || "trek-route");
        navigate(`/map-view/${trekData?.id}?destLat=${lat}&destLng=${lng}&destName=${encodeURIComponent(name)}`);
    }, [navigate, setFocusArea, trekData]);

    const nextImage = useCallback(() => {
        if (trekData?.images.length > 0) {
            const newIndex = (currentImageIndex + 1) % trekData.images.length;
            setCurrentImageIndex(newIndex);
            if (analytics) {
                logEvent(analytics, 'select_content', {
                    content_type: 'image_carousel_next',
                    item_id: `image_${newIndex + 1}`,
                    item_list_name: trekData.name,
                    index: newIndex
                });
            }
        }
    }, [trekData, currentImageIndex]);

    const prevImage = useCallback(() => {
        if (trekData?.images.length > 0) {
            const newIndex = (currentImageIndex - 1 + trekData.images.length) % trekData.images.length;
            setCurrentImageIndex(newIndex);
            if (analytics) {
                logEvent(analytics, 'select_content', {
                    content_type: 'image_carousel_prev',
                    item_id: `image_${newIndex + 1}`,
                    item_list_name: trekData.name,
                    index: newIndex
                });
            }
        }
    }, [trekData, currentImageIndex]);

    const handleImageDotClick = useCallback((index) => {
        setCurrentImageIndex(index);
        if (analytics) {
            logEvent(analytics, 'select_content', {
                content_type: 'image_carousel_dot',
                item_id: `image_${index + 1}`,
                item_list_name: trekData.name,
                index: index
            });
        }
    }, [trekData]);

    const handleTabChange = useCallback((value) => {
        if (analytics) {
            logEvent(analytics, 'select_content', {
                content_type: 'tab_navigation',
                item_id: value,
                item_list_name: trekData?.name
            });
        }
    }, [trekData]);

    const handleDateSelection = useCallback((dateOption) => {
        if (dateOption.available) {
            if (analytics) {
                logEvent(analytics, 'select_item', {
                    item_list_name: 'Available Dates',
                    items: [{
                        item_id: trekData?.id,
                        item_name: trekData?.name,
                        item_category: 'Trek',
                        item_variant: dateOption.date,
                        price: getPriceValue(dateOption.price),
                        quantity: 1
                    }]
                });
            }
            // You would typically store the selected date in state here
            // setSelectedDate(dateOption.date);
        }
    }, [trekData]);

    // --- Conditional Rendering for Loading/Error States ---
    if (loading) return <div className="flex justify-center items-center h-screen">Loading trek details...</div>;
    if (error) return <div className="flex flex-col justify-center items-center h-screen text-red-600"><p>Error: {error}</p><Button variant="link" onClick={handleBack}>Go Back</Button></div>;
    if (!trekData) return <div className="flex flex-col justify-center items-center h-screen"><p>No trek data available.</p><Button variant="link" onClick={handleBack}>Go Back</Button></div>;

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('${trekData.images[0]}')`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                backgroundColor: '#f9fafb'
            }}
        >
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-sm shadow-sm px-4 py-3 md:px-6 sticky top-0 z-10">
                <Button variant="ghost" onClick={handleBack} className="mb-0">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Treks
                </Button>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* Image Carousel */}
                <div className="relative mb-6">
                    <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                        <ImageWithFallback
                            src={trekData.images[currentImageIndex]}
                            alt={`${trekData.name} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover"
                        />
                        {trekData.images.length > 1 && (
                            <>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                    {trekData.images.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                            }`}
                                            onClick={() => handleImageDotClick(index)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Trek Info */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{trekData.name}</h1>
                                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{trekData.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-4 flex-wrap gap-2">
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium">{trekData.rating}</span>
                                            <span className="text-muted-foreground">({trekData.reviewCount} reviews)</span>
                                        </div>
                                        <Badge
                                            className={`${
                                                trekData.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                    trekData.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {trekData.difficulty}
                                        </Badge>
                                        <Badge variant="outline">{trekData.distance}</Badge>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 text-right">
                                    <div className="text-2xl font-bold text-primary">{trekData.price}</div>
                                    <div className="text-sm text-muted-foreground">{trekData.priceNote}</div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50/80 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <div>
                                        <div className="text-sm font-medium">Duration</div>
                                        <div className="text-xs text-muted-foreground">{trekData.duration}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Route className="w-4 h-4 text-primary" />
                                    <div>
                                        <div className="text-sm font-medium">Distance</div>
                                        <div className="text-xs text-muted-foreground">{trekData.distance}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Mountain className="w-4 h-4 text-primary" />
                                    <div>
                                        <div className="text-sm font-medium">Altitude</div>
                                        <div className="text-xs text-muted-foreground">{trekData.altitude}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Thermometer className="w-4 h-4 text-primary" />
                                    <div>
                                        <div className="text-sm font-medium">Best Time</div>
                                        <div className="text-xs text-muted-foreground">{trekData.bestTime}</div>
                                    </div>
                                </div>
                            </div>

                            <Tabs defaultValue="overview" className="w-full" onValueChange={handleTabChange}>
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                                    <TabsTrigger value="preparation">Preparation</TabsTrigger>
                                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-6 mt-6">
                                    <div>
                                        <h3 className="font-semibold mb-3">About This Trek</h3>
                                        <p className="text-muted-foreground leading-relaxed">{trekData.description}</p>
                                    </div>

                                    {trekData.highlights && trekData.highlights.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3">Trek Highlights</h3>
                                            <div className="grid md:grid-cols-2 gap-2">
                                                {trekData.highlights.map((highlight, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                                                        <span className="text-sm">{highlight}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {trekData.included && trekData.included.length > 0 && (
                                            <div>
                                                <h3 className="font-semibold mb-3 flex items-center">
                                                    <Shield className="w-4 h-4 mr-2 text-green-600" />
                                                    What's Included
                                                </h3>
                                                <ul className="space-y-1 text-sm text-muted-foreground">
                                                    {trekData.included.map((item, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="text-green-600 mr-2">✓</span>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {trekData.notIncluded && trekData.notIncluded.length > 0 && (
                                            <div>
                                                <h3 className="font-semibold mb-3 flex items-center">
                                                    <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                                                    Not Included
                                                </h3>
                                                <ul className="space-y-1 text-sm text-muted-foreground">
                                                    {trekData.notIncluded.map((item, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="text-red-600 mr-2">✗</span>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {trekData.guide && (
                                        <div className="bg-blue-50/80 p-4 rounded-lg shadow-sm">
                                            <h4 className="font-semibold mb-2 flex items-center">
                                                <Users className="w-4 h-4 mr-2 text-blue-600" />
                                                Your Guide: {trekData.guide.name}
                                            </h4>
                                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium">Experience:</span>
                                                    <span className="ml-2">{trekData.guide.experience}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Rating:</span>
                                                    <div className="inline-flex items-center ml-2">
                                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                        <span className="ml-1">{trekData.guide.rating}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Languages:</span>
                                                    <span className="ml-2">{trekData.guide.languages.join(", ")}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Specialization:</span>
                                                    <span className="ml-2">{trekData.guide.specialization}</span>
                                                </div>
                                            </div>
                                            {trekData.guide.contact && (
                                                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                                    <Button variant="outline" size="sm" onClick={() => {
                                                        if (analytics) {
                                                            logEvent(analytics, 'select_content', {
                                                                content_type: 'call_guide_button',
                                                                item_id: trekData.guide.name,
                                                                trek_name: trekData.name
                                                            });
                                                        }
                                                        window.open(`tel:${trekData.guide.contact}`, '_self');
                                                    }}>
                                                        <Phone className="w-3 h-3 mr-1" /> Call Guide
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => {
                                                        if (analytics) {
                                                            logEvent(analytics, 'select_content', {
                                                                content_type: 'email_guide_button',
                                                                item_id: trekData.guide.name,
                                                                trek_name: trekData.name
                                                            });
                                                        }
                                                        window.open(`mailto:${trekData.guide.email || ''}?subject=Inquiry about ${trekData.name} Trek`, '_self');
                                                    }}>
                                                        <Mail className="w-3 h-3 mr-1" /> Email Guide
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="itinerary" className="space-y-4 mt-6">
                                    {trekData.itinerary && trekData.itinerary.length > 0 ? (
                                        <>
                                            <h3 className="font-semibold">Detailed Itinerary</h3>
                                            <div className="space-y-4">
                                                {trekData.itinerary.map((item, index) => {
                                                    const IconComponent = item.icon && iconMap[item.icon] ? iconMap[item.icon] : null; // Dynamically get icon
                                                    return (
                                                        <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg shadow-sm bg-white">
                                                            <div className="shrink-0 w-16 text-center">
                                                                <div className="text-sm font-medium text-primary">{item.time}</div>
                                                                {IconComponent && <IconComponent className="w-4 h-4 text-gray-500 mt-1 mx-auto" />}
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-medium">{item.activity}</h4>
                                                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-muted-foreground">No detailed itinerary available for this trek.</p>
                                    )}
                                </TabsContent>

                                <TabsContent value="preparation" className="space-y-6 mt-6">
                                    {trekData.whatToBring && trekData.whatToBring.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3 flex items-center">
                                                <Backpack className="w-4 h-4 mr-2" />
                                                What to Bring
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {trekData.whatToBring.map((category, index) => (
                                                    <div key={index} className="space-y-2 p-3 border rounded-lg bg-gray-50/80">
                                                        <h4 className="font-medium text-primary flex items-center">
                                                            <ListTodo className="w-4 h-4 mr-2" />
                                                            {category.category}
                                                        </h4>
                                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                                            {category.items.map((item, idx) => (
                                                                <li key={idx} className="flex items-start">
                                                                    <span className="text-primary mr-2">•</span>
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {trekData.safetyGuidelines && trekData.safetyGuidelines.length > 0 && (
                                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm">
                                            <h4 className="font-semibold mb-3 flex items-center text-red-700">
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                Safety Guidelines
                                            </h4>
                                            <ul className="space-y-2 text-sm text-red-700">
                                                {trekData.safetyGuidelines.map((guideline, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        {guideline}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="reviews" className="mt-6">
                                    <div className="space-y-4">
                                        {trekData.reviews && trekData.reviews.length > 0 ? (
                                            trekData.reviews.map((review, index) => (
                                                <div key={index} className="border-b pb-4 last:border-b-0 bg-white p-4 rounded-lg shadow-sm">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <div className="flex">
                                                            {Array(5).fill(0).map((_, i) => (
                                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                                            ))}
                                                        </div>
                                                        <span className="font-medium">{review.author}</span>
                                                        <span className="text-sm text-muted-foreground">{review.date}</span>
                                                    </div>
                                                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground">No reviews available yet for this trek.</p>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 space-y-4">
                            <Card className="bg-white/95 backdrop-blur-sm shadow-sm">
                                <CardHeader>
                                    <CardTitle>Book This Trek</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {trekData.availableDates && trekData.availableDates.length > 0 && (
                                        <div>
                                            <label className="text-sm font-medium">Select Date</label>
                                            <div className="space-y-2 mt-2">
                                                {trekData.availableDates.map((dateOption, index) => (
                                                    <div
                                                        key={index}
                                                        className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center ${
                                                            !dateOption.available ? 'opacity-50 bg-gray-50' : 'hover:bg-gray-50'
                                                        }`}
                                                        onClick={() => handleDateSelection(dateOption)}
                                                    >
                                                        <div>
                                                            <div className="text-sm font-medium">{dateOption.date}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {dateOption.available ? 'Available' : 'Full'}
                                                            </div>
                                                        </div>
                                                        <div className="text-sm font-semibold text-primary">
                                                            {dateOption.price}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm font-medium">Number of Trekkers</label>
                                        <div className="flex items-center mt-1 p-3 border rounded-md bg-gray-50/80">
                                            <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                                            <span className="text-sm">1 person (default)</span>
                                            {/* In a real app, this would be a selectable input, and you'd track changes with GA */}
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between mb-2">
                                            <span>Trek cost</span>
                                            <span>{trekData.price}</span>
                                        </div>
                                        <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                                            <span>Permits & gear</span>
                                            <span>Included</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                            <span>Total</span>
                                            <span>{trekData.price}</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-primary hover:bg-primary/90"
                                        size="lg"
                                        onClick={() => handleBookNow(trekData.id)}
                                    >
                                        Book This Trek
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleHireGuide}
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        Contact Guide
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => handleGetDirections(trekData.startCoordinates.lat, trekData.startCoordinates.lng, `${trekData.name} Starting Point`)}
                                    >
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Get Directions
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/95 backdrop-blur-sm shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">Need Help?</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    {trekData.guide?.contact && (
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Guide:</span>
                                            <span>{trekData.guide.contact}</span>
                                        </div>
                                    )}
                                    <p className="text-muted-foreground">
                                        Have questions about difficulty level, gear requirements, or weather conditions?
                                        Our experienced guides are here to help!
                                    </p>
                                </CardContent>
                            </Card>

                            {trekData.faqs && trekData.faqs.length > 0 && (
                                <FAQSection faqs={trekData.faqs} className="bg-white/95 backdrop-blur-sm shadow-sm" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}