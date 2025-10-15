"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"
import Link from "next/link"

export default function TermsNotice() {
  const [show, setShow] = useState(false)
  const [accepted, setAccepted] = useState(false)

  // Check if user already accepted
  useEffect(() => {
    const accepted = localStorage.getItem("termsAccepted")
    if (!accepted) {
      setTimeout(() => setShow(true), 800)
    } else {
      setAccepted(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("termsAccepted", "true")
    setShow(false)
    setAccepted(true)
  }

  const handleClose = () => setShow(false)
  const handleReopen = () => setShow(true)

  return (
    <>
      {/* Overlay modal */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg md:max-w-2xl mx-auto px-4"
            >
              <Card className="rounded-2xl shadow-2xl border border-gray-100">
                <CardContent className="p-8 bg-white text-center">
                  <h2 className="text-3xl font-bold text-purple-700 mb-4">
                    Before You Continue
                  </h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    By using{" "}
                    <span className="font-semibold text-black">KaziLink</span>,
                    you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-purple-700 font-medium hover:underline"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-purple-700 font-medium hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>

                  <div className="flex justify-center gap-4">
                    <Link href="/terms-conditions">
                      <Button
                      onClick={handleAccept}
                      className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-xl"
                    >
                      Terms and condition
                    </Button>
                    </Link>
                    <Button
                      onClick={handleClose}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2 rounded-xl"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating reopen button */}
      {accepted && !show && (
        <motion.button
          onClick={handleReopen}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="fixed flex gap-2 items-center bottom-6 right-6 z-40 bg-purple-700 hover:bg-purple-800 text-white p-3 rounded-full shadow-lg"
          aria-label="View Terms and Conditions"
        >
          <Info className="w-5 h-5" />
          Terms and Conditions
        </motion.button>
      )}
    </>
  )
}
