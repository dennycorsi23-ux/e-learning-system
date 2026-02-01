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
import { BookOpen, Search, Plus, Pencil, Trash2, Clock, Euro, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type Course = {
  id: number;
  languageId: number;
  qcerLevelId: number;
  title: string;
  description: string | null;
  objectives: string | null;
  duration: number | null;
  price: string | null;
  isActive: boolean | null;
};

type Language = {
  id: number;
  code: string;
  name: string;
  nativeName: string | null;
};

type QcerLevel = {
  id: number;
  code: string;
  name: string;
};

export default function AdminCorsi() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const [formData, setFormData] = useState({
    languageId: 0,
    qcerLevelId: 0,
    title: "",
    description: "",
    objectives: "",
    duration: 40,
    price: "299.00",
    isActive: true,
  });

  const utils = trpc.useUtils();
  
  const { data: courses = [], isLoading } = trpc.courses.listAll.useQuery();
  const { data: languages = [] } = trpc.languages.list.useQuery();
  const { data: qcerLevels = [] } = trpc.qcerLevels.list.useQuery();
  
  const createMutation = trpc.courses.create.useMutation({
    onSuccess: () => {
      toast.success("Corso creato con successo");
      setIsCreateDialogOpen(false);
      resetForm();
      utils.courses.listAll.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nella creazione: " + error.message);
    },
  });

  const updateMutation = trpc.courses.update.useMutation({
    onSuccess: () => {
      toast.success("Corso aggiornato con successo");
      setIsEditDialogOpen(false);
      setSelectedCourse(null);
      utils.courses.listAll.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nell'aggiornamento: " + error.message);
    },
  });

  const deleteMutation = trpc.courses.delete.useMutation({
    onSuccess: () => {
      toast.success("Corso eliminato con successo");
      setIsDeleteDialogOpen(false);
      setSelectedCourse(null);
      utils.courses.listAll.invalidate();
    },
    onError: (error) => {
      toast.error("Errore nell'eliminazione: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      languageId: 0,
      qcerLevelId: 0,
      title: "",
      description: "",
      objectives: "",
      duration: 40,
      price: "299.00",
      isActive: true,
    });
  };

  const handleCreate = () => {
    if (!formData.title || !formData.languageId || !formData.qcerLevelId) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    createMutation.mutate({
      languageId: formData.languageId,
      qcerLevelId: formData.qcerLevelId,
      title: formData.title,
      description: formData.description || undefined,
      objectives: formData.objectives || undefined,
      duration: formData.duration,
      price: formData.price || undefined,
      isActive: formData.isActive,
    });
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      languageId: course.languageId,
      qcerLevelId: course.qcerLevelId,
      title: course.title,
      description: course.description || "",
      objectives: course.objectives || "",
      duration: course.duration || 40,
      price: course.price || "299.00",
      isActive: course.isActive ?? true,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedCourse) return;
    if (!formData.title || !formData.languageId || !formData.qcerLevelId) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    updateMutation.mutate({
      id: selectedCourse.id,
      languageId: formData.languageId,
      qcerLevelId: formData.qcerLevelId,
      title: formData.title,
      description: formData.description || undefined,
      objectives: formData.objectives || undefined,
      duration: formData.duration,
      price: formData.price || undefined,
      isActive: formData.isActive,
    });
  };

  const handleDelete = () => {
    if (!selectedCourse) return;
    deleteMutation.mutate({ id: selectedCourse.id });
  };

  const getLanguageName = (id: number) => {
    const lang = languages.find((l: Language) => l.id === id);
    return lang?.name || "N/A";
  };

  const getLevelCode = (id: number) => {
    const level = qcerLevels.find((l: QcerLevel) => l.id === id);
    return level?.code || "N/A";
  };

  const filteredCourses = courses.filter((course: Course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestione Corsi</h1>
            <p className="text-muted-foreground">Gestisci i corsi di preparazione</p>
          </div>
          <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nuovo Corso
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cerca corsi..." 
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
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nessun corso</h3>
                <p>I corsi creati appariranno qui.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course: Course) => (
                  <Card key={course.id} className={`relative ${!course.isActive ? 'opacity-60' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{getLanguageName(course.languageId)}</Badge>
                            <Badge className="bg-blue-600">{getLevelCode(course.qcerLevelId)}</Badge>
                            {!course.isActive && <Badge variant="secondary">Inattivo</Badge>}
                          </div>
                          <h3 className="font-semibold">{course.title}</h3>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(course)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => { setSelectedCourse(course); setIsDeleteDialogOpen(true); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {course.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {course.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {course.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}h</span>
                          </div>
                        )}
                        {course.price && (
                          <div className="flex items-center gap-1">
                            <Euro className="h-4 w-4" />
                            <span>{course.price}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Crea Nuovo Corso */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuovo Corso</DialogTitle>
            <DialogDescription>
              Inserisci i dati del nuovo corso di preparazione
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="title">Titolo Corso *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Corso di Inglese B2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrizione del corso..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objectives">Obiettivi</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                placeholder="Obiettivi formativi del corso..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Durata (ore)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  min={1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prezzo (€)</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="299.00"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Attivo</Label>
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
                "Crea Corso"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modifica Corso */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifica Corso</DialogTitle>
            <DialogDescription>
              Modifica i dati del corso selezionato
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="edit-title">Titolo Corso *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
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
            
            <div className="space-y-2">
              <Label htmlFor="edit-objectives">Obiettivi</Label>
              <Textarea
                id="edit-objectives"
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Durata (ore)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
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
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="edit-isActive">Attivo</Label>
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
              Sei sicuro di voler eliminare il corso "{selectedCourse?.title}"? 
              Questa azione disattiverà il corso ma non eliminerà i dati storici.
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
