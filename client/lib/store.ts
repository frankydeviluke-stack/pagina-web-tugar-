import React, { createContext, useContext, useState, useEffect } from "react";

export type Booking = {
  id: string;
  nombre: string;
  celular: string;
  personas: number;
  dia: number;
  status: "pendiente" | "confirmado";
  total: number;
  createdAt: string;
};

export type MediaItem = {
  id: string;
  type: "image" | "video";
  url: string;
  caption?: string;
};

export type TransferInfo = {
  rut: string;
  nombre: string;
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
};

export type SiteConfig = {
  title: string;
  description: string;
  heroImage: string;
  priceBase: number;
  priceExtra: number;
  gallery: MediaItem[];
  transferInfo: TransferInfo;
};

interface BookingContextType {
  bookings: Booking[];
  config: SiteConfig;
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => void;
  removeBooking: (id: string) => void;
  updateBookingStatus: (id: string, status: "pendiente" | "confirmado") => void;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  isDayBlocked: (day: number) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [config, setConfig] = useState<SiteConfig>({
    title: "Tugar Tugar",
    description: "El espacio perfecto para tus celebraciones. Reserva tu fecha hoy mismo.",
    heroImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000",
    priceBase: 100000,
    priceExtra: 5000,
    gallery: [
      {
        id: "1",
        type: "image",
        url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
        caption: "Salón Principal",
      },
      {
        id: "2",
        type: "image",
        url: "https://images.unsplash.com/photo-1464366400600-7168b8af0bc3?auto=format&fit=crop&q=80&w=800",
        caption: "Decoración Elegante",
      },
      {
        id: "3",
        type: "image",
        url: "https://images.unsplash.com/photo-1530103862676-de3c9a59af38?auto=format&fit=crop&q=80&w=800",
        caption: "Mesas y Montaje",
      },
    ],
    transferInfo: {
      rut: "",
      nombre: "",
      banco: "",
      tipoCuenta: "",
      numeroCuenta: "",
    },
  });

  useEffect(() => {
    if (bookings.length === 0) {
      setBookings([
        {
          id: "1",
          nombre: "Juan Pérez",
          celular: "912345678",
          personas: 20,
          dia: 5,
          status: "confirmado",
          total: 100000,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          nombre: "Maria Rodriguez",
          celular: "987654321",
          personas: 50,
          dia: 15,
          status: "pendiente",
          total: 150000,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  const addBooking = (data: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...data,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [...prev, newBooking]);
  };

  const removeBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBookingStatus = (id: string, status: "pendiente" | "confirmado") => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const isDayBlocked = (day: number) => {
    return bookings.some((b) => b.dia === day);
  };

  const contextValue: BookingContextType = {
    bookings,
    config,
    addBooking,
    removeBooking,
    updateBookingStatus,
    updateConfig,
    isDayBlocked,
  };

  return React.createElement(
    BookingContext.Provider,
    { value: contextValue },
    children
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return context;
}
