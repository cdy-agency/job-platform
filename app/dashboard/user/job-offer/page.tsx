"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { respondToWorkRequest, fetchEmployeeWorkRequests } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface WorkRequestItem {
  id: string
  companyName: string
  message?: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt?: string
}

export default function JobOfferPage() {
  const [items, setItems] = useState<WorkRequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<string>("")
  const [error, setError] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchEmployeeWorkRequests()
        if (res?.message?.toLowerCase?.().includes('access denied')) {
          setError('Access denied. Log in as an employee.')
          setItems([])
          return
        }
        const list = Array.isArray(res?.workRequests) ? res.workRequests : Array.isArray(res) ? res : []
        const normalized: WorkRequestItem[] = list.map((w: any, idx: number) => ({
          id: String(w._id || w.id || w.requestId || `wr-${idx}-${Date.now()}`),
          companyName: w.companyId?.companyName || w.company?.companyName || w.companyName || w.company?.name || 'Company',
          message: w.message || '',
          status: (w.status === 'accepted' || w.status === 'rejected') ? w.status : 'pending',
          createdAt: w.createdAt || w.date || undefined,
        }))
        setItems(normalized)
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load job offers')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const respond = async (id: string, action: 'accept' | 'reject') => {
    setActingId(id)
    try {
      await respondToWorkRequest(id, action)
      setItems((prev) => prev.map((w) => (w.id === id ? { ...w, status: action === 'accept' ? 'accepted' : 'rejected' } : w)))
      toast({ title: action === 'accept' ? 'Offer accepted' : 'Offer rejected' })
    } catch (e: any) {
      toast({ title: 'Failed to submit response', description: e?.response?.data?.message || 'Try again later', variant: 'destructive' })
    } finally {
      setActingId("")
    }
  }

  const statusClass = (status: WorkRequestItem['status']) => {
    if (status === 'accepted') return 'bg-green-100 text-green-800'
    if (status === 'rejected') return 'bg-red-100 text-red-800'
    return 'bg-[#f5f0ff] text-[#834de3] border border-[#eadbff]'
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="container space-y-6 p-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Job Offers</h1>
          <p className="text-sm text-gray-600">Companies that invited you to consider a role</p>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {items.length === 0 && !error ? (
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-8 text-center text-sm text-gray-600">No job offers yet.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((w) => (
            <Card key={w.id} className="border-gray-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-gray-900">{w.companyName}</CardTitle>
                  <CardDescription>
                    {w.createdAt ? new Date(w.createdAt).toLocaleString() : ''}
                  </CardDescription>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs ${statusClass(w.status)}`}>{w.status}</span>
              </CardHeader>
              <CardContent className="space-y-3">
                {w.message && (
                  <p className="text-sm text-gray-800">{w.message}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    disabled={w.status !== 'pending' || actingId === w.id}
                    onClick={() => respond(w.id, 'accept')}
                    className="bg-[#834de3] text-white hover:bg-[#6b3ac2]"
                  >
                    {actingId === w.id ? 'Submitting...' : 'Accept'}
                  </Button>
                  <Button
                    disabled={w.status !== 'pending' || actingId === w.id}
                    variant="outline"
                    onClick={() => respond(w.id, 'reject')}
                    className="border-[#834de3] text-[#834de3] hover:bg-[#f5f0ff]"
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}