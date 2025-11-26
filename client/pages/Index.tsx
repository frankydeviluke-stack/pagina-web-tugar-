import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBookings } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Users, Phone, User, ArrowRight, LogIn, Play } from "lucide-react";
import CalendarComponent from "@/components/calendar";
import TransferModal from "@/components/transfer-modal";

export default function Index() {
  const navigate = useNavigate();
  const { config, addBooking, isDayBlocked, bookings } = useBookings();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    nombre: "",
    celular: "",
    personas: "20",
    dia: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showTransferModal, setShowTransferModal] = useState(false);
  const whatsappNumber = "934423169";

  // Get available days (1-30)
  const availableDays = Array.from({ length: 30 }, (_, i) => i + 1).filter(
    (day) => !isDayBlocked(day)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.celular ||
      !formData.personas ||
      !formData.dia
    ) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const personas = Number(formData.personas);
    const total = config.priceBase + (personas - 20) * config.priceExtra;

    addBooking({
      nombre: formData.nombre,
      celular: formData.celular,
      personas,
      dia: Number(formData.dia),
      status: "pendiente",
      total,
    });

    setShowTransferModal(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const personas = Number(formData.personas);
  const totalPrice =
    config.priceBase + (personas - 20) * config.priceExtra;

  const images = config.gallery.filter((item) => item.type === "image");
  const videos = config.gallery.filter((item) => item.type === "video");

  // Reset form when modal closes
  useEffect(() => {
    if (!showTransferModal) {
      setFormData({
        nombre: "",
        celular: "",
        personas: "20",
        dia: "",
      });
    }
  }, [showTransferModal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {config.title}
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin")}
            className="gap-2 border-slate-600 hover:bg-slate-800"
          >
            <LogIn className="w-4 h-4" />
            Admin
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${config.heroImage})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-900/95" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  {config.title}
                </h2>
                <p className="text-xl text-slate-300">{config.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 backdrop-blur p-4 rounded-lg border border-slate-700">
                  <p className="text-slate-400 text-sm mb-2">Precio Base</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {formatCurrency(config.priceBase)}
                  </p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur p-4 rounded-lg border border-slate-700">
                  <p className="text-slate-400 text-sm mb-2">Por persona extra</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {formatCurrency(config.priceExtra)}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/30 backdrop-blur p-4 rounded-lg border border-slate-700">
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="text-blue-400 font-semibold">Tarifa:</span> {formatCurrency(config.priceBase)} para 40 personas. Cada persona adicional: {formatCurrency(config.priceExtra)}
                </p>
                <p className="text-slate-300 text-sm mt-2">
                  <span className="text-green-400 font-semibold">Horario:</span> 10:00 AM a 8:00 PM
                </p>
              </div>

              {/* Ubicación y QR */}
              <div className="flex gap-6 mt-6 flex-wrap">
                <div className="bg-slate-800/30 backdrop-blur p-4 rounded-lg border border-slate-700">
                  <p className="text-slate-400 text-sm mb-2 font-semibold">📍 Ubicación</p>
                  <p className="text-slate-300 text-sm mb-3">
                    Los Carrera 5142, Copiapó
                  </p>
                  <a
                    href="https://share.google/UCjBINxZBT0Cn0Mg0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-semibold"
                  >
                    Ver en Maps
                  </a>
                </div>

                <a
                  href="https://www.instagram.com/tugartugarcopiapo?utm_source=qr&igsh=ZHRxazJoeHNpamVv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3"
                >
                  <div className="bg-white p-2 rounded-lg border border-slate-700">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2Fbdd9acef6a184db0b2733a0aa6bac25d%2Fab6f839ab3144c79a4099520c2bb4455?format=webp&width=800"
                      alt="Instagram QR"
                      className="w-32 h-32"
                    />
                  </div>
                  <p className="text-slate-300 text-xs text-center max-w-[140px]">
                    Sígueme y participa por premios y promociones
                  </p>
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                <img
                  src={config.heroImage}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                Reserva tu fecha
              </CardTitle>
              <p className="text-slate-400">
                Completa el formulario para hacer tu reserva
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre Completo
                  </Label>
                  <Input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Juan Pérez"
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Número de Celular
                  </Label>
                  <Input
                    name="celular"
                    value={formData.celular}
                    onChange={handleInputChange}
                    placeholder="912345678"
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Número de Personas
                  </Label>
                  <Input
                    type="number"
                    name="personas"
                    value={formData.personas}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Convertir a número y limitar a 100
                      if (value === "") {
                        value = "";
                      } else {
                        const num = Math.min(Math.max(parseInt(value) || 0, 1), 100);
                        value = num.toString();
                      }
                      handleInputChange({
                        ...e,
                        target: { ...e.target, name: "personas", value },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    placeholder="20"
                    min="1"
                    max="100"
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <p className="text-xs text-slate-400">Mínimo 1, máximo 100 personas</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Selecciona un día
                  </Label>
                  <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                    <CalendarComponent
                      selectedDay={formData.dia ? Number(formData.dia) : null}
                      onSelectDay={(day) =>
                        setFormData((prev) => ({ ...prev, dia: day.toString() }))
                      }
                      blockedDays={bookings.map((b) => b.dia)}
                      currentMonth={currentMonth}
                      currentYear={currentYear}
                      onMonthChange={(month, year) => {
                        setCurrentMonth(month);
                        setCurrentYear(year);
                      }}
                    />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Precio Base</span>
                    <span className="text-white font-semibold">
                      {formatCurrency(config.priceBase)}
                    </span>
                  </div>
                  {Number(formData.personas) > 20 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        {Number(formData.personas) - 20} personas extra
                      </span>
                      <span className="text-white font-semibold">
                        {formatCurrency(
                          (Number(formData.personas) - 20) * config.priceExtra
                        )}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-slate-600 pt-2 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.dia}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 gap-2"
                >
                  {isSubmitting ? "Creando reserva..." : "Reservar Ahora"}
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <p className="text-xs text-slate-400 text-center">
                  Recibirás una confirmación en tu celular
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gallery Section */}
      {(images.length > 0 || videos.length > 0) && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Galería
              </h2>
              <p className="text-slate-400">
                Mira nuestro espacio y lo que ofrecemos
              </p>
            </div>

            {images.length > 0 && (
              <div className="mb-16">
                <h3 className="text-xl font-semibold mb-6 text-slate-200">
                  Fotos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.slice(0, 6).map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="group relative aspect-square rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all duration-300">
                        <img
                          src={item.url}
                          alt="Gallery"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      {item.caption && (
                        <p className="text-sm text-slate-300 text-center">{item.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-6 text-slate-200">
                  Videos
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {videos.map((item, index) => (
                    <div key={item.id} className="flex flex-col gap-3">
                      <button
                        onClick={() => setSelectedVideoIndex(index)}
                        className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all duration-300 group"
                      >
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Play className="w-12 h-12 text-white fill-white opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 mb-2">{config.title}</p>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Todos los derechos reservados
          </p>
        </div>
      </footer>

      {/* Transfer Modal */}
      <TransferModal
        isOpen={showTransferModal}
        onOpenChange={setShowTransferModal}
        transferInfo={config.transferInfo}
        bookingInfo={{
          nombre: formData.nombre,
          total: config.priceBase + (Number(formData.personas) - 20) * config.priceExtra,
        }}
        whatsappNumber={whatsappNumber}
      />
    </div>
  );
}
