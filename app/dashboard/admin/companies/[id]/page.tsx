"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import CompanyDetails from '@/components/admin/CompanyDetails'

export default function CompanyDetailsPage() {
  const params = useParams<{ id: string }>()
  const companyId = Array.isArray(params?.id) ? params.id[0] : params?.id

  if (!companyId) return null

  return (
    <div className="p-6">
      <CompanyDetails companyId={companyId} />
    </div>
  )
}