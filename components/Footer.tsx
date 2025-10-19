'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { name: 'من نحن', href: '/about' },
      { name: 'اتصل بنا', href: '/contact' },
      { name: 'سياسة الخصوصية', href: '/privacy' },
      { name: 'شروط الاستخدام', href: '/terms' },
    ],
    sections: [
      { name: 'الأخبار', href: '/articles' },
      { name: 'التصنيفات', href: '/categories' },
      { name: 'مقترب', href: '/moqtarab' },
      { name: 'عمق', href: '/omq' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { name: 'Youtube', icon: Youtube, href: '#', color: 'hover:text-red-600' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/sabq-logo.png"
                alt="SABQ"
                width={150}
                height={50}
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 mb-4 leading-relaxed" dir="rtl">
              بوابة إعلامية ذكية تقدم أحدث الأخبار والتحليلات مع دعم الذكاء الاصطناعي. 
              نسعى لتقديم محتوى موثوق ومتميز لقرائنا الكرام.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-gray-800 rounded-lg transition-colors ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4" dir="rtl">روابط سريعة</h3>
            <ul className="space-y-2">
              {footerLinks.sections.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-lg font-bold mb-4" dir="rtl">عن سبق</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm" dir="rtl">
            © {currentYear} صحيفة سبق الإلكترونية. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Mail className="w-4 h-4" />
            <a href="mailto:info@sabq.org" className="hover:text-white transition-colors">
              info@sabq.org
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

