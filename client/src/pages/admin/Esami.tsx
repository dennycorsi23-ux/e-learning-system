import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Search, Plus, Pencil, Trash2, MapPin, Users, Euro, Loader2, Clock, Globe } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type ExamSession = {
  id: number;
  languageId: number;
  qcerLevelId: number;
  examCenterId: number | null;
  title: string;
  description: string | null;
  examDate: Date;
  startTime: string | null;
  maxParticipants: number | null;
  currentParticipants: number | null;
  price: string | null;
  isRemote: boolean | null;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "ongoing" | null;
};

type Language = {
  id: number;
  code: string;
  name: string;
};

type QcerLevel = {
  id: number;
  code: string;
  name: string;
};

type ExamCenter = {
  id: number;
  name: string;
  city: string;
};

const statusLabels: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Programmato", color: "bg-blue-600" },
  in_progress: { label: "In Corso", color: "bg-yellow-600" },
  completed: { label: "Completato", color: "bg-green-600" },
  cancelled: { label: "Annullato", color: "bg-red-600" },
};

export default function AdminEsami() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ExamSession | null>(null);
  
  const [formData, setFormData] = useState({
    languageId: 0,
    qcerLevelId: 0,
    examCenterId: 0,
    title: "",
    description: "",
    examDate: "",
    startTime: "09:00",
    maxParticipants: 30,
    price: "150.00",
    isRemote: false,
  });

  const utils = trpc.useUtils();
  
  const { data: sessions = [], isLoading } = trpc.examSessions.list.useQuery();
  const { data: languages = [] } = trpc.languages.list.useQuery();
  const { data: qcerLevels = [] } = trpc.qcerLevels.list.useQuery();
  const { data: examCenters = [] } = trpc.examCenters.list.useQuery();
  
  const createMutation = trpc.examSessions.create.useMutation({
    onSuccess: () => {
      toast.success("Sessione creata con successo");
      setIsCreateDialogOpen(false);
      resetForm();
      utils.examSessions.list.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nella creazione: " + error.message);
    },
  });

  const updateMutation = trpc.examSessions.update.useMutation({
    onSuccess: () => {
      toast.success("Sessione aggiornata con successo");
      setIsEditDialogOpen(false);
      setSelectedSession(null);
      utils.examSessions.list.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nell'aggiornamento: " + error.message);
    },
  });

  const deleteMutation = trpc.examSessions.delete.useMutation({
    onSuccess: () => {
      toast.success("Sessione annullata con successo");
      setIsDeleteDialogOpen(false);
      setSelectedSession(null);
      utils.examSessions.list.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nell'annullamento: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      languageId: 0,
      qcerLevelId: 0,
      examCenterId: 0,
      title: "",
      description: "",
      examDate: "",
      startTime: "09:00",
      maxParticipants: 30,
      price: "150.00",
      isRemote: false,
    });
  };

  const handleCreate = () => {
    if (!formData.title || !formData.languageId || !formData.qcerLevelId || !formData.examDate) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    createMutation.mutate({
      languageId: formData.languageId,
      qcerLevelId: formData.qcerLevelId,
      examCenterId: formData.examCenterId || undefined,
      title: formData.title,
      description: formData.description || undefined,
      examDate: new Date(formData.examDate),
      startTime: formData.startTime || undefined,
      maxParticipants: formData.maxParticipants,
      price: formData.price || undefined,
      isRemote: formData.isRemote,
    });
  };

  const handleEdit = (session: ExamSession) => {
    setSelectedSession(session);
    const dateStr = new Date(session.examDate).toISOString().split('T')[0];
    setFormData({
      languageId: session.languageId,
      qcerLevelId: session.qcerLevelId,
      examCenterId: session.examCenterId || 0,
      title: session.title,
      description: session.description || "",
      examDate: dateStr,
      startTime: session.startTime || "09:00",
      maxParticipants: session.maxParticipants || 30,
      price: session.price || "150.00",
      isRemote: session.isRemote ?? false,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedSession) return;
    if (!formData.title || !formData.languageId || !formData.qcerLevelId || !formData.examDate) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    updateMutation.mutate({
      id: selectedSession.id,
      languageId: formData.languageId,
      qcerLevelId: formData.qcerLevelId,
      examCenterId: formData.examCenterId || undefined,
      title: formData.title,
      description: formData.description || undefined,
      examDate: new Date(formData.examDate),
      startTime: formData.startTime || undefined,
      maxParticipants: formData.maxParticipants,
      price: formData.price || undefined,
      isRemote: formData.isRemote,
    });
  };

  const handleDelete = () => {
    if (!selectedSession) return;
    deleteMutation.mutate({ id: selectedSession.id });
  };

  const getLanguageName = (id: number) => {
    const lang = languages.find((l: Language) => l.id === id);
    return lang?.name || "N/A";
  };

  const getLevelCode = (id: number) => {
    const level = qcerLevels.find((l: QcerLevel) => l.id === id);
    return level?.code || "N/A";
  };

  const getCenterName = (id: number | null) => {
    if (!id) return "Online";
    const center = examCenters.find((c: ExamCenter) => c.id === id);
    return center?.name || "N/A";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const filteredSessions = sessions.filter((session: ExamSession) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestione Esami</h1>
            <p className="text-muted-foreground">Gestisci le sessioni d'esame</p>
          </div>
          <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nuova Sessione
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cerca sessioni..." 
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
            ) : filteredSessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nessuna sessione</h3>
                <p>Le sessioni d'esame create appariranno qui.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sessione</TableHead>
                      <TableHead>Lingua/Livello</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Sede</TableHead>
                      <TableHead>Posti</TableHead>
                      <TableHead>Prezzo</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.map((session: ExamSession) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div className="font-medium">{session.title}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{getLanguageName(session.languageId)}</Badge>
                            <Badge className="bg-blue-600">{getLevelCode(session.qcerLevelId)}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div>{formatDate(session.examDate)}</div>
                              {session.startTime && (
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {session.startTime}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {session.isRemote ? (
                              <Globe className="h-4 w-4 text-green-600" />
                            ) : (
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span>{getCenterName(session.examCenterId)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{session.currentParticipants || 0}/{session.maxParticipants || 30}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {session.price ? (
                            <div className="flex items-center gap-1">
                              <Euro className="h-4 w-4 text-muted-foreground" />
                              {session.price}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={session.status ? (statusLabels[session.status]?.color || "bg-gray-600") : "bg-gray-600"}>
                            {session.status ? (statusLabels[session.status]?.label || session.status) : "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(session)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => { setSelectedSession(session); setIsDeleteDialogOpen(true); }}
                              disabled={session.status === "cancelled"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Crea Nuova Sessione */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuova Sessione d'Esame</DialogTitle>
            <DialogDescription>
              Crea una nuova sessione d'esame
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titolo Sessione *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Sessione Inglese B2 - Marzo 2026"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lingua *</Label>
                <Select 
                  value={formData.languageId.toString()} 
                  onValueChange={(v) => setFormData({ ...formData, languageId: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona lingua" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang: Language) => (
                      <SelectItem key={lang.id} value={lang.id.toString()}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Livello QCER *</Label>
                <Select 
                  value={formData.qcerLevelId.toString()} 
                  onValueChange={(v) => setFormData({ ...formData, qcerLevelId: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona livello" />
                  </SelectTrigger>
                  <SelectContent>
                    {qcerLevels.map((level: QcerLevel) => (
                      <SelectItem key={level.id} value={level.id.toString()}>
                        {level.code} - {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examDate">Data Esame *</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Ora Inizio</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sede d'Esame</Label>
                <Select 
                  value={formData.examCenterId.toString()} 
                  onValueChange={(v) => setFormData({ ...formData, examCenterId: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona sede" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Online (Remoto)</SelectItem>
                    {examCenters.map((center: ExamCenter) => (
                      <SelectItem key={center.id} value={center.id.toString()}>
                        {center.name} - {center.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="isRemote"
                  checked={formData.isRemote}
                  onCheckedChange={(checked) => setFormData({ ...formData, isRemote: checked })}
                />
                <Label htmlFor="isRemote">Esame Remoto</Label>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Posti Disponibili</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                  min={1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prezzo (€)</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="150.00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Dettagli sulla sessione d'esame..."
                rows={3}
              />
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
                "Crea Sessione"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modifica Sessione */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifica Sessione</DialogTitle>
            <DialogDescription>
              Modifica i dati della sessione selezionata
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Titolo Sessione *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lingua *</Label>
                <Select 
                  value={formData.languageId.toString()} 
                  onValueChange={(v) => setFormData({ ...formData, languageId: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang: Language) => (
                      <SelectItem key={lang.id} value={lang.id.toString()}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Livello QCER *</Label>
                <Select 
                  value={formData.qcerLevelId.toString()} 
                  onValueChange={(v) => setFormData({ ...formData, qcerLevelId: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qcerLevels.map((level: QcerLevel) => (
                      <SelectItem key={level.id} value={level.id.toString()}>
                        {level.code} - {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-examDate">Data Esame *</Label>
                <Input
                  id="edit-examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-startTime">Ora Inizio</Label>
                <Input
                  id="edit-startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sede d'Esame</Label>
                <Select 
                  value={formData.examCenterId.toString()} 
                  onValueChange={(v) => setFormData({ ...formData, examCenterId: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Online (Remoto)</SelectItem>
                    {examCenters.map((center: ExamCenter) => (
                      <SelectItem key={center.id} value={center.id.toString()}>
                        {center.name} - {center.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="edit-isRemote"
                  checked={formData.isRemote}
                  onCheckedChange={(checked) => setFormData({ ...formData, isRemote: checked })}
                />
                <Label htmlFor="edit-isRemote">Esame Remoto</Label>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-maxParticipants">Posti Disponibili</Label>
                <Input
                  id="edit-maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                  min={1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Prezzo (€)</Label>
                <Input
                  id="edit-price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrizione</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
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

      {/* Dialog Conferma Annullamento */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma Annullamento</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler annullare la sessione "{selectedSession?.title}"? 
              I candidati iscritti verranno notificati dell'annullamento.
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
                  Annullamento...
                </>
              ) : (
                "Annulla Sessione"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
