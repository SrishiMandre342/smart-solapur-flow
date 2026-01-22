import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PSIIndicator from '@/components/PSIIndicator';
import { ParkingZone, wards } from '@/data/mockData';
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Car,
  Search,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExtendedParkingZone extends ParkingZone {
  status: 'open' | 'closed';
}

interface ZoneManagementProps {
  zones: ParkingZone[];
  onAddZone?: (zone: ExtendedParkingZone) => void;
  onEditZone?: (zone: ExtendedParkingZone) => void;
  onDeleteZone?: (zoneId: string) => void;
}

const initialFormState = {
  name: '',
  wardId: '',
  lat: '',
  lng: '',
  totalSlots: '',
  availableSlots: '',
  pricePerHour: '',
  psi: '',
  status: 'open' as 'open' | 'closed',
};

const ZoneManagement: React.FC<ZoneManagementProps> = ({
  zones,
  onAddZone,
  onEditZone,
  onDeleteZone,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ExtendedParkingZone | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Add status to zones for display
  const extendedZones: ExtendedParkingZone[] = zones.map((zone) => ({
    ...zone,
    status: zone.availableSlots > 0 ? 'open' : 'closed',
  }));

  const filteredZones = extendedZones.filter(
    (zone) =>
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.wardName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedZone(null);
  };

  const handleAddZone = () => {
    const ward = wards.find((w) => w.id === formData.wardId);
    const newZone: ExtendedParkingZone = {
      id: `pz-${Date.now()}`,
      name: formData.name,
      wardId: formData.wardId,
      wardName: ward?.name || '',
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      totalSlots: parseInt(formData.totalSlots),
      availableSlots: parseInt(formData.availableSlots),
      pricePerHour: parseInt(formData.pricePerHour),
      psi: parseInt(formData.psi),
      status: formData.status,
    };
    
    onAddZone?.(newZone);
    toast({
      title: 'Zone Added',
      description: `${newZone.name} has been added successfully.`,
    });
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditZone = () => {
    if (!selectedZone) return;
    
    const ward = wards.find((w) => w.id === formData.wardId);
    const updatedZone: ExtendedParkingZone = {
      ...selectedZone,
      name: formData.name,
      wardId: formData.wardId,
      wardName: ward?.name || selectedZone.wardName,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      totalSlots: parseInt(formData.totalSlots),
      availableSlots: parseInt(formData.availableSlots),
      pricePerHour: parseInt(formData.pricePerHour),
      psi: parseInt(formData.psi),
      status: formData.status,
    };
    
    onEditZone?.(updatedZone);
    toast({
      title: 'Zone Updated',
      description: `${updatedZone.name} has been updated successfully.`,
    });
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteZone = () => {
    if (!selectedZone) return;
    
    onDeleteZone?.(selectedZone.id);
    toast({
      title: 'Zone Deleted',
      description: `${selectedZone.name} has been deleted.`,
      variant: 'destructive',
    });
    setIsDeleteModalOpen(false);
    resetForm();
  };

  const openEditModal = (zone: ExtendedParkingZone) => {
    setSelectedZone(zone);
    setFormData({
      name: zone.name,
      wardId: zone.wardId,
      lat: zone.lat.toString(),
      lng: zone.lng.toString(),
      totalSlots: zone.totalSlots.toString(),
      availableSlots: zone.availableSlots.toString(),
      pricePerHour: zone.pricePerHour.toString(),
      psi: zone.psi.toString(),
      status: zone.status,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (zone: ExtendedParkingZone) => {
    setSelectedZone(zone);
    setIsDeleteModalOpen(true);
  };

  const FormContent = () => (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Zone Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter zone name"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="ward">Ward</Label>
          <Select value={formData.wardId} onValueChange={(v) => handleInputChange('wardId', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select ward" />
            </SelectTrigger>
            <SelectContent>
              {wards.map((ward) => (
                <SelectItem key={ward.id} value={ward.id}>
                  {ward.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="lat">Latitude</Label>
          <Input
            id="lat"
            type="number"
            step="0.0001"
            value={formData.lat}
            onChange={(e) => handleInputChange('lat', e.target.value)}
            placeholder="17.6599"
          />
        </div>

        <div>
          <Label htmlFor="lng">Longitude</Label>
          <Input
            id="lng"
            type="number"
            step="0.0001"
            value={formData.lng}
            onChange={(e) => handleInputChange('lng', e.target.value)}
            placeholder="75.9064"
          />
        </div>

        <div>
          <Label htmlFor="totalSlots">Total Slots</Label>
          <Input
            id="totalSlots"
            type="number"
            value={formData.totalSlots}
            onChange={(e) => handleInputChange('totalSlots', e.target.value)}
            placeholder="50"
          />
        </div>

        <div>
          <Label htmlFor="availableSlots">Available Slots</Label>
          <Input
            id="availableSlots"
            type="number"
            value={formData.availableSlots}
            onChange={(e) => handleInputChange('availableSlots', e.target.value)}
            placeholder="20"
          />
        </div>

        <div>
          <Label htmlFor="pricePerHour">Price per Hour (₹)</Label>
          <Input
            id="pricePerHour"
            type="number"
            value={formData.pricePerHour}
            onChange={(e) => handleInputChange('pricePerHour', e.target.value)}
            placeholder="30"
          />
        </div>

        <div>
          <Label htmlFor="psi">PSI (0-100)</Label>
          <Input
            id="psi"
            type="number"
            min="0"
            max="100"
            value={formData.psi}
            onChange={(e) => handleInputChange('psi', e.target.value)}
            placeholder="50"
          />
        </div>

        <div className="col-span-2 flex items-center justify-between">
          <Label htmlFor="status">Zone Status</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {formData.status === 'open' ? 'Open' : 'Closed'}
            </span>
            <Switch
              id="status"
              checked={formData.status === 'open'}
              onCheckedChange={(checked) =>
                handleInputChange('status', checked ? 'open' : 'closed')
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            Manage Parking Zones
          </CardTitle>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Zone
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search zones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone Name</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead className="text-center">Slots</TableHead>
                <TableHead className="text-center">PSI</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredZones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">{zone.name}</TableCell>
                  <TableCell className="text-muted-foreground">{zone.wardName}</TableCell>
                  <TableCell className="text-center">
                    {zone.availableSlots}/{zone.totalSlots}
                  </TableCell>
                  <TableCell className="text-center">
                    <PSIIndicator value={zone.psi} size="sm" showLabel={false} />
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    ₹{zone.pricePerHour}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={zone.status === 'open' ? 'default' : 'secondary'}
                      className={
                        zone.status === 'open'
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {zone.status === 'open' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {zone.status === 'open' ? 'Open' : 'Closed'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditModal(zone)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDeleteModal(zone)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Parking Zone
            </DialogTitle>
            <DialogDescription>
              Fill in the details to add a new parking zone.
            </DialogDescription>
          </DialogHeader>
          <FormContent />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddZone}>Add Zone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Edit Parking Zone
            </DialogTitle>
            <DialogDescription>Update the zone details below.</DialogDescription>
          </DialogHeader>
          <FormContent />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditZone}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Delete Parking Zone
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedZone?.name}"? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteZone}>
              Delete Zone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ZoneManagement;
