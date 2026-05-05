import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowRight, QrCode, BarChart3, MessageSquare, Zap } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (user) {
    // Redirect authenticated users to dashboard
    navigate("/dashboard/properties");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">OpenLoop</span>
          </div>
          <a href={getLoginUrl()} className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Sign In
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900">
              Real Estate Lead Capture Made Simple
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Generate QR codes for your properties, capture leads instantly, and automate SMS follow-ups with Make.com and Twilio.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={getLoginUrl()}>
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Powerful Features for Real Estate Professionals
          </h2>
          <p className="text-lg text-slate-600">Everything you need to manage properties and capture leads</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <QrCode className="w-8 h-8 text-slate-900 mb-2" />
              <CardTitle>QR Code Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Generate unique QR codes for each property with one click
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="w-8 h-8 text-slate-900 mb-2" />
              <CardTitle>Lead Capture Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Beautiful, mobile-responsive forms that capture visitor interest
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="w-8 h-8 text-slate-900 mb-2" />
              <CardTitle>Automated SMS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Send personalized SMS messages via Twilio automatically
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-slate-900 mb-2" />
              <CardTitle>Lead Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Track and manage all leads with status updates and notes
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Add Properties</h3>
            <p className="text-sm text-slate-600">
              Add your real estate properties with details and pricing
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Generate QR Codes</h3>
            <p className="text-sm text-slate-600">
              Create unique QR codes for each property and print them
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Capture Leads</h3>
            <p className="text-sm text-slate-600">
              Visitors scan QR codes and submit their information
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Auto Follow-up</h3>
            <p className="text-sm text-slate-600">
              Send SMS and sync leads to Google Sheets automatically
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-slate-200">
              Join real estate professionals using OpenLoop to capture more leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href={getLoginUrl()}>
              <Button size="lg" className="gap-2 bg-white text-slate-900 hover:bg-slate-100">
                Start Free Today <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-slate-600">
            <p>&copy; 2026 OpenLoop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
