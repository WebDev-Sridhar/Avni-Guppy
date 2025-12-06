import React, { useState } from 'react';

export default function Contact() {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxVZGGtBkEcxFFN5UDdvLlWGPLKPnjvzT196aajjpQmKXNhtdr0b8idojLklJ8MXOPK/exec';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('subject', formData.subject);
    form.append('message', formData.message);

    try {
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: form,
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error!', error.message);
      alert('Error sending message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
        <h1>Wanna Say Something?, Leave a Message</h1>
      <h2 className="text-2xl font-semibold mb-6 text-teal-700">Contact Us</h2>
      <div className="grid md:grid-cols-2 gap-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full border rounded px-4 py-2"
          required
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="Your Email"
          className="w-full border rounded px-4 py-2"
          required
        />
        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="w-full border rounded px-4 py-2"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          placeholder="Your Message"
          className="w-full border rounded px-4 py-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      <div className="space-y-4 text-gray-700">
          <h2 className="text-xl font-semibold text-teal-700">Farm Location Info</h2>
          <p>
            <strong>Address:</strong> 3, Thirupathi Nagar, Avaniyapuram Madurai, TN 625012
          </p>
          <p>
            <strong>Email:</strong>{' '}
            <a href="mailto:avniguppyhomecontact@gmail.com" className="text-teal-600">
              avniguppyhomecontact@gmail.com
            </a>
          </p>
          <p>
            <strong>Phone:</strong>{' '}
            <a href="tel:+916380614150" className="text-teal-600">
              +91 6380614150
            </a>
          </p>

          {/* Optional Map Embed */}
          <div className="mt-4 ">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d982.6410369432868!2d78.11504326953403!3d9.88688532057623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c55e97ba0d7b%3A0xdcefd869887e7033!2s21-3%2C%20Arunchunai%20Nagar%20Rd%2C%20Priyasamy%20Nagar%2C%20Madurai%2C%20Tamil%20Nadu%20625013!5e0!3m2!1sen!2sin!4v1750598883074!5m2!1sen!2sin"
               width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className='rounded'
              
            ></iframe>
          </div>
        </div>
        </div>
    </div>
  );
}
