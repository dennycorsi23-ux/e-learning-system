import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff,
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  Calendar,
  Award,
  Settings,
  Menu as MenuIcon,
  FileText,
  TrendingUp,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  type LucideIcon
} from "lucide-react";

// Available icons
const availableIcons: { name: string; icon: LucideIcon }[] = [
  { name: "LayoutDashboard", icon: LayoutDashboard },
  { name: "Users", icon: Users },
  { name: "Building2", icon: Building2 },
  { name: "BookOpen", icon: BookOpen },
  { name: "Calendar", icon: Calendar },
  { name: "Award", icon: Award },
  { name: "Settings", icon: Settings },
  { name: "Menu", icon: MenuIcon },
  { name: "FileText", icon: FileText },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "HelpCircle", icon: HelpCircle },
];

const iconMap: Record<string, LucideIcon> = Object.fromEntries(
  availableIcons.map(i => [i.name, i.icon])
);

type MenuItem = {
  id: number;
  label: string;
  path: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  requiredRole: "admin" | "examiner" | "user";
  parentId: number | null;
};

export default function AdminMenu() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    path: "",
    icon: "LayoutDashboard",
    isActive: true,
    requiredRole: "admin" as "admin" | "examiner" | "user",
  });

  const utils = trpc.useUtils();
  const { data: menuItems, isLoading } = trpc.admin.menu.list.useQuery();

  const createMutation = trpc.admin.menu.create.useMutation({
    onSuccess: () => {
      utils.admin.menu.list.invalidate();
      utils.admin.menu.active.invalidate();
      setIsDialogOpen(false);
      resetForm();
      toast.success("Voce menu creata con successo");
    },
    onError: (error) => {
      toast.error("Errore nella creazione: " + error.message);
    },
  });

  const updateMutation = trpc.admin.menu.update.useMutation({
    onSuccess: () => {
      utils.admin.menu.list.invalidate();
      utils.admin.menu.active.invalidate();
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
      toast.success("Voce menu aggiornata con successo");
    },
    onError: (error) => {
      toast.error("Errore nell'aggiornamento: " + error.message);
    },
  });

  const deleteMutation = trpc.admin.menu.delete.useMutation({
    onSuccess: () => {
      utils.admin.menu.list.invalidate();
      utils.admin.menu.active.invalidate();
      toast.success("Voce menu eliminata con successo");
    },
    onError: (error) => {
      toast.error("Errore nell'eliminazione: " + error.message);
    },
  });

  const reorderMutation = trpc.admin.menu.reorder.useMutation({
    onSuccess: () => {
      utils.admin.menu.list.invalidate();
      utils.admin.menu.active.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      label: "",
      path: "",
      icon: "LayoutDashboard",
      isActive: true,
      requiredRole: "admin",
    });
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      path: item.path,
      icon: item.icon,
      isActive: item.isActive,
      requiredRole: item.requiredRole,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.label || !formData.path) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    if (editingItem) {
      updateMutation.mutate({
        id: editingItem.id,
        ...formData,
      });
    } else {
      const maxOrder = menuItems?.reduce((max, item) => Math.max(max, item.sortOrder), 0) ?? 0;
      createMutation.mutate({
        ...formData,
        sortOrder: maxOrder + 1,
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Sei sicuro di voler eliminare questa voce?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleToggleActive = (item: MenuItem) => {
    updateMutation.mutate({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const handleMoveUp = (item: MenuItem, index: number) => {
    if (index === 0 || !menuItems) return;
    const prevItem = menuItems[index - 1];
    reorderMutation.mutate([
      { id: item.id, sortOrder: prevItem.sortOrder },
      { id: prevItem.id, sortOrder: item.sortOrder },
    ]);
  };

  const handleMoveDown = (item: MenuItem, index: number) => {
    if (!menuItems || index === menuItems.length - 1) return;
    const nextItem = menuItems[index + 1];
    reorderMutation.mutate([
      { id: item.id, sortOrder: nextItem.sortOrder },
      { id: nextItem.id, sortOrder: item.sortOrder },
    ]);
  };

  const IconComponent = (iconName: string) => {
    const Icon = iconMap[iconName] || LayoutDashboard;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gestione Menu</h1>
            <p className="text-muted-foreground">Gestisci le voci del menu di navigazione</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Nuova Voce
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Modifica Voce" : "Nuova Voce Menu"}</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Modifica i dettagli della voce di menu" : "Aggiungi una nuova voce al menu di navigazione"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="label">Etichetta *</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="es. Dashboard"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="path">Percorso URL *</Label>
                  <Input
                    id="path"
                    value={formData.path}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    placeholder="es. /admin/dashboard"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="icon">Icona</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData({ ...formData, icon: value })}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {IconComponent(formData.icon)}
                          <span>{formData.icon}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map((iconItem) => (
                        <SelectItem key={iconItem.name} value={iconItem.name}>
                          <div className="flex items-center gap-2">
                            <iconItem.icon className="h-4 w-4" />
                            <span>{iconItem.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Ruolo Richiesto</Label>
                  <Select
                    value={formData.requiredRole}
                    onValueChange={(value: "admin" | "examiner" | "user") => 
                      setFormData({ ...formData, requiredRole: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Amministratore</SelectItem>
                      <SelectItem value="examiner">Esaminatore</SelectItem>
                      <SelectItem value="user">Utente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Attivo</Label>
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingItem ? "Salva Modifiche" : "Crea Voce"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Voci Menu</CardTitle>
            <CardDescription>
              Trascina per riordinare, clicca sull'icona occhio per nascondere/mostrare
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
                ))}
              </div>
            ) : menuItems && menuItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Ordine</TableHead>
                    <TableHead className="w-[50px]">Icona</TableHead>
                    <TableHead>Etichetta</TableHead>
                    <TableHead>Percorso</TableHead>
                    <TableHead>Ruolo</TableHead>
                    <TableHead className="w-[80px]">Stato</TableHead>
                    <TableHead className="w-[150px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item, index) => (
                    <TableRow key={item.id} className={!item.isActive ? "opacity-50" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMoveUp(item as MenuItem, index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMoveDown(item as MenuItem, index)}
                            disabled={index === menuItems.length - 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          {IconComponent(item.icon)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.label}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{item.path}</TableCell>
                      <TableCell>
                        <Badge variant={item.requiredRole === "admin" ? "default" : "secondary"}>
                          {item.requiredRole === "admin" ? "Admin" : 
                           item.requiredRole === "examiner" ? "Esaminatore" : "Utente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(item as MenuItem)}
                        >
                          {item.isActive ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(item as MenuItem)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MenuIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nessuna voce menu configurata</p>
                <p className="text-sm">Clicca "Nuova Voce" per aggiungere la prima</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
