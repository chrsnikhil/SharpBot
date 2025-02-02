import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot } from 'lucide-react';
import { Button } from "./ui/button";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;
    const newMessage: Message = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput(""); // Clear input field

    // Call the Hugging Face API for sentiment analysis
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer xxxxxx`, // Replace with your API key
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: input }), // Send user input
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // Check the structure of the response
      console.log(data); // Log the response to see its structure

      // Extract the sentiment label
      const sentiment = data[0]?.label; // Adjust based on the API response structure
      const botResponse: Message = { text: `Sentiment: ${sentiment}`, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error fetching response from Hugging Face API:", error);
      const errorMessage: Message = { text: "Sorry, I couldn't process your request.", sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden">
      <div className="bg-black text-white p-4 flex items-center">
        <Bot className="w-6 h-6 mr-2" />
        <h2 className="text-lg font-bold">AI Assistant</h2>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-black text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Button type="submit" className="bg-black text-white hover:bg-gray-800">
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;