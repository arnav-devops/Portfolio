import React, { useState } from 'react';
import { Send, User, Mail, MessageSquare } from 'lucide-react';
import { ContactForm as ContactFormData } from '../types/terminal';

interface ContactFormProps {
  onSubmit: (formData: ContactFormData) => void;
  theme: 'dark' | 'light';
}

export function ContactForm({ onSubmit, theme }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      onSubmit(formData);
      setFormData({ name: '', email: '', message: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputClass = `bg-transparent border-b-2 transition-all duration-300 ${
    theme === 'light' 
      ? 'border-gray-300 text-gray-900 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100' 
      : 'border-green-400 text-green-400 focus:border-green-300 focus:shadow-lg focus:shadow-green-400/20'
  } outline-none px-3 py-2 w-full rounded-t-md`;

  const buttonClass = `flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
    theme === 'light'
      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
      : 'bg-green-600 text-black hover:bg-green-500 shadow-lg shadow-green-400/30 hover:shadow-green-400/50'
  }`;

  return (
    <div className={`space-y-6 p-6 rounded-xl backdrop-blur-sm ${
      theme === 'light' 
        ? 'bg-white/70 border border-gray-200 shadow-xl' 
        : 'bg-black/50 border border-green-400/30 shadow-xl shadow-green-400/10'
    }`}>
      <div className={`${theme === 'light' ? 'text-gray-700' : 'text-green-300'}`}>
        <pre className="text-sm">{`./contact.sh
echo "Enter your details to deploy a message"
read -p "Name: " name
read -p "Email: " email  
read -p "Message: " message
curl -X POST -d "name=$name&email=$email&message=$message" arnav@devops
# Fill out the form below to execute`}</pre>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="flex items-center gap-3">
          <User size={18} className={theme === 'light' ? 'text-gray-600' : 'text-green-400'} />
          <span className={`${theme === 'light' ? 'text-gray-700' : 'text-green-400'} min-w-16 font-medium`}>Name:</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <Mail size={18} className={theme === 'light' ? 'text-gray-600' : 'text-green-400'} />
          <span className={`${theme === 'light' ? 'text-gray-700' : 'text-green-400'} min-w-16 font-medium`}>Email:</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="your.email@domain.com"
            required
          />
        </div>

        <div className="flex items-start gap-3">
          <MessageSquare size={18} className={`${theme === 'light' ? 'text-gray-600' : 'text-green-400'} mt-2`} />
          <span className={`${theme === 'light' ? 'text-gray-700' : 'text-green-400'} min-w-16 font-medium`}>Message:</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className={inputClass}
            placeholder="Your message here..."
            required
          />
        </div>

        <button type="submit" className={buttonClass}>
          <Send size={18} />
          Deploy Message
        </button>
      </form>
    </div>
  );
}