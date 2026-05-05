import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [propertyFilter, setPropertyFilter] = useState<string | null>(null);

  const { data: leads, isLoading, refetch } = trpc.leads.list.useQuery();
  const updateStatusMutation = trpc.leads.updateStatus.useMutation();

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: leadId,
        status: newStatus as any,
      });
      toast.success("Lead status updated");
      refetch();
    } catch (error) {
      toast.error("Failed to update lead status");
    }
  };

  const filteredLeads = leads?.filter((lead: any) => {
    const matchesSearch =
      lead.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.visitorPhone.includes(searchTerm);
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesProperty = !propertyFilter || lead.propertyId === propertyFilter;
    return matchesSearch && matchesStatus && matchesProperty;
  }) || [];

  const uniqueProperties = Array.from(new Set(leads?.map((l: any) => l.propertyId) || []));

  if (isLoading) {
    return <div className="p-8">Loading leads...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground mt-1">View and manage all property inquiry leads</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Management</CardTitle>
          <CardDescription>Track and update the status of all incoming leads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Input
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-48"
            />
            <Select value={propertyFilter || ""} onValueChange={(v) => setPropertyFilter(v || null)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Properties</SelectItem>
                {uniqueProperties.map((prop: string) => (
                  <SelectItem key={prop} value={prop}>{prop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter || ""} onValueChange={(v) => setStatusFilter(v || null)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Engaged">Engaged</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Cold">Cold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead: any) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-mono text-xs">{lead.leadId}</TableCell>
                      <TableCell className="font-medium">{lead.visitorName}</TableCell>
                      <TableCell>{lead.visitorPhone}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{lead.propertyId}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                          {lead.intent}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(value) => handleStatusChange(lead.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Engaged">Engaged</SelectItem>
                            <SelectItem value="Booked">Booked</SelectItem>
                            <SelectItem value="Cold">Cold</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(lead.createdAt), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No leads found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lead Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{leads?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Total Leads</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{leads?.filter((l: any) => l.status === "New").length || 0}</div>
              <p className="text-sm text-muted-foreground">New</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{leads?.filter((l: any) => l.status === "Engaged").length || 0}</div>
              <p className="text-sm text-muted-foreground">Engaged</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{leads?.filter((l: any) => l.status === "Booked").length || 0}</div>
              <p className="text-sm text-muted-foreground">Booked</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
