import { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Halo! Saya Andi, tour guide berpengalaman di Bandung. Ada yang bisa saya bantu untuk perjalanan Anda? 🗺️',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Call Chutes AI API via Laravel backend
    const getBotResponse = async (userMessage, conversationHistory) => {
        try {
            // Create timeout promise (5 seconds)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('timeout')), 60000)
            );

            // Create fetch promise
            const fetchPromise = fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage,
                    conversation_history: conversationHistory
                })
            });

            // Race between timeout and fetch
            const response = await Promise.race([fetchPromise, timeoutPromise]);

            const data = await response.json();

            // Handle rate limiting
            if (response.status === 429) {
                return `⏳ ${data.message}\n\nAnda sudah mengirim terlalu banyak pesan. Silakan tunggu sebentar.`;
            }

            if (data.success) {
                return data.message;
            } else {
                return 'Maaf, saya mengalami kesulitan memproses pesan Anda. Silakan coba lagi. 😔';
            }
        } catch (error) {
            if (error.message === 'timeout') {
                return 'Koneksi timeout. Server sedang sibuk, coba kirim ulang pesan Anda. ⏱️';
            }
            console.error('Chat API Error:', error);
            return 'Koneksi ke server gagal. Pastikan Anda terhubung ke internet dan coba lagi. 🔌';
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputMessage('');
        setIsTyping(true);

        // Prepare conversation history for context
        const conversationHistory = messages.map(msg => ({
            sender: msg.sender,
            text: msg.text
        }));

        // Call AI API
        try {
            const botResponseText = await getBotResponse(inputMessage, conversationHistory);

            const botResponse = {
                id: newMessages.length + 1,
                text: botResponseText,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Error getting bot response:', error);
            const errorResponse = {
                id: newMessages.length + 1,
                text: 'Maaf, terjadi kesalahan. Silakan coba lagi. 😔',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    const quickQuestions = [
        '📍 Top 5 destinasi Bandung',
        '🍜 Kuliner wajib coba',
        '💰 Estimasi budget 3 hari',
        '🚗 Sewa mobil atau motor?'
    ];

    const handleQuickQuestion = (question) => {
        setInputMessage(question.replace(/[📍🗺️💰🍜]/g, '').trim());
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
                    isOpen
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : 'bg-gradient-to-r from-button to-highlight'
                }`}
            >
                {isOpen ? (
                    <XMarkIcon className="h-6 w-6 text-white" />
                ) : (
                    <div className="relative">
                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary rounded-full animate-ping"></span>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary rounded-full"></span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-24 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl transition-all duration-300 transform ${
                    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-button to-highlight p-4 rounded-t-2xl">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                <SparklesIcon className="h-6 w-6 text-button" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Andi - Tour Guide</h3>
                            <p className="text-white/80 text-xs">Berpengalaman 15 tahun</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                    message.sender === 'user'
                                        ? 'bg-gradient-to-r from-button to-highlight text-white'
                                        : 'bg-white text-headline shadow-sm border border-secondary'
                                }`}
                            >
                                <p className="text-sm whitespace-pre-line">{message.text}</p>
                                <p className={`text-xs mt-1 ${
                                    message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                                }`}>
                                    {message.timestamp.toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-secondary">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-button rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-button rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-button rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length <= 2 && (
                    <div className="px-4 py-2 border-t border-secondary bg-white">
                        <p className="text-xs text-paragraph mb-2">Pertanyaan Cepat:</p>
                        <div className="flex flex-wrap gap-2">
                            {quickQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickQuestion(question)}
                                    className="text-xs px-3 py-1.5 bg-background text-button rounded-full hover:bg-gradient-to-r hover:from-button hover:to-highlight hover:text-white transition-all"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-secondary bg-white rounded-b-2xl">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ketik pertanyaan Anda..."
                            className="flex-1 px-4 py-2 border-2 border-secondary rounded-full focus:ring-2 focus:ring-button focus:border-button outline-none text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!inputMessage.trim()}
                            className="p-2 bg-gradient-to-r from-button to-highlight text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
