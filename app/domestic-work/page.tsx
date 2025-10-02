"use client"

import { useState } from "react"
import HousekeeperForm from "@/components/domestic-work/HouseKeeperForm"
import EmployerForm from "@/components/domestic-work/EmployerForm"
import NavBar from "@/components/home/NavBar"

export default function TabsForm() {
  const [active, setActive] = useState<"housekeeper" | "employer">("housekeeper")

  return (
    <>
      <NavBar />

      {/* Tabs Header */}
      <div className="w-full bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-12">
            <button
              onClick={() => setActive("housekeeper")}
              className={`relative py-6 px-4 font-medium text-lg transition ${
                active === "housekeeper"
                  ? "text-[#834de3]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Housekeeper
              {active === "housekeeper" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#834de3]"></span>
              )}
            </button>

            <button
              onClick={() => setActive("employer")}
              className={`relative py-6 px-4 font-medium text-lg transition ${
                active === "employer"
                  ? "text-[#834de3]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Employer
              {active === "employer" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#834de3]"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {active === "housekeeper" && <HousekeeperForm />}
        {active === "employer" && <EmployerForm />}
      </div>
    </>
  )
}
