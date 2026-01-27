import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import PSIIndicator from '@/components/PSIIndicator';
import { ParkingZone } from '@/types';
import { parkingZones as mockZones, wards } from '@/data/mockData';
import {
  Plus,
  MapPin,
  Car,
  IndianRupee,
  Edit,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminZones: React.FC = () => {
  const [zones, setZones] = useState<ParkingZone[]>(mockZones);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    wardId: '',
    wardName: '',
    lat: '',
    lng: '',
    totalSlots: '',
    availableSlots: '',
    pricePerHour: '',
    psi: '',
    status: 'open' as 'open' | 'closed',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      wardId: '',
      wardName: '',
      lat: '',
      lng: '',
      totalSlots: '',
      availableSlots: '',
      pricePerHour: '',
      psi: '',
      status: 'open',
    });
  };

  const handleAdd = () => {
    const newZone: ParkingZone = {
      id: `pz-${Date.now()}`,
      name: formData.name,
      wardId: formData.wardId,
      wardName: formData.wardName,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      totalSlots: parseInt(formData.totalSlots),
      availableSlots: parseInt(formData.availableSlots),
      pricePerHour: parseInt(formData.pricePerHour),
      psi: parseInt(formData.psi),
      status: formData.status,
    };
    setZones([...zones, newZone]);
    setIsAddModalOpen(false);
    resetForm();
    toast({
      title: 'Zone Added',
      description: `${newZone.name} has been created.`,
    });
  };

  const handleEdit = () => {
    if (!selectedZone) return;
    setZones(prev =>
      prev.map(z =>
        z.id === selectedZone.id
          ? {
              ...z,
              name: formData.name,
              wardId: formData.wardId,
              wardName: formData.wardName,
              lat: parseFloat(formData.lat),
              lng: parseFloat(formData.lng),
              totalSlots: parseInt(formData.totalSlots),
              availableSlots: parseInt(formData.availableSlots),
              pricePerHour: parseInt(formData.pricePerHour),
              psi: parseInt(formData.psi),
              status: formData.status,
            }
          : z
      )
    );
    setIsEditModalOpen(false);
    setSelectedZone(null);
    resetForm();
    toast({
      title: 'Zone Updated',
      description: 'The parking zone has been updated.',
    });
  };

  const handleDelete = () => {
    if (!selectedZone) return;
    setZones(prev => prev.filter(z => z.id !== selectedZone.id));
    setIsDeleteModalOpen(false);
    toast({
      title: 'Zone Deleted',
      description: `${selectedZone.name} has been removed.`,
      variant: 'destructive',
    });
    setSelectedZone(null);
  };

  const openEditModal = (zone: ParkingZone) => {
    setSelectedZone(zone);
    setFormData({
      name: zone.name,
      wardId: zone.wardId,
      wardName: zone.wardName,
      lat: String(zone.lat),
      lng: String(zone.lng),
      totalSlots: String(zone.totalSlots),
      availableSlots: String(zone.availableSlots),
      pricePerHour: String(zone.pricePerHour),
      psi: String(zone.psi),
      status: zone.status || 'open',
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (zone: ParkingZone) => {
    setSelectedZone(zone);
    setIsDeleteModalOpen(true);
  };

  const handleWardChange = (wardId: string) => {
    const ward = wards.find(w => w.id === wardId);
    setFormData({
      ...formData,
      wardId,
      wardName: ward?.name || '',
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Zone Name',
      sortable: true,
      render: (zone: ParkingZone) => (
        <div>
          <p className="font-medium text-foreground">{zone.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {zone.wardName}
          </p>
        </div>
      ),
    },
    {
      key: 'totalSlots',
      label: 'Slots',
      sortable: true,
      render: (zone: ParkingZone) => (
        <span>
          <span className="font-semibold">{zone.availableSlots}</span>
          <span className="text-muted-foreground">/{zone.totalSlots}</span>
        </span>
      ),
    },
    {
      key: 'pricePerHour',
      label: 'Price/hr',
      sortable: true,
      render: (zone: ParkingZone) => (
        <span className="font-semibold text-primary flex items-center gap-1">
          <IndianRupee className="w-3 h-3" />
          {zone.pricePerHour}
        </span>
      ),
    },
    {
      key: 'psi',
      label: 'PSI',
      sortable: true,
      render: (zone: ParkingZone) => <PSIIndicator value={zone.psi} size="sm" />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (zone: ParkingZone) => (
        <Badge variant={zone.status === 'closed' ? 'destructive' : 'default'}>
          {zone.status || 'open'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (zone: ParkingZone) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => openEditModal(zone)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => openDeleteModal(zone)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const totalSlots = zones.reduce((sum, z) => sum + z.totalSlots, 0);
  const availableSlots = zones.reduce((sum, z) => sum + z.availableSlots, 0);

  return (
    <DashboardLayout title="Zone Management">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Zones</p>
                  <p className="text-xl font-bold">{zones.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Car className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Slots</p>
                  <p className="text-xl font-bold">{availableSlots}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Car className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Slots</p>
                  <p className="text-xl font-bold">{totalSlots}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Occupancy</p>
                  <p className="text-xl font-bold">
                    {Math.round(((totalSlots - availableSlots) / totalSlots) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zones Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Parking Zones
              </CardTitle>
              <CardDescription>Manage all parking zones in Solapur</CardDescription>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Zone
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              data={zones}
              columns={columns}
              searchKey="name"
              searchPlaceholder="Search zones..."
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={() => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        resetForm();
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditModalOpen ? 'Edit Parking Zone' : 'Add New Parking Zone'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Zone Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Station Parking"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Ward</Label>
                <Select value={formData.wardId} onValueChange={handleWardChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map(ward => (
                      <SelectItem key={ward.id} value={ward.id}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="0.0001"
                  value={formData.lat}
                  onChange={e => setFormData({ ...formData, lat: e.target.value })}
                  placeholder="17.6599"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="0.0001"
                  value={formData.lng}
                  onChange={e => setFormData({ ...formData, lng: e.target.value })}
                  placeholder="75.9064"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalSlots">Total Slots</Label>
                <Input
                  id="totalSlots"
                  type="number"
                  value={formData.totalSlots}
                  onChange={e => setFormData({ ...formData, totalSlots: e.target.value })}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableSlots">Available Slots</Label>
                <Input
                  id="availableSlots"
                  type="number"
                  value={formData.availableSlots}
                  onChange={e => setFormData({ ...formData, availableSlots: e.target.value })}
                  placeholder="30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerHour">Price/Hour (₹)</Label>
                <Input
                  id="pricePerHour"
                  type="number"
                  value={formData.pricePerHour}
                  onChange={e => setFormData({ ...formData, pricePerHour: e.target.value })}
                  placeholder="20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="psi">PSI (0-100)</Label>
                <Input
                  id="psi"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.psi}
                  onChange={e => setFormData({ ...formData, psi: e.target.value })}
                  placeholder="50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v: 'open' | 'closed') => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false);
              setIsEditModalOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={isEditModalOpen ? handleEdit : handleAdd}>
              {isEditModalOpen ? 'Update Zone' : 'Add Zone'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Zone
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedZone?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminZones;
