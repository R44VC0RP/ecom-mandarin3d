'use client';

import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phoneNumber: formData.get('phoneNumber'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to submit');
      
      setSubmitStatus('success');
      e.currentTarget.reset();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label htmlFor="name" className="sr-only">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          placeholder="Name *"
          className="h-11 text-md w-full rounded-lg border bg-white px-4 py-2 text-black placeholder:text-neutral-500 md:text-sm dark:border-neutral-700 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
        />
      </div>

      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          placeholder="Email *"
          className="h-11 text-md w-full rounded-lg border bg-white px-4 py-2 text-black placeholder:text-neutral-500 md:text-sm dark:border-neutral-700 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="sr-only">
          Phone Number
        </label>
        <input
          type="tel"
          name="phoneNumber"
          id="phoneNumber"
          placeholder="Phone Number (optional)"
          className="h-11 text-md w-full rounded-lg border bg-white px-4 py-2 text-black placeholder:text-neutral-500 md:text-sm dark:border-neutral-700 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
        />
      </div>

      <div>
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          required
          rows={4}
          placeholder="Message *"
          className="text-md w-full rounded-lg border bg-white px-4 py-2 text-black placeholder:text-neutral-500 md:text-sm dark:border-neutral-700 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg border border-[--m3d-primary-border] bg-[--m3d-primary] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-[--m3d-primary-border] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[--m3d-primary-border] dark:hover:bg-transparent"
        >
          {isSubmitting ? (
            <FaSpinner className="mx-auto h-5 w-5 animate-spin" />
          ) : (
            'Send Message'
          )}
        </button>
      </div>

      {submitStatus === 'success' && (
        <div className="rounded-lg border border-green-500 bg-green-50 p-4 dark:border-green-400 dark:bg-green-900/20">
          <div className="text-sm text-green-700 dark:text-green-400">
            Thank you for your message! We will get back to you soon.
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="rounded-lg border border-red-500 bg-red-50 p-4 dark:border-red-400 dark:bg-red-900/20">
          <div className="text-sm text-red-700 dark:text-red-400">
            Sorry, there was an error submitting your message. Please try again.
          </div>
        </div>
      )}
    </form>
  );
} 