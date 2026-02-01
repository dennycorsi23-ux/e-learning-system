import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Plus, Search, MoreVertical, Calendar, Users, MapPin, 
  Edit, Trash2, CheckCircle, XCircle, Upload, Download,
  Clock, User, FileText, Eye, Lock, Unlock, AlertCircle
} from "lucide-react";

type SessionStatus = 'draft' | 'open' | 'confirmed' | 'ongoing' | 'completed' | 'approved' | 'cancelled';

interface ExamSession {
  id: number;
  requestNumber?: string | null;
  title: string;
  examDate: Date | string;
  startTime?: string | null;
  endTime?: string | null;
  languageId: number;
  qcerLevelId: number;
  examCenterId?: number | null;
  examinerId?: number | null;
  maxParticipants: number;
  currentParticipants: number;
  price?: string | number | null;
  isRemote: boolean;
  status: SessionStatus;
  zipPassword?: string | null;
  description?: string | null;
}

const statusConfig: Record<SessionStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Bozza", color: "bg-gray-100 text-gray-700 border-gray-300", icon: <Edit className="h-3 w-3" /> },
  open: { label: "Aperta", color: "bg-blue-100 text-blue-700 border-blue-300", icon: <Unlock className="h-3 w-3" /> },
  confirmed: { label: "Confermata", color: "bg-indigo-100 text-indigo-700 border-indigo-300", icon: <CheckCircle className="h-3 w-3" /> },
  ongoing: { label: "In Corso", color: "bg-yellow-100 text-yellow-700 border-yellow-300", icon: <Clock className="h-3 w-3" /> },
  completed: { label: "Completata", color: "bg-orange-100 text-orange-700 border-orange-300", icon: <FileText className="h-3 w-3" /> },
  approved: { label: "Approvata", color: "bg-green-100 text-green-700 border-green-300", icon: <CheckCircle className="h-3 w-3" /> },
  cancelled: { label: "Annullata", color: "bg-red-100 text-red-700 border-red-300", icon: <XCircle className="h-3 w-3" /> },
};

export default function AdminSessioni() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ExamSession | null>(null);
  const [uploadSessionId, setUploadSessionId] = useState<number | null>(null);

  const { data: sessions = [], refetch } = trpc.admin.examSessions.list.useQuery();
  const { data: languages = [] } = trpc.languages.list.useQuery();
  const { data: levels = [] } = trpc.qcerLevels.list.useQuery();
  const { data: centers = [] } = trpc.examCenters.list.useQuery();
  const { data: examiners = [] } = trpc.admin.examSessions.getExaminers.useQuery();

  const createMutation = trpc.admin.examSessions.create.useMutation({
    onSuccess: () => {
      toast.success("Sessione creata");
      setIsCreateOpen(false);
      refetch();
    },
    onError: (err: any) => toast.error(err.message || "Errore"),
  });

  const updateMutation = trpc.admin.examSessions.update.useMutation({
    onSuccess: () => {
      toast.success("Sessione aggiornata");
      setEditingSession(null);
      refetch();
    },
    onError: (err: any) => toast.error(err.message || "Errore"),
  });

  const updateStatusMutation = trpc.admin.examSessions.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Stato aggiornato");
      refetch();
    },
    onError: (err: any) => toast.error(err.message || "Errore"),
  });

  const deleteMutation = trpc.admin.examSessions.delete.useMutation({
    onSuccess: () => {
      toast.success("Sessione eliminata");
      refetch();
    },
    onError: (err: any) => toast.error(err.message || "Errore"),
  });

  const filteredSessions = (sessions as ExamSession[]).filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.requestNumber?.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getLanguageName = (id: number) => (languages as any[]).find((l) => l.id === id)?.nameIt || "N/A";
  const getLevelName = (id: number) => (levels as any[]).find((l) => l.id === id)?.code || "N/A";
  const getCenterName = (id?: number | null) => id ? (centers as any[]).find((c) => c.id === id)?.name || "N/A" : "Online";
  const getExaminerName = (id?: number | null) => id ? (examiners as any[]).find((e) => e.id === id)?.name || "N/A" : "Non assegnato";

  const handleStatusChange = (sessionId: number, newStatus: SessionStatus) => {
    updateStatusMutation.mutate({ id: sessionId, status: newStatus });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sessioni d'Esame</h1>
            <p className="text-muted-foreground">Gestisci le sessioni d'esame e il loro stato</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuova Sessione
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crea Nuova Sessione</DialogTitle>
              </DialogHeader>
              <SessionForm
                languages={languages as any[]}
                levels={levels as any[]}
                centers={centers as any[]}
                examiners={examiners as any[]}
                onSubmit={(data) => createMutation.mutate(data)}
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca per titolo o numero richiesta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtra per stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = (sessions as ExamSession[]).filter((s) => s.status === status).length;
            return (
              <Card 
                key={status} 
                className={`cursor-pointer transition-all hover:shadow-md ${statusFilter === status ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
              >
                <CardContent className="p-3 text-center">
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${config.color} mb-2`}>
                    {config.icon}
                  </div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sessions Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              getLanguageName={getLanguageName}
              getLevelName={getLevelName}
              getCenterName={getCenterName}
              getExaminerName={getExaminerName}
              onEdit={() => setEditingSession(session)}
              onDelete={() => deleteMutation.mutate({ id: session.id })}
              onStatusChange={handleStatusChange}
              onUpload={() => setUploadSessionId(session.id)}
            />
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nessuna sessione trovata</h3>
            <p className="text-muted-foreground">Crea una nuova sessione per iniziare</p>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingSession} onOpenChange={(open) => !open && setEditingSession(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifica Sessione</DialogTitle>
            </DialogHeader>
            {editingSession && (
              <SessionForm
                session={editingSession}
                languages={languages as any[]}
                levels={levels as any[]}
                centers={centers as any[]}
                examiners={examiners as any[]}
                onSubmit={(data) => updateMutation.mutate({ id: editingSession.id, ...data })}
                isLoading={updateMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Upload Dialog */}
        <Dialog open={!!uploadSessionId} onOpenChange={(open) => !open && setUploadSessionId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Carica Documenti</DialogTitle>
            </DialogHeader>
            <UploadDocuments 
              sessionId={uploadSessionId!} 
              onClose={() => setUploadSessionId(null)}
              onSuccess={() => {
                setUploadSessionId(null);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

// Session Card Component
function SessionCard({
  session,
  getLanguageName,
  getLevelName,
  getCenterName,
  getExaminerName,
  onEdit,
  onDelete,
  onStatusChange,
  onUpload,
}: {
  session: ExamSession;
  getLanguageName: (id: number) => string;
  getLevelName: (id: number) => string;
  getCenterName: (id?: number | null) => string;
  getExaminerName: (id?: number | null) => string;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (id: number, status: SessionStatus) => void;
  onUpload: () => void;
}) {
  const status = statusConfig[session.status] || statusConfig.draft;
  const examDate = new Date(session.examDate);
  const isEditable = session.status === 'draft' || session.status === 'open';

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={status.color}>
                {status.icon}
                <span className="ml-1">{status.label}</span>
              </Badge>
              {session.isRemote && (
                <Badge variant="secondary" className="text-xs">Online</Badge>
              )}
            </div>
            <CardTitle className="text-lg">{session.title}</CardTitle>
            {session.requestNumber && (
              <p className="text-sm text-muted-foreground font-mono">#{session.requestNumber}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isEditable && (
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifica
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => {}}>
                <Eye className="h-4 w-4 mr-2" />
                Visualizza Dettagli
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {session.status === 'draft' && (
                <DropdownMenuItem onClick={() => onStatusChange(session.id, 'open')}>
                  <Unlock className="h-4 w-4 mr-2" />
                  Apri Iscrizioni
                </DropdownMenuItem>
              )}
              {session.status === 'open' && (
                <DropdownMenuItem onClick={() => onStatusChange(session.id, 'confirmed')}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Conferma Sessione
                </DropdownMenuItem>
              )}
              {session.status === 'confirmed' && (
                <DropdownMenuItem onClick={() => onStatusChange(session.id, 'ongoing')}>
                  <Clock className="h-4 w-4 mr-2" />
                  Avvia Esame
                </DropdownMenuItem>
              )}
              {session.status === 'ongoing' && (
                <DropdownMenuItem onClick={() => onStatusChange(session.id, 'completed')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Completa Esame
                </DropdownMenuItem>
              )}
              {session.status === 'completed' && (
                <>
                  <DropdownMenuItem onClick={onUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Carica Documenti
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(session.id, 'approved')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approva e Genera ZIP
                  </DropdownMenuItem>
                </>
              )}
              {session.status === 'approved' && session.zipPassword && (
                <DropdownMenuItem onClick={() => {}}>
                  <Download className="h-4 w-4 mr-2" />
                  Scarica ZIP (pwd: {session.zipPassword})
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {session.status !== 'cancelled' && session.status !== 'approved' && (
                <DropdownMenuItem 
                  onClick={() => onStatusChange(session.id, 'cancelled')}
                  className="text-red-600"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Annulla Sessione
                </DropdownMenuItem>
              )}
              {session.status === 'draft' && (
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Elimina
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{examDate.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{session.startTime || '09:00'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{getCenterName(session.examCenterId)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{session.currentParticipants}/{session.maxParticipants}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{getLanguageName(session.languageId)}</Badge>
            <Badge variant="secondary">{getLevelName(session.qcerLevelId)}</Badge>
          </div>
          {session.price && (
            <span className="font-semibold text-primary">€{session.price}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Esaminatore: {getExaminerName(session.examinerId)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Session Form Component
function SessionForm({
  session,
  languages,
  levels,
  centers,
  examiners,
  onSubmit,
  isLoading,
}: {
  session?: ExamSession;
  languages: any[];
  levels: any[];
  centers: any[];
  examiners: any[];
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    title: session?.title || "",
    description: session?.description || "",
    languageId: session?.languageId || 1,
    qcerLevelId: session?.qcerLevelId || 1,
    examCenterId: session?.examCenterId || undefined,
    examinerId: session?.examinerId || undefined,
    examDate: session?.examDate ? new Date(session.examDate).toISOString().split('T')[0] : "",
    startTime: session?.startTime || "09:00",
    endTime: session?.endTime || "13:00",
    maxParticipants: session?.maxParticipants || 30,
    price: session?.price || 150,
    isRemote: session?.isRemote || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="title">Titolo Sessione</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Es: Sessione Inglese B2 - Febbraio 2026"
            required
          />
        </div>
        <div>
          <Label htmlFor="languageId">Lingua</Label>
          <Select 
            value={String(formData.languageId)} 
            onValueChange={(v) => setFormData({ ...formData, languageId: Number(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={String(lang.id)}>{lang.nameIt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="qcerLevelId">Livello QCER</Label>
          <Select 
            value={String(formData.qcerLevelId)} 
            onValueChange={(v) => setFormData({ ...formData, qcerLevelId: Number(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level.id} value={String(level.id)}>{level.code} - {level.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="examDate">Data Esame</Label>
          <Input
            id="examDate"
            type="date"
            value={formData.examDate}
            onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="startTime">Ora Inizio</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="endTime">Ora Fine</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="examCenterId">Sede d'Esame</Label>
          <Select 
            value={formData.examCenterId ? String(formData.examCenterId) : "online"} 
            onValueChange={(v) => setFormData({ ...formData, examCenterId: v === "online" ? undefined : Number(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              {centers.map((center) => (
                <SelectItem key={center.id} value={String(center.id)}>{center.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="examinerId">Esaminatore</Label>
          <Select 
            value={formData.examinerId ? String(formData.examinerId) : "none"} 
            onValueChange={(v) => setFormData({ ...formData, examinerId: v === "none" ? undefined : Number(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Non assegnato</SelectItem>
              {examiners.map((examiner) => (
                <SelectItem key={examiner.id} value={String(examiner.id)}>{examiner.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="maxParticipants">Posti Disponibili</Label>
          <Input
            id="maxParticipants"
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
            min={1}
          />
        </div>
        <div>
          <Label htmlFor="price">Prezzo (€)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            min={0}
            step={0.01}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="description">Descrizione</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descrizione opzionale della sessione..."
            rows={3}
          />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <Switch
            id="isRemote"
            checked={formData.isRemote}
            onCheckedChange={(checked) => setFormData({ ...formData, isRemote: checked })}
          />
          <Label htmlFor="isRemote">Sessione Online (Remota)</Label>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvataggio..." : session ? "Salva Modifiche" : "Crea Sessione"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Upload Documents Component
function UploadDocuments({
  sessionId,
  onClose,
  onSuccess,
}: {
  sessionId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const { data: documents = [], refetch } = trpc.admin.examSessions.getDocuments.useQuery({ sessionId });
  
  const uploadMutation = trpc.admin.examSessions.uploadDocument.useMutation({
    onSuccess: () => {
      toast.success("Documento caricato");
      refetch();
    },
    onError: (err: any) => toast.error(err.message || "Errore"),
  });

  const deleteMutation = trpc.admin.examSessions.deleteDocument.useMutation({
    onSuccess: () => {
      toast.success("Documento eliminato");
      refetch();
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      // Per ora simulo l'upload - in produzione useresti Cloudinary
      const fakeUrl = `https://res.cloudinary.com/dcmuk6nnl/raw/upload/v${Date.now()}/${file.name}`;
      await uploadMutation.mutateAsync({
        sessionId,
        fileName: file.name,
        fileUrl: fakeUrl,
        fileType: file.type,
        fileSize: file.size,
      });
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-2">
          Trascina i file qui o clicca per selezionare
        </p>
        <Input
          type="file"
          multiple
          onChange={handleFileUpload}
          disabled={uploading}
          className="max-w-xs mx-auto"
        />
      </div>

      {(documents as any[]).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Documenti Caricati</h4>
          {(documents as any[]).map((doc: any) => (
            <div key={doc.id} className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{doc.fileName}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteMutation.mutate({ id: doc.id })}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Chiudi</Button>
        <Button onClick={onSuccess}>Fatto</Button>
      </DialogFooter>
    </div>
  );
}
