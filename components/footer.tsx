"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { useTranslation } from "react-i18next"

export function Footer() {
  const {t} = useTranslation('common')
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Akazi-Link</h3>
            <p className="text-sm text-gray-600">
              {t('footer-company-desc')}
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">{t('footer-jobseekers-title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="text-gray-600 hover:text-blue-500">
                  {t('footer-jobseekers-browse')}
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-600 hover:text-blue-500">
                  {t('footer-jobseekers-account')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">{t('footer-companies-title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register" className="text-gray-600 hover:text-blue-500">
                  {t('footer-companies-postjob')}
                </Link>
              </li>
              {/* <li>
                <Link href="#" className="text-gray-600 hover:text-blue-500">
                  Talent Solutions
                </Link>
              </li> */}
              {/* <li>
                <Link href="#" className="text-gray-600 hover:text-blue-500">
                  Pricing
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">{t('footer-connect-title')}</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-blue-500">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-500">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-500">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-500">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {t('footer-contact')} <span className="text-blue-500">support@akazilink.com</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} {t('footer-rights')}</p>
        </div>
      </div>
    </footer>
  )
}
