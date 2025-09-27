import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  category: "General Inquiry",
  subject: "",
  message: "",
};

const ContactUs = () => {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent!");
    setForm(initialForm);
  };

  return (
    <div className="contact-section min-h-screen bg-white flex flex-col items-center py-10 px-4 mt-[110px] [@media(max-width:900px)]:mt-[150px]">
      <h2 className="text-3xl font-semibold text-center mb-2">Contact Us</h2>
      <p className="text-gray-600 text-center mb-8">
        Have a question or need help? We're here to support you. Choose the best way to reach us below.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl w-full">
        {/* Contact Form */}
        <form
          className="bg-white shadow rounded-xl p-8 flex-1"
          onSubmit={handleSubmit}
        >
          <h4 className="font-medium text-lg mb-4">Send us a Message</h4>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Name *</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring ring-gray-200"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Email *</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring ring-gray-200"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Category *</label>
            <select
              name="category"
              className="w-full border rounded-md px-3 py-2 bg-white"
              value={form.category}
              onChange={handleChange}
            >
              <option>General Inquiry</option>
              <option>Vendor Support</option>
              <option>Customer Support</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Subject *</label>
            <input
              type="text"
              name="subject"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring ring-gray-200"
              value={form.subject}
              onChange={handleChange}
              required
              placeholder="Brief description of your inquiry"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-sm font-semibold">Message *</label>
            <textarea
              name="message"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring ring-gray-200 min-h-[100px]"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Tell us more about your inquiry..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 transition"
          >
            Send Message
          </button>
        </form>

        {/* Info Sidebar */}
        <div className="bg-gray-50 shadow rounded-xl p-8 w-full lg:w-[360px] flex flex-col gap-8">
          <div>
            <h4 className="font-medium text-lg mb-2">Get in Touch</h4>
            <div className="mb-4">
              <div className="font-semibold">General Inquiries</div>
              <div className="text-sm text-gray-500 mb-1">
                Questions about our platform or services
              </div>
              <div className="font-mono text-sm text-gray-700">hello@Apnabazaar.com</div>
              <div className="text-xs text-gray-400">Response: <span className="font-medium text-gray-700">Within 24 hours</span></div>
            </div>
            <div className="mb-4">
              <div className="font-semibold">Vendor Support</div>
              <div className="text-sm text-gray-500 mb-1">
                Help for current and prospective vendors
              </div>
              <div className="font-mono text-sm text-gray-700">vendor@Apnabazaar.com</div>
              <div className="text-xs text-gray-400">Response: <span className="font-medium text-gray-700">Within 12 hours</span></div>
            </div>
            <div>
              <div className="font-semibold">Customer Support</div>
              <div className="text-sm text-gray-500 mb-1">
                Order issues, returns, or account help
              </div>
              <div className="font-mono text-sm text-gray-700">support@Apnabazaar.com</div>
              <div className="text-xs text-gray-400">Response: <span className="font-medium text-gray-700">Within 6 hours</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
