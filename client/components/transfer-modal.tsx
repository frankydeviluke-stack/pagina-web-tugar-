import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Copy, CheckCircle2 } from "lucide-react";
import { TransferInfo } from "@/lib/store";
import { useState } from "react";

interface TransferModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transferInfo: TransferInfo;
  bookingInfo: {
    nombre: string;
    total: number;
  };
  whatsappNumber: string;
}

export default function TransferModal({
  isOpen,
  onOpenChange,
  transferInfo,
  bookingInfo,
  whatsappNumber,
}: TransferModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Hola, ya realicé la transferencia 💸 Aquí te adjunto el comprobante. Gracias!!"
    );
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(url, "_blank");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Información de Transferencia</DialogTitle>
          <DialogDescription className="text-slate-400">
            Realiza la transferencia con los siguientes datos:
          </DialogDescription>
        </DialogHeader>

        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-200">
            Una vez hecha la transferencia, envíame por WhatsApp captura del comprobante
          </p>
        </div>

        <div className="space-y-4">
          {/* Resumen de reserva */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-400 mb-2">Tu Reserva:</p>
            <p className="font-semibold">{bookingInfo.nombre}</p>
            <p className="text-lg font-bold text-cyan-400">
              Monto: ${bookingInfo.total.toLocaleString("es-CO")}
            </p>
          </div>

          {/* Datos de transferencia */}
          <div className="space-y-3">
            <TransferField
              label="RUT"
              value={transferInfo.rut}
              onCopy={() => copyToClipboard(transferInfo.rut, "rut")}
              isCopied={copiedField === "rut"}
            />
            <TransferField
              label="Nombre"
              value={transferInfo.nombre}
              onCopy={() => copyToClipboard(transferInfo.nombre, "nombre")}
              isCopied={copiedField === "nombre"}
            />
            <TransferField
              label="Banco"
              value={transferInfo.banco}
              onCopy={() => copyToClipboard(transferInfo.banco, "banco")}
              isCopied={copiedField === "banco"}
            />
            <TransferField
              label="Tipo de Cuenta"
              value={transferInfo.tipoCuenta}
              onCopy={() => copyToClipboard(transferInfo.tipoCuenta, "tipoCuenta")}
              isCopied={copiedField === "tipoCuenta"}
            />
            <TransferField
              label="Número de Cuenta"
              value={transferInfo.numeroCuenta}
              onCopy={() => copyToClipboard(transferInfo.numeroCuenta, "numeroCuenta")}
              isCopied={copiedField === "numeroCuenta"}
            />
          </div>

          {/* Botones de acción */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              ✓ Listo, ya transferí
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full border-slate-600 hover:bg-slate-700"
            >
              Cerrar
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Al hacer clic en "Listo", serás redirigido a WhatsApp
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface TransferFieldProps {
  label: string;
  value: string;
  onCopy: () => void;
  isCopied: boolean;
}

function TransferField({
  label,
  value,
  onCopy,
  isCopied,
}: TransferFieldProps) {
  return (
    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-sm font-semibold break-all">{value}</p>
        <button
          onClick={onCopy}
          className="p-2 hover:bg-slate-700 rounded transition-colors flex-shrink-0"
        >
          {isCopied ? (
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-slate-400 hover:text-slate-200" />
          )}
        </button>
      </div>
    </div>
  );
}
