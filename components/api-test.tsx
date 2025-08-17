"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function ApiTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Testing API connection...");
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      
      // First test health endpoint
      const healthResponse = await api.get("/health");
      console.log("Health check successful:", healthResponse.data);
      
      // Then test jobs endpoint
      const jobsResponse = await api.get("/jobs");
      setResult({
        health: healthResponse.data,
        jobs: jobsResponse.data
      });
      console.log("API test successful:", jobsResponse.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      setError(errorMessage);
      console.error("API test failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Testing login...");
      const response = await api.post("/auth/login", { email, password });
      setResult({ login: response.data });
      console.log("Login test successful:", response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      setError(errorMessage);
      console.error("Login test failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
        </div>
        
        <Button 
          onClick={testApi} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Testing..." : "Test API Connection"}
        </Button>

        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email for login test"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password for login test"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button 
            onClick={testLogin} 
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading ? "Testing..." : "Test Login"}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm"><strong>Error:</strong> {error}</p>
          </div>
        )}

        {result && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm"><strong>Success!</strong></p>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
