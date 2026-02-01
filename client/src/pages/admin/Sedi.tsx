import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, Search, Plus, Pencil, Trash2, MapPin, Phone, Mail, Users, Monitor, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type ExamCenter = {
  id: number;
  name: string;
  code: string | null;
  address: string;
  city: string;
  province: string;
  postalCode: string | null;
  region: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  maxCapacity: number | null;
  hasComputerLab: boolean | null;
  supportsRemoteExams: boolean | null;
  isActive: boolean | null;
};

export default function AdminSedi() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<ExamCenter | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    region: "",
    phone: "",
    email: "",
    maxCapacity: 30,
    hasComputerLab: true,
    supportsRemoteExams: false,
  });

  const utils = trpc.useUtils();
  
  const { data: centers = [], isLoading } = trpc.examCenters.list.useQuery();
  
  const createMutation = trpc.examCenters.create.useMutation({
    onSuccess: () => {
      toast.success("Sede creata con successo");
      setIsCreateDialogOpen(false);
      resetForm();
      utils.examCenters.list.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nella creazione: " + error.message);
    },
  });

  const updateMutation = trpc.examCenters.update.useMutation({
    onSuccess: () => {
      toast.success("Sede aggiornata con successo");
      setIsEditDialogOpen(false);
      setSelectedCenter(null);
      utils.examCenters.list.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nell'aggiornamento: " + error.message);
    },
  });

  const deleteMutation = trpc.examCenters.delete.useMutation({
    onSuccess: () => {
      toast.success("Sede eliminata con successo");
      setIsDeleteDialogOpen(false);
      setSelectedCenter(null);
      utils.examCenters.list.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nell'eliminazione: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      region: "",
      phone: "",
      email: "",
      maxCapacity: 30,
      hasComputerLab: true,
      supportsRemoteExams: false,
    });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.address || !formData.city || !formData.province) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    createMutation.mutate({
      name: formData.name,
      address: formData.address,
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode || undefined,
      region: formData.region || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      maxCapacity: formData.maxCapacity,
      hasComputerLab: formData.hasComputerLab,
      supportsRemoteExams: formData.supportsRemoteExams,
    });
  };

  const handleEdit = (center: ExamCenter) => {
    setSelectedCenter(center);
    setFormData({
      name: center.name,
      address: center.address,
      city: center.city,
      province: center.province,
      postalCode: center.postalCode || "",
      region: center.region || "",
      phone: center.phone || "",
      email: center.email || "",
      maxCapacity: center.maxCapacity || 30,
      hasComputerLab: center.hasComputerLab ?? true,
      supportsRemoteExams: center.supportsRemoteExams ?? false,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedCenter) return;
    if (!formData.name || !formData.address || !formData.city || !formData.province) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    updateMutation.mutate({
      id: selectedCenter.id,
      name: formData.name,
      address: formData.address,
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode || undefined,
      region: formData.region || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      maxCapacity: formData.maxCapacity,
      hasComputerLab: formData.hasComputerLab,
      supportsRemoteExams: formData.supportsRemoteExams,
    });
  };

  const handleDelete = () => {
    if (!selectedCenter) return;
    deleteMutation.mutate({ id: selectedCenter.id });
  };

  const filteredCenters = centers.filter((center: ExamCenter) =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestione Sedi</h1>
            <p className="text-muted-foreground">Gestisci le sedi d'esame accreditate</p>
          </div>
          <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nuova Sede
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cerca sedi..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredCenters.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nessuna sede</h3>
                <p>Le sedi accreditate appariranno qui.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCenters.map((center: ExamCenter) => (
                  <Card key={center.id} className="relative">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold">{center.name}</h3>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(center)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => { setSelectedCenter(center); setIsDeleteDialogOpen(true); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{center.address}, {center.city} ({center.province})</span>
                        </div>
                        {center.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{center.phone}</span>
                          </div>
                        )}
                        {center.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{center.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{center.maxCapacity || 0} posti</span>
                          </div>
                          {center.hasComputerLab && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Monitor className="h-4 w-4" />
                              <span>Lab PC</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Crea Nuova Sede */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuova Sede d'Esame</DialogTitle>
            <DialogDescription>
              Inserisci i dati della nuova sede accreditata
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Sede *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Centro Esami Roma"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="roma@certificalingua.it"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Indirizzo *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Via Roma 123"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Città *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Roma"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Provincia *</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  placeholder="RM"
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">CAP</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="00100"
                  maxLength={5}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Regione</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="Lazio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+39 06 1234567"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Capacità Max</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })}
                  min={1}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="hasComputerLab"
                  checked={formData.hasComputerLab}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasComputerLab: checked })}
                />
                <Label htmlFor="hasComputerLab">Laboratorio PC</Label>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="supportsRemoteExams"
                  checked={formData.supportsRemoteExams}
                  onCheckedChange={(checked) => setFormData({ ...formData, supportsRemoteExams: checked })}
                />
                <Label htmlFor="supportsRemoteExams">Esami Remoti</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creazione...
                </>
              ) : (
                "Crea Sede"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modifica Sede */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifica Sede</DialogTitle>
            <DialogDescription>
              Modifica i dati della sede selezionata
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome Sede *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-address">Indirizzo *</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-city">Città *</Label>
                <Input
                  id="edit-city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-province">Provincia *</Label>
                <Input
                  id="edit-province"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-postalCode">CAP</Label>
                <Input
                  id="edit-postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  maxLength={5}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-region">Regione</Label>
                <Input
                  id="edit-region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefono</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-maxCapacity">Capacità Max</Label>
                <Input
                  id="edit-maxCapacity"
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })}
                  min={1}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="edit-hasComputerLab"
                  checked={formData.hasComputerLab}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasComputerLab: checked })}
                />
                <Label htmlFor="edit-hasComputerLab">Laboratorio PC</Label>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="edit-supportsRemoteExams"
                  checked={formData.supportsRemoteExams}
                  onCheckedChange={(checked) => setFormData({ ...formData, supportsRemoteExams: checked })}
                />
                <Label htmlFor="edit-supportsRemoteExams">Esami Remoti</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                "Salva Modifiche"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Conferma Eliminazione */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma Eliminazione</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler eliminare la sede "{selectedCenter?.name}"? 
              Questa azione disattiverà la sede ma non eliminerà i dati storici.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminazione...
                </>
              ) : (
                "Elimina"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
