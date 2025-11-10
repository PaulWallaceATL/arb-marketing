'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    id: 1,
    question: 'What types of personal injury cases do you focus on?',
    answer: 'We work with firms handling all types of personal injury cases including auto accidents, slip and fall, medical malpractice, product liability, and wrongful death claims. Our lead generation and marketing strategies are tailored to your specific practice areas.',
  },
  {
    id: 2,
    question: 'How are your leads qualified and vetted?',
    answer: 'Every lead goes through our rigorous pre-screening process. We verify injury details, assess case viability, confirm timeline requirements, and ensure prospects are ready to engage with legal representation. You receive only qualified, conversion-ready leads.',
  },
  {
    id: 3,
    question: 'What kind of ROI can I expect from your services?',
    answer: 'While results vary by market and practice area, our clients typically see a 3-5x return on investment within the first 6 months. We focus on quality over quantity, ensuring each lead has genuine case potential and strong conversion probability.',
  },
  {
    id: 4,
    question: 'Do you offer customized marketing packages?',
    answer: 'Absolutely. We understand every law firm has unique needs and goals. Our team will work with you to develop a custom strategy that aligns with your practice areas, budget, and growth objectives. Contact us for a personalized consultation.',
  },
  {
    id: 5,
    question: 'How can I get started with ARB Marketing?',
    answer: 'Simply click "Get In Touch" or "Schedule Consultation" to book your free initial consultation. We\'ll discuss your firm\'s goals, assess your current marketing efforts, and develop a customized strategy with clear deliverables and pricing. No pressure—just a strategic conversation about growing your practice.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="aximo-all-section">
      {/* Breadcrumb */}
      <div className="aximo-breadcrumb">
        <div className="container">
          <h1 style={{ fontFamily: "'Roxborough CF', serif" }}>Frequently Asked Questions</h1>
          <nav>
            <ol>
              <li><Link href="/">Home</Link></li>
              <li className="active">FAQ</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="section aximo-section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="aximo-section-title center">
                <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Common Questions About Our Services</h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  Find answers to the most frequently asked questions about our referral solutions and marketing services.
                </p>
              </div>

              <div className="aximo-accordion-wrap">
                {faqs.map((faq, index) => (
                  <div key={faq.id} className="aximo-accordion-item">
                    <div 
                      className="aximo-accordion-header"
                      onClick={() => toggleAccordion(index)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h3 style={{ fontFamily: "'Roxborough CF', serif" }}>{faq.question}</h3>
                      <div className={`aximo-accordion-icon ${openIndex === index ? 'active' : 'inactive'}`}>
                        <i className={openIndex === index ? 'icon-minus' : 'icon-plus'}></i>
                      </div>
                    </div>
                    {openIndex === index && (
                      <div className="aximo-accordion-body">
                        <p style={{ fontFamily: "'Libre Baskerville', serif" }}>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="aximo-cta-section aximo-section-padding bg-light">
        <div className="container">
          <div className="aximo-cta-wrap text-center">
            <h2 style={{ fontFamily: "'Roxborough CF', serif" }}>Still Have Questions?</h2>
            <p style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Schedule a free consultation to discuss your specific needs and goals.
            </p>
            <Link href="/contact" className="aximo-default-btn">
              <span className="aximo-label-up">Contact Us</span>
              <span className="aximo-label-up">Contact Us</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

