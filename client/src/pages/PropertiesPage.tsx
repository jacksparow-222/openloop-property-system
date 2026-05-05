import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Download, Trash2, Edit2, Plus, Printer } from "lucide-react";
import { toast } from "sonner";

export default function PropertiesPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", address: "", price: "", agentPhone: "" });

  const { data: properties, isLoading, refetch } = trpc.properties.list.useQuery();
  const createMutation = trpc.properties.create.useMutation();
  const updateMutation = trpc.properties.update.useMutation();
  const deleteMutation = trpc.properties.delete.useMutation();

  const handleAddProperty = async () => {
    if (!formData.name.trim()) {
      toast.error("Property name is required");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: formData.name,
        address: formData.address,
        price: formData.price,
        agentPhone: formData.agentPhone,
      });
      toast.success("Property created successfully");
      setFormData({ name: "", address: "", price: "", agentPhone: "" });
      setIsAddOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create property");
    }
  };

  const handleEditProperty = async () => {
    if (!formData.name.trim()) {
      toast.error("Property name is required");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: selectedProperty.id,
        name: formData.name,
        address: formData.address,
        price: formData.price,
        agentPhone: formData.agentPhone,
      });
      toast.success("Property updated successfully");
      setFormData({ name: "", address: "", price: "", agentPhone: "" });
      setIsEditOpen(false);
      setSelectedProperty(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update property");
    }
  };

  const handleDeleteProperty = async () => {
    try {
      await deleteMutation.mutateAsync({ id: selectedProperty.id });
      toast.success("Property deleted successfully");
      setIsDeleteOpen(false);
      setSelectedProperty(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete property");
    }
  };

  const handleDownloadQR = async (property: any) => {
    try {
      const formUrl = `${window.location.origin}/form?id=${property.propertyId}`;
      const response = await fetch(`/api/qr/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formUrl, propertyName: property.name }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("Empty response from server");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `QR-${property.name.replace(/\s+/g, "-")}.png`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("QR code downloaded successfully");
    } catch (error) {
      console.error("QR download error:", error);
      toast.error("Failed to download QR code. Please try again.");
    }
  };

  const handlePrintQR = async (property: any) => {
    try {
      const formUrl = `${window.location.origin}/form?id=${property.propertyId}`;
      const response = await fetch(`/api/qr/dataurl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate QR code");
      }

      const data = await response.json();
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print QR Code - ${property.name}</title>
              <style>
                body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
                .container { text-align: center; }
                h1 { font-size: 24px; margin-bottom: 20px; }
                img { max-width: 400px; margin: 20px 0; }
                p { font-size: 14px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>${property.name}</h1>
                <img src="${data.dataUrl}" alt="QR Code" />
                <p>Scan this QR code to view property details and submit an inquiry</p>
              </div>
              <script>
                window.onload = function() { window.print(); };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      toast.success("Print dialog opened");
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to print QR code");
    }
  };

  const openEditDialog = (property: any) => {
    setSelectedProperty(property);
    setFormData({
      name: property.name,
      address: property.address || "",
      price: property.price ? String(property.price) : "",
      agentPhone: property.agentPhone || "",
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (property: any) => {
    setSelectedProperty(property);
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return <div className="p-8">Loading properties...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground mt-1">Manage your real estate properties and generate QR codes</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>Enter the property details below</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Property Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Penthouse Agdal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Property address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 500000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="agentPhone">Agent Phone</Label>
                <Input
                  id="agentPhone"
                  placeholder="+1234567890"
                  value={formData.agentPhone}
                  onChange={(e) => setFormData({ ...formData, agentPhone: e.target.value })}
                />
              </div>
              <Button onClick={handleAddProperty} className="w-full">
                Create Property
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Properties</CardTitle>
          <CardDescription>View and manage your property listings</CardDescription>
        </CardHeader>
        <CardContent>
          {properties && properties.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Agent Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property: any) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{property.address || "-"}</TableCell>
                      <TableCell>{property.price ? `$${parseFloat(property.price).toLocaleString()}` : "-"}</TableCell>
                      <TableCell>{property.agentPhone || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadQR(property)}
                            className="gap-1"
                            title="Download QR code as PNG"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrintQR(property)}
                            className="gap-1"
                            title="Print QR code"
                          >
                            <Printer className="w-4 h-4" />
                            Print
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(property)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(property)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No properties yet. Create your first property to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription>Update the property details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Property Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Penthouse Agdal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                placeholder="Property address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                type="number"
                placeholder="e.g., 500000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-agentPhone">Agent Phone</Label>
              <Input
                id="edit-agentPhone"
                placeholder="+1234567890"
                value={formData.agentPhone}
                onChange={(e) => setFormData({ ...formData, agentPhone: e.target.value })}
              />
            </div>
            <Button onClick={handleEditProperty} className="w-full">
              Update Property
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProperty?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProperty} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
