import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function LeadForm() {
  const [location] = useLocation();
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    visitorName: "",
    visitorPhone: "",
    intent: "Exploring",
  });

  const getPropertyQuery = trpc.properties.getByPropertyId.useQuery(
    { propertyId: propertyId || "" },
    { enabled: !!propertyId }
  );

  const submitLeadMutation = trpc.leads.submit.useMutation();

  useEffect(() => {
    // Extract propertyId from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setPropertyId(id);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (getPropertyQuery.data) {
      setProperty(getPropertyQuery.data);
      setIsLoading(false);
    }
  }, [getPropertyQuery.data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.visitorName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.visitorPhone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!propertyId) {
      toast.error("Property ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLeadMutation.mutateAsync({
        propertyId,
        visitorName: formData.visitorName,
        visitorPhone: formData.visitorPhone,
        intent: formData.intent as "Buy Now" | "This Week" | "Exploring",
      });

      setSubmitted(true);
      toast.success("Thank you! We'll be in touch soon.");

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ visitorName: "", visitorPhone: "", intent: "Exploring" });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">Loading property details...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Property Not Found</AlertTitle>
              <AlertDescription>The property you're looking for doesn't exist or the link is invalid.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <h2 className="text-2xl font-bold">Thank You!</h2>
              <p className="text-muted-foreground">
                We've received your inquiry and will contact you shortly at {formData.visitorPhone}
              </p>
              <p className="text-sm text-muted-foreground">Redirecting...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Interested in this property?</CardTitle>
          <CardDescription className="text-slate-200">
            Tell us more about your interest and we'll be in touch
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
            {property.address && (
              <p className="text-sm text-muted-foreground mb-2">{property.address}</p>
            )}
            {property.price && (
              <p className="text-lg font-bold text-slate-900">
                ${parseFloat(property.price).toLocaleString()}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.visitorName}
                onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.visitorPhone}
                onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <Label className="mb-3 block">What's your timeline? *</Label>
              <RadioGroup value={formData.intent} onValueChange={(value) => setFormData({ ...formData, intent: value })}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="Buy Now" id="buy-now" disabled={isSubmitting} />
                  <Label htmlFor="buy-now" className="font-normal cursor-pointer">
                    Buy Now
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="This Week" id="this-week" disabled={isSubmitting} />
                  <Label htmlFor="this-week" className="font-normal cursor-pointer">
                    This Week
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Exploring" id="exploring" disabled={isSubmitting} />
                  <Label htmlFor="exploring" className="font-normal cursor-pointer">
                    Exploring
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              We'll contact you shortly with more information about this property.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
