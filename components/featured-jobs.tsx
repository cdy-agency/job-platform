"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchJobs } from "@/lib/api";
import { useTranslation } from "react-i18next";

export function FeaturedJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const {t} = useTranslation('common')

  useEffect(() => {
    fetchJobs()
      .then((list) => {
        const arr = Array.isArray(list) ? list : []
        const filtered = arr.filter((j: any) => !j?.isExpired && !(typeof j?.remainingDays === 'number' && j.remainingDays <= 0))
        setJobs(filtered.slice(0, 4))
      })
      .catch(() => setJobs([]));
  }, []);

  if (jobs.length === 0) {
    return (
      <section className="bg-gray-50 py-16 px-10">
        <div className="container px-4 sm:px-8 text-center">
          <h2 className="mb-2 text-3xl font-bold">{t('featured-jobs-title')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('no-jobs-message')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold text-black">{t('featured-jobs-title')}</h2>
          <p className="text-muted-foreground">
            {t('featured-jobs-subtitle')}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {jobs.map((job: any) => (
            <Card
              key={job._id}
              className="flex flex-col bg-slate-100 text-black"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {job.companyId?.logo ? (
                    <img
                      src={job.companyId.logo}
                      alt={job.companyId?.companyName || "Company"}
                      className="h-8 w-8 rounded object-cover"
                      width={32}
                      height={32}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-600">
                        {job.companyId?.companyName?.charAt(0) || 'C'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.companyId?.companyName || "Company"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-2">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="text-white bg-[#834de3]"
                  >
                    {job.employmentType}
                  </Badge>
                  {job.location && (
                    <Badge variant="outline" className="text-black font-bold">{job.location}</Badge>
                  )}
                </div>
                <p className="line-clamp-3 text-sm text-black">
                  {(job.description || "").slice(0, 100)}...
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/jobs/${job._id}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent bg-[#834de3] hover:bg-purple-500 cursor-pointer text-white"
                  >
                    Reba ibisobanuro
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/jobs">
            <Button size="lg">Reba Imirimo Yose</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
