import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export default function SetupGuidePage() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Google Sheets Setup
    { id: "gs-1", label: "Create a new Google Sheet", completed: false },
    { id: "gs-2", label: "Create tabs: Leads, Properties, Message Log", completed: false },
    { id: "gs-3", label: "Copy Apps Script code into Google Apps Script editor", completed: false },
    { id: "gs-4", label: "Run setupSheets() function once", completed: false },
    { id: "gs-5", label: "Deploy Apps Script as Web App", completed: false },
    { id: "gs-6", label: "Copy the deployment URL", completed: false },

    // Make.com Setup
    { id: "make-1", label: "Create Make.com account", completed: false },
    { id: "make-2", label: "Create a new scenario", completed: false },
    { id: "make-3", label: "Add Webhooks module (Custom webhook trigger)", completed: false },
    { id: "make-4", label: "Connect Google Sheets module", completed: false },
    { id: "make-5", label: "Add Router for intent routing", completed: false },
    { id: "make-6", label: "Connect Twilio SMS modules", completed: false },
    { id: "make-7", label: "Activate the scenario", completed: false },

    // Twilio Setup
    { id: "twilio-1", label: "Create Twilio account", completed: false },
    { id: "twilio-2", label: "Get a Twilio phone number or use WhatsApp Sandbox", completed: false },
    { id: "twilio-3", label: "Copy Account SID and Auth Token", completed: false },
    { id: "twilio-4", label: "Configure webhook URL in Twilio", completed: false },

    // Deployment
    { id: "deploy-1", label: "Configure Twilio credentials in environment", completed: false },
    { id: "deploy-2", label: "Configure Google Sheets webhook URL", completed: false },
    { id: "deploy-3", label: "Test lead submission with a test property", completed: false },
    { id: "deploy-4", label: "Verify SMS delivery", completed: false },
    { id: "deploy-5", label: "Verify Google Sheets sync", completed: false },
  ]);

  const toggleItem = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const progressPercentage = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Setup Guide</h1>
        <p className="text-muted-foreground mt-1">Complete setup steps to get your lead capture system running</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Setup Progress</CardTitle>
          <CardDescription>Track your setup completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{completedCount} of {checklist.length} steps completed</span>
              <span className="text-2xl font-bold">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="google-sheets" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="google-sheets">Google Sheets</TabsTrigger>
          <TabsTrigger value="make">Make.com</TabsTrigger>
          <TabsTrigger value="twilio">Twilio</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        {/* Google Sheets Tab */}
        <TabsContent value="google-sheets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Google Sheets Setup</CardTitle>
              <CardDescription>Set up your Google Sheet to store leads and properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  You'll need a Google account and access to Google Sheets and Google Apps Script
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Step 1: Create Google Sheet</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Go to <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">sheets.google.com</a></li>
                    <li>Click "Create new spreadsheet"</li>
                    <li>Name it "OpenLoop Leads"</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 2: Create Sheets Tabs</h3>
                  <p className="text-sm text-muted-foreground mb-2">Create three tabs with these exact names:</p>
                  <div className="bg-secondary p-3 rounded-md font-mono text-sm space-y-1">
                    <div>• Leads</div>
                    <div>• Properties</div>
                    <div>• Message Log</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 3: Add Apps Script</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>In your Google Sheet, go to Extensions → Apps Script</li>
                    <li>Copy the provided Apps Script code</li>
                    <li>Paste it into the Apps Script editor</li>
                    <li>Save the project</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 4: Deploy as Web App</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Click "Deploy" → "New deployment"</li>
                    <li>Select "Web app" as the type</li>
                    <li>Set "Execute as" to your account</li>
                    <li>Set "Who has access" to "Anyone"</li>
                    <li>Click Deploy and copy the URL</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Checklist</h4>
                <div className="space-y-2">
                  {checklist.filter(item => item.id.startsWith("gs-")).map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <label className="text-sm cursor-pointer">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Make.com Tab */}
        <TabsContent value="make" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Make.com Automation Setup</CardTitle>
              <CardDescription>Configure Make.com to handle lead routing and SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Prerequisites</AlertTitle>
                <AlertDescription>
                  You need the Google Sheets Web App URL and Twilio credentials before starting
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Step 1: Create Scenario</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Go to <a href="https://make.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">make.com</a></li>
                    <li>Create a new scenario</li>
                    <li>Add a Webhooks module (Custom webhook trigger)</li>
                    <li>Copy the webhook URL</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 2: Add Google Sheets Module</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Add Google Sheets module to your scenario</li>
                    <li>Select "Append a row" action</li>
                    <li>Connect your Google account</li>
                    <li>Select the "Leads" spreadsheet and sheet</li>
                    <li>Map all 14 columns from the webhook data</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 3: Add Router for Intent</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Add a Router module after Google Sheets</li>
                    <li>Create 3 routes: "Buy Now", "This Week", "Exploring"</li>
                    <li>Route based on the intent field</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 4: Add Twilio SMS Modules</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>For each route, add a Twilio "Send SMS" module</li>
                    <li>Customize the message for each intent</li>
                    <li>Example messages:</li>
                  </ol>
                  <div className="bg-secondary p-3 rounded-md text-sm space-y-2 mt-2 font-mono">
                    <div><strong>Buy Now:</strong> "Hi [Name], we have a buyer ready for [Property]! Call us today."</div>
                    <div><strong>This Week:</strong> "Hi [Name], let's schedule a viewing of [Property] this week!"</div>
                    <div><strong>Exploring:</strong> "Hi [Name], thanks for your interest in [Property]. We'll send details soon!"</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 5: Activate Scenario</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Review all modules and connections</li>
                    <li>Click the toggle to activate the scenario</li>
                    <li>Test with a sample lead submission</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Checklist</h4>
                <div className="space-y-2">
                  {checklist.filter(item => item.id.startsWith("make-")).map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <label className="text-sm cursor-pointer">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Twilio Tab */}
        <TabsContent value="twilio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Twilio SMS Setup</CardTitle>
              <CardDescription>Configure Twilio to send SMS messages to leads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Options</AlertTitle>
                <AlertDescription>
                  You can use a Twilio phone number or the free WhatsApp Sandbox for testing
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Option 1: Twilio Phone Number (Recommended)</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Go to <a href="https://www.twilio.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">twilio.com</a> and create an account</li>
                    <li>Go to Phone Numbers → Buy a number</li>
                    <li>Choose a number in your region</li>
                    <li>Go to Account → API Keys & Tokens</li>
                    <li>Copy your Account SID and Auth Token</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Option 2: WhatsApp Sandbox (Free Testing)</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>In Twilio Console, go to Messaging → Try it out → Send an SMS</li>
                    <li>Or use the WhatsApp Sandbox for free testing</li>
                    <li>Note: Sandbox is for testing only, not production</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 1: Get Credentials</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>In Twilio Console, go to Account → API Keys & Tokens</li>
                    <li>Copy your Account SID</li>
                    <li>Copy your Auth Token</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 2: Configure in Make.com</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>In Make.com, add Twilio module</li>
                    <li>Click "Create a connection"</li>
                    <li>Paste your Account SID and Auth Token</li>
                    <li>Select your Twilio phone number</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 3: Configure Webhook (Optional)</h3>
                  <p className="text-sm text-muted-foreground mb-2">To receive SMS replies:</p>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>In Twilio Console, go to Phone Numbers → Manage Numbers</li>
                    <li>Select your number</li>
                    <li>Under "Messaging", set Webhook URL to your Google Apps Script URL</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Checklist</h4>
                <div className="space-y-2">
                  {checklist.filter(item => item.id.startsWith("twilio-")).map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <label className="text-sm cursor-pointer">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployment Tab */}
        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployment & Testing</CardTitle>
              <CardDescription>Final setup and testing steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Before You Start</AlertTitle>
                <AlertDescription>
                  Make sure you have completed all Google Sheets, Make.com, and Twilio setup steps
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Step 1: Configure Environment</h3>
                  <p className="text-sm text-muted-foreground mb-2">Add these to your environment variables:</p>
                  <div className="bg-secondary p-3 rounded-md space-y-2">
                    <div className="flex items-center justify-between">
                      <code className="text-sm">TWILIO_ACCOUNT_SID=your_account_sid</code>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard("TWILIO_ACCOUNT_SID=")}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm">TWILIO_AUTH_TOKEN=your_auth_token</code>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard("TWILIO_AUTH_TOKEN=")}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm">MAKE_WEBHOOK_URL=your_make_webhook_url</code>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard("MAKE_WEBHOOK_URL=")}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 2: Test Lead Submission</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Create a test property in the Properties page</li>
                    <li>Copy the property's QR code URL</li>
                    <li>Visit the URL in your browser</li>
                    <li>Fill out the form with test data</li>
                    <li>Submit the form</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 3: Verify SMS Delivery</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Check that you received an SMS on your test phone number</li>
                    <li>Verify the message contains the property name and intent</li>
                    <li>If using WhatsApp Sandbox, check WhatsApp instead</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 4: Verify Google Sheets Sync</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Open your Google Sheet</li>
                    <li>Check the "Leads" tab</li>
                    <li>Verify the test lead was added with all details</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 5: Go Live</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Generate QR codes for all your properties</li>
                    <li>Print QR codes on signs or flyers</li>
                    <li>Place QR codes at property locations</li>
                    <li>Share QR codes on social media and listings</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Checklist</h4>
                <div className="space-y-2">
                  {checklist.filter(item => item.id.startsWith("deploy-")).map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <label className="text-sm cursor-pointer">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
