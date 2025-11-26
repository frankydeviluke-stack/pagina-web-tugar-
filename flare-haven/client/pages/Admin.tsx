import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookings } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Trash2,
  Lock,
  LogOut,
  Settings,
  Image as ImageIcon,
  Save,
  PlayCircle,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn, formatCurrency } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminView() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    bookings,
    removeBooking,
    updateBookingStatus,
    config,
    updateConfig,
  } = useBookings();
  const { toast } = useToast();

  // Login State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Config State (Local state for form)
  const [localConfig, setLocalConfig] = useState(config);

  // Media Upload State
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaType, setNewMediaType] = useState<"image" | "video">("image");
  const [newMediaCaption, setNewMediaCaption] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "199107747" && password === "Kheslaonda") {
      setIsAuthenticated(true);
      setLocalConfig(config); // Sync config on login
      toast({ title: "Bienvenido Administrador" });
    } else {
      toast({
        title: "Error de acceso",
        description: "Usuario o contraseña incorrectos",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta reserva?")) {
      removeBooking(id);
      toast({ title: "Reserva eliminada" });
    }
  };

  const handleStatusChange = (
    id: string,
    newStatus: "pendiente" | "confirmado"
  ) => {
    updateBookingStatus(id, newStatus);
    toast({
      title: "Estado actualizado",
      description: `La reserva ahora está ${newStatus}`,
    });
  };

  const handleSaveConfig = () => {
    updateConfig(localConfig);
    toast({
      title: "Configuración guardada",
      description: "Los cambios son visibles inmediatamente.",
    });
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isHero: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isHero) {
          setLocalConfig((prev) => ({
            ...prev,
            heroImage: reader.result as string,
          }));
        } else {
          // Upload to gallery
          addMediaToGallery(reader.result as string, "image");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addMediaToGallery = (url: string, type: "image" | "video") => {
    const currentImages = localConfig.gallery.filter((m) => m.type === "image");
    const currentVideos = localConfig.gallery.filter((m) => m.type === "video");

    if (type === "image" && currentImages.length >= 20) {
      toast({
        title: "Límite alcanzado",
        description: "Máximo 20 imágenes permitidas.",
        variant: "destructive",
      });
      return;
    }
    if (type === "video" && currentVideos.length >= 5) {
      toast({
        title: "Límite alcanzado",
        description: "Máximo 5 videos permitidos.",
        variant: "destructive",
      });
      return;
    }

    const newItem = {
      id: Math.random().toString(36).substring(7),
      type,
      url,
      caption: type === "image" ? newMediaCaption : undefined,
    };

    setLocalConfig((prev) => ({
      ...prev,
      gallery: [...prev.gallery, newItem],
    }));
    setNewMediaUrl("");
    setNewMediaCaption("");
    toast({
      title: "Elemento agregado",
      description: "No olvides guardar los cambios.",
    });
  };

  const removeMedia = (id: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((item) => item.id !== id),
    }));
  };

  const updateMediaCaption = (id: string, caption: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      gallery: prev.gallery.map((item) =>
        item.id === id ? { ...item, caption } : item
      ),
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary animate-in zoom-in duration-300">
          <CardHeader className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Acceso Administrativo</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Ingresar
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <Button
              variant="link"
              className="text-muted-foreground"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-6 rounded-xl border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Panel de Administración
            </h1>
            <p className="text-muted-foreground">
              Gestiona reservas y contenido del sitio
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
            >
              Ver sitio como cliente
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAuthenticated(false);
                setUsername("");
                setPassword("");
              }}
            >
              <LogOut className="w-4 h-4 mr-2" /> Salir
            </Button>
          </div>
        </div>

        <Tabs defaultValue="reservas" className="space-y-6">
          <TabsList className="grid w-full max-w-[800px] grid-cols-4">
            <TabsTrigger value="reservas">Reservas</TabsTrigger>
            <TabsTrigger value="config">Configuración</TabsTrigger>
            <TabsTrigger value="gallery">Galería Multimedia</TabsTrigger>
            <TabsTrigger value="transferencias">Transferencias</TabsTrigger>
          </TabsList>

          {/* TAB RESERVAS */}
          <TabsContent
            value="reservas"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4"
          >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Reservas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Ingresos Estimados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      bookings.reduce((acc, curr) => acc + curr.total, 0)
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Días Ocupados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {bookings.length}/30
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Listado de Reservas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {bookings.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No hay reservas registradas aún.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Día</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Contacto</TableHead>
                          <TableHead>Personas</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings
                          .sort((a, b) => a.dia - b.dia)
                          .map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                  {booking.dia}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {booking.nombre}
                              </TableCell>
                              <TableCell>{booking.celular}</TableCell>
                              <TableCell>{booking.personas}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className={cn(
                                        "h-8 px-3 rounded-full text-xs font-medium border border-transparent hover:border-border",
                                        booking.status === "confirmado"
                                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                      )}
                                    >
                                      {booking.status === "confirmado" ? (
                                        <>
                                          <CheckCircle2 className="w-3 h-3 mr-1.5" />
                                          Confirmado
                                        </>
                                      ) : (
                                        <>
                                          <AlertCircle className="w-3 h-3 mr-1.5" />
                                          Pendiente
                                        </>
                                      )}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(
                                          booking.id,
                                          "pendiente"
                                        )
                                      }
                                    >
                                      Marcar como Pendiente
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(
                                          booking.id,
                                          "confirmado"
                                        )
                                      }
                                    >
                                      Marcar como Confirmado
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {formatCurrency(booking.total)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDelete(booking.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB CONFIG */}
          <TabsContent
            value="config"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" /> Información General
                  </CardTitle>
                  <CardDescription>
                    Personaliza los textos principales del sitio.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre del Sitio</Label>
                    <Input
                      value={localConfig.title}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea
                      value={localConfig.description}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Precio Base ($)</Label>
                      <Input
                        type="number"
                        value={localConfig.priceBase}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            priceBase: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Precio Extra p/p ($)</Label>
                      <Input
                        type="number"
                        value={localConfig.priceExtra}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            priceExtra: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" /> Hero Imagen
                  </CardTitle>
                  <CardDescription>
                    Actualiza la imagen principal.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden border relative group">
                    <img
                      src={localConfig.heroImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">
                        Vista Previa
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>URL de la imagen</Label>
                    <Input
                      value={localConfig.heroImage}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          heroImage: e.target.value,
                        })
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        O subir archivo local
                      </span>
                    </div>
                  </div>

                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nota: Al subir un archivo, este se convierte a Base64 para
                    la demo.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button size="lg" onClick={handleSaveConfig} className="gap-2">
                <Save className="w-4 h-4" /> Guardar Cambios
              </Button>
            </div>
          </TabsContent>

          {/* TAB GALLERY */}
          <TabsContent
            value="gallery"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Gestión de Galería
                </CardTitle>
                <CardDescription>
                  Sube fotos (máx 20) para mostrar en la vista de cliente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Add Media Form */}
                <div className="p-4 bg-muted/30 rounded-xl border space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Agregar Nuevo Elemento
                  </h3>
                  <div className="grid md:grid-cols-[1fr_200px_auto] gap-4 items-end">
                    <div className="space-y-2">
                      <Label>URL del recurso</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://ejemplo.com/foto.jpg"
                          value={newMediaUrl}
                          onChange={(e) => setNewMediaUrl(e.target.value)}
                        />
                        {newMediaType === "image" && (
                          <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            onClick={() => document.getElementById("file-upload-image")?.click()}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                        <input
                          id="file-upload-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, false)}
                        />
                      </div>
                    </div>

                    {newMediaType === "image" && (
                      <div className="space-y-2">
                        <Label>Leyenda (opcional)</Label>
                        <Input
                          placeholder="Ej: Salón Principal"
                          value={newMediaCaption}
                          onChange={(e) => setNewMediaCaption(e.target.value)}
                        />
                      </div>
                    )}

                    <Button
                      onClick={() => {
                        if (!newMediaUrl) return;
                        addMediaToGallery(newMediaUrl, "image");
                      }}
                      disabled={!newMediaUrl}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>

                {/* Gallery Lists */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Imágenes (
                        {
                          localConfig.gallery.filter((m) => m.type === "image")
                            .length
                        }
                        /20)
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {localConfig.gallery
                        .filter((m) => m.type === "image")
                        .map((item) => (
                          <div key={item.id} className="space-y-2">
                            <div className="aspect-square rounded-lg overflow-hidden relative group border bg-muted">
                              <img
                                src={item.url}
                                className="w-full h-full object-cover"
                                alt="Gallery item"
                              />
                              <button
                                onClick={() => removeMedia(item.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Leyenda</Label>
                              <Input
                                value={item.caption || ""}
                                onChange={(e) => updateMediaCaption(item.id, e.target.value)}
                                placeholder="Ingresa una leyenda"
                                className="text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      {localConfig.gallery.filter((m) => m.type === "image")
                        .length === 0 && (
                        <div className="col-span-full text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border-dashed border">
                          Sin imágenes
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    size="lg"
                    onClick={handleSaveConfig}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" /> Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB TRANSFERENCIAS */}
          <TabsContent
            value="transferencias"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💳 Información de Transferencia
                </CardTitle>
                <CardDescription>
                  Configura los datos de tu cuenta bancaria para las
                  transferencias de los clientes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>RUT</Label>
                    <Input
                      value={localConfig.transferInfo.rut}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          transferInfo: {
                            ...localConfig.transferInfo,
                            rut: e.target.value,
                          },
                        })
                      }
                      placeholder="12.345.678-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      value={localConfig.transferInfo.nombre}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          transferInfo: {
                            ...localConfig.transferInfo,
                            nombre: e.target.value,
                          },
                        })
                      }
                      placeholder="Nombre del titular"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Banco</Label>
                    <Input
                      value={localConfig.transferInfo.banco}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          transferInfo: {
                            ...localConfig.transferInfo,
                            banco: e.target.value,
                          },
                        })
                      }
                      placeholder="Ej: Banco del Estado"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Cuenta</Label>
                    <Input
                      value={localConfig.transferInfo.tipoCuenta}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          transferInfo: {
                            ...localConfig.transferInfo,
                            tipoCuenta: e.target.value,
                          },
                        })
                      }
                      placeholder="Ej: Cuenta Corriente"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Número de Cuenta</Label>
                    <Input
                      value={localConfig.transferInfo.numeroCuenta}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          transferInfo: {
                            ...localConfig.transferInfo,
                            numeroCuenta: e.target.value,
                          },
                        })
                      }
                      placeholder="Ej: 1234567890"
                    />
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                  <p className="text-sm text-blue-300">
                    ℹ️ Estos datos se mostrarán a los clientes cuando hagan
                    click en el botón "Reservar Ahora", en una ventana modal
                    con toda la información de transferencia.
                  </p>
                </div>
              </CardContent>
              <div className="flex justify-end p-6 border-t">
                <Button size="lg" onClick={handleSaveConfig} className="gap-2">
                  <Save className="w-4 h-4" /> Guardar Cambios
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
