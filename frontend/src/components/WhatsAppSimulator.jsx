import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User } from 'lucide-react';
import MockCheckoutModal from './MockCheckoutModal';

export default function WhatsAppSimulator({ campaign, onClose, onCampaignRecovered }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hi ${campaign.customerName.split(' ')[0]}, this is SmartRecovery. Your recent payment of $${campaign.amount} for ${campaign.plan} failed due to a ${campaign.failureReasonText.replace(/_/g, ' ')}. Would you like to update your payment method?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const messagesEndRef = useRef(null);

  const parseText = (text) => {
    // Regex to find rzp.io links
    const parts = text.split(/(https:\/\/rzp\.io\/[^\s]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('https://rzp.io/')) {
        return (
          <button 
            key={i} 
            onClick={() => setShowCheckout(true)}
            className="text-[#00d2ff] hover:underline underline-offset-2 font-medium"
          >
            {part}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: campaign.id,
          customer_name: campaign.customerName,
          amount: campaign.amount,
          plan: campaign.plan,
          failure_reason: campaign.failureReasonText,
          message_history: [...messages, userMessage].map(m => ({
            role: m.sender === 'bot' ? 'assistant' : 'user',
            content: m.text
          }))
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "I'm having trouble connecting right now. Please try again later.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0b141a] w-full max-w-md rounded-2xl overflow-hidden flex flex-col h-[600px] border border-slate-700 shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-slate-200 font-semibold text-sm">SmartRecovery Agent</h3>
              <p className="text-emerald-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-[#0b141a] overflow-y-auto p-4 space-y-4" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(11, 20, 26, 0.95)' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm relative ${
                msg.sender === 'user' 
                  ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' 
                  : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
              }`}>
                <p className="pr-12 whitespace-pre-wrap">{parseText(msg.text)}</p>
                <span className="text-[10px] text-slate-400 absolute bottom-1 right-2">{msg.time}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#202c33] px-3 py-3 flex items-end gap-2 border-t border-slate-700/50">
          <div className="flex-1 bg-[#2a3942] rounded-lg flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="w-full bg-transparent text-[#e9edef] px-4 py-3 outline-none resize-none max-h-32 text-sm"
              rows={1}
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-full bg-[#00a884] flex items-center justify-center text-white flex-shrink-0 hover:bg-[#008f6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
      {showCheckout && (
        <MockCheckoutModal 
          campaign={campaign}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false);
            if (onCampaignRecovered) onCampaignRecovered();
            else window.location.reload();
          }}
        />
      )}
    </div>
  );
}
