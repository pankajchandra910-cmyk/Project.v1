import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Input } from "./Input";
import { ScrollArea } from "./scroll-area";
import { Send, Bot, User } from "lucide-react";



/**
 * @typedef {object} AIChatProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {string} language - 'en' for English, 'hi' for Hindi
 */

/**
 * @typedef {object} Message
 * @property {string} id
 * @property {'user' | 'ai'} type
 * @property {string} content
 * @property {Date} timestamp
 */

/**
 * AI Chat component for NainiExplore.
 * @param {AIChatProps} props
 */
export default function AIchat({ isOpen, onClose, language }) {
  /** @type {[Message[], import('react').Dispatch<import('react').SetStateAction<Message[]>>]} */
  const [messages, setMessages] = useState(() => [
    {
      id: '1',
      type: 'ai',
      content: language === 'hi'
        ? 'नमस्ते! मैं आपका NainiExplore AI सहायक हूं। उत्तराखंड के होटल, झीलों, बाइक रेंटल, टैक्सी और ट्रेकिंग के बारे में पूछें।'
        : 'Hello! I\'m your NainiExplore AI assistant. Ask me about Uttarakhand hotels, lakes, bike rentals, taxis, and trekking.',
      timestamp: new Date()
    }
  ]);
  /** @type {[string, import('react').Dispatch<import('react').SetStateAction<string>>]} */
  const [inputMessage, setInputMessage] = useState("");
  /** @type {[boolean, import('react').Dispatch<import('react').SetStateAction<boolean>>]} */
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef(null);

  // Scroll to the bottom of the chat when messages change or dialog opens
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const quickQuestions = language === 'hi' ? [
    "नैनीताल में सबसे अच्छे होटल कौन से हैं?",
    "भीमताल में बाइक रेंटल की कीमत क्या है?",
    "नैना पीक ट्रेक कैसे करें?",
    "स्थानीय टैक्सी की दरें क्या हैं?"
  ] : [
    "Best hotels in Nainital?",
    "Bike rental prices in Bhimtal?",
    "How to trek to Naina Peak?",
    "Local taxi rates?"
  ];

  /**
   * Generates an AI response based on the user's message.
   * @param {string} userMessage
   * @returns {string}
   */
  const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (language === 'hi') {
      if (lowerMessage.includes('होटल') || lowerMessage.includes('hotel')) {
        return "नैनीताल के टॉप होटल:\n1. माउंटेन व्यू रिज़ॉर्ट - ₹4,500/रात\n2. लेक साइड इन - ₹3,200/रात\n3. हिल स्टेशन लॉज - ₹2,800/रात\n\nसभी में WiFi, पार्किंग और झील का दृश्य उपलब्ध है।";
      }
      if (lowerMessage.includes('बाइक') || lowerMessage.includes('bike')) {
        return "नैनीताल में बाइक रेंटल:\n• स्कूटर: ₹400-500/दिन\n• मोटरसाइकिल: ₹800-1000/दिन\n• इलेक्ट्रिक बाइक: ₹600/दिन\n\nड्राइविंग लाइसेंस और ID की आवश्यकता।";
      }
      if (lowerMessage.includes('ट्रेक') || lowerMessage.includes('trek')) {
        return "लोकप्रिय ट्रेकिंग रूट:\n1. नैना पीक - 6km, मध्यम कठिनाई\n2. टिफिन टॉप - 4km, आसान\n3. स्नो व्यू पॉइंट - 2.5km, आसान\n\nगाइड: ₹800/दिन, ट्रेकिंग गियर उपलब्ध।";
      }
      if (lowerMessage.includes('टैक्सी') || lowerMessage.includes('taxi')) {
        return "स्थानीय टैक्सी दरें:\n• शहर के अंदर: ₹15-20/km\n• नैनीताल से भीमताल: ₹800\n• नैनीताल से नौकुचियाताल: ₹1,200\n• पूरे दिन: ₹2,500-3,000";
      }
      if (lowerMessage.includes('झील') || lowerMessage.includes('lake')) {
        return "उत्तराखंड में प्रसिद्ध झीलें:\n1. नैनी झील - नैनीताल\n2. भीमताल झील - भीमताल\n3. सात ताल - सात ताल\n4. नौकुचियाताल - नौकुचियाताल\n\nआप नाव की सवारी और प्राकृतिक सुंदरता का आनंद ले सकते हैं।";
      }
      return "मैं उत्तराखंड के होटल, ट्रेकिंग, बाइक रेंटल, टैक्सी सेवाओं और झीलों के बारे में जानकारी दे सकता हूं। कृपया अधिक विशिष्ट प्रश्न पूछें।";
    } else {
      if (lowerMessage.includes('hotel')) {
        return "Top Nainital hotels:\n1. Mountain View Resort - ₹4,500/night\n2. Lake Side Inn - ₹3,200/night\n3. Hill Station Lodge - ₹2,800/night\n\nAll include WiFi, parking, and lake views.";
      }
      if (lowerMessage.includes('bike')) {
        return "Nainital bike rentals:\n• Scooter: ₹400-500/day\n• Motorcycle: ₹800-1000/day\n• Electric bike: ₹600/day\n\nDriving license and ID required.";
      }
      if (lowerMessage.includes('trek')) {
        return "Popular trekking routes:\n1. Naina Peak - 6km, moderate difficulty\n2. Tiffin Top - 4km, easy\n3. Snow View Point - 2.5km, easy\n\nGuide: ₹800/day, trekking gear available.";
      }
      if (lowerMessage.includes('taxi')) {
        return "Local taxi rates:\n• Within city: ₹15-20/km\n• Nainital to Bhimtal: ₹800\n• Nainital to Naukuchiatal: ₹1,200\n• Full day: ₹2,500-3,000";
      }
      if (lowerMessage.includes('lake')) {
        return "Famous lakes in Uttarakhand:\n1. Naini Lake - Nainital\n2. Bhimtal Lake - Bhimtal\n3. Sattal - Sattal\n4. Naukuchiatal - Naukuchiatal\n\nYou can enjoy boating and scenic beauty.";
      }
      return "I can help with information about Uttarakhand hotels, trekking, bike rentals, taxi services, and lakes. Please ask more specific questions.";
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    /** @type {Message} */
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      /** @type {Message} */
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(userMessage.content), // Use userMessage.content here
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  /**
   * Handles a quick question click.
   * @param {string} question
   */
  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    // Use a small delay to allow inputMessage to update before sending
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-primary" />
            <span>NainiExplore AI Assistant</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4">
          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-primary' : 'bg-secondary'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          {messages.length === 1 && ( // Only show quick questions when only the initial AI message is present
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {language === 'hi' ? 'त्वरित प्रश्न:' : 'Quick questions:'}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-left justify-start h-auto p-2 text-xs"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              placeholder={language === 'hi' ? 'यहाँ अपना प्रश्न लिखें...' : 'Type your question here...'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-primary"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}