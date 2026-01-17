import { useState } from 'react';
import { SHOP_INFO } from '../utils/constants';
import { validateEmail, validatePhone, validateName } from '../utils/validators';
import '../styles/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateName(formData.name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits)';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Contact form submitted:', formData);
      setSubmitSuccess(true);
      setIsSubmitting(false);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="container">
          <h1 className="page-title">Get In Touch</h1>
          <p className="page-subtitle">
            We'd love to hear from you. Visit us or send a message!
          </p>
        </div>
      </div>

      <div className="contact-container container">
        {/* Contact Information Cards */}
        <div className="contact-info-section">
          <h2 className="section-heading">Visit Our Store</h2>
          
          <div className="contact-cards">
            <div className="contact-card">
              <div className="card-icon">📍</div>
              <h3>Address</h3>
              <p>{SHOP_INFO.address}</p>
            </div>

            <div className="contact-card">
              <div className="card-icon">📞</div>
              <h3>Phone</h3>
              <p>
                <a href={`tel:${SHOP_INFO.phone}`}>{SHOP_INFO.phone}</a>
              </p>
            </div>

            <div className="contact-card">
              <div className="card-icon">✉️</div>
              <h3>Email</h3>
              <p>
                <a href={`mailto:${SHOP_INFO.email}`}>{SHOP_INFO.email}</a>
              </p>
            </div>

            <div className="contact-card">
              <div className="card-icon">🕒</div>
              <h3>Working Hours</h3>
              <p>{SHOP_INFO.timing}</p>
            </div>
          </div>
        </div>

        {/* Contact Form & Map Section */}
        <div className="contact-main-section">
          <div className="contact-form-wrapper">
            <h2 className="section-heading">Send Us a Message</h2>
            <p className="section-description">
              Have questions about our collection? Fill out the form below and we'll get back to you soon.
            </p>

            {submitSuccess && (
              <div className="success-message">
                <span className="success-icon">✓</span>
                <p>Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <span className="form-error">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="10-digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                  />
                  {errors.phone && (
                    <span className="form-error">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className="form-error">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className={`form-input ${errors.subject ? 'error' : ''}`}
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && (
                  <span className="form-error">{errors.subject}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  className={`form-textarea ${errors.message ? 'error' : ''}`}
                  placeholder="Tell us how we can help you..."
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                {errors.message && (
                  <span className="form-error">{errors.message}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Map Section */}
          <div className="contact-map-wrapper">
            <h2 className="section-heading">Find Us Here</h2>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3423.234567890123!2d75.8572758!3d30.900965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDU0JzAzLjUiTiA3NcKwNTEnMjYuMiJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Samaira Collection Location"
              ></iframe>
            </div>
            <p className="map-note">
              📍 Located in the heart of Ludhiana, Punjab. Easy access from all major areas.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">How do I book an order?</h3>
              <p className="faq-answer">
                Browse our collection, select your items, and proceed to checkout. You can pay 25% advance to confirm your booking or pay the full amount.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Do you provide delivery?</h3>
              <p className="faq-answer">
                Currently, we operate on a collection-only basis. You need to visit our Ludhiana store to collect your order.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">What payment methods do you accept?</h3>
              <p className="faq-answer">
                We accept all major payment methods including UPI, cards, net banking, and cash on collection.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Can I try the garments before collecting?</h3>
              <p className="faq-answer">
                Yes! When you visit our store to collect your order, you can try the garments. We ensure perfect fit and quality.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">What if I pay 25% advance and change my mind?</h3>
              <p className="faq-answer">
                We have a flexible cancellation policy. Please contact us within 24 hours of booking for refund details.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Do you have customization options?</h3>
              <p className="faq-answer">
                Yes, we offer customization for certain garments. Visit our store or contact us to discuss your requirements.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="contact-cta">
          <h2>Ready to Explore Our Collection?</h2>
          <p>Visit our store or browse our online catalog</p>
          <div className="cta-buttons">
            <a href="/products" className="btn btn-primary btn-large">
              Browse Collection
            </a>
            <a href={`tel:${SHOP_INFO.phone}`} className="btn btn-accent btn-large">
              Call Us Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
