import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PageType } from "../MainApp";

interface FooterProps {
  onNavigate?: (page: PageType, data?: any) => void;
}

export function Footer({ }: FooterProps = {}) {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-white mb-4">Wanderlust</h3>
            <p className="text-sm mb-4">
              {t('footer.slogan')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('footer.aboutUs')}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('footer.terms')}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('footer.faq')}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('footer.careers')}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('nav.flights')}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('nav.hotel')}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('nav.visa')}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('nav.carRental')}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">{t('nav.activities')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4">{t('footer.contactUs')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 shrink-0" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 shrink-0" />
                <span>support@wanderlust.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
