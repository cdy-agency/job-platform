"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditJobRedirectPage() {
	const params = useParams();
	const id = params?.id as string;
	const router = useRouter();

	useEffect(() => {
		if (id) {
			router.replace(`/dashboard/company/post-job?edit=${id}`);
		}
	}, [id, router]);

	return (
		<div className="p-6 text-gray-700">
			Redirecting to the edit form...
		</div>
	);
}
