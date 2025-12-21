import {
  Calendar, DollarSign,
  Edit,
  Grid3x3,
  MoreVertical,
  Plane,
  Plus,
  Search,
  Trash2,
  TrendingUp
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import { AdminFlight, adminFlightApi } from "../../api/adminFlightApi";
import SeatConfigurationDialog from "../../components/admin/SeatConfigurationDialog";
import { AdminLayout } from "../../components/AdminLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import type { PageType } from "../../MainApp";

interface AdminFlightsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function AdminFlightsPage({ onNavigate }: AdminFlightsPageProps) {
  const { t } = useTranslation();
  const [flights, setFlights] = useState<AdminFlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFlightOpen, setIsAddFlightOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSeatConfigDialogOpen, setIsSeatConfigDialogOpen] = useState(false);
  const [selectedFlightForSeats, setSelectedFlightForSeats] = useState<AdminFlight | null>(null);
  const [editingFlight, setEditingFlight] = useState<AdminFlight | null>(null);
  const [flightToDelete, setFlightToDelete] = useState<AdminFlight | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  const [formData, setFormData] = useState({
    airline: "VN",
    airlineName: "Vietnam Airlines",
    flightNumber: "",
    aircraft: "Airbus A321",
    from: "SGN",
    fromCity: "TP. Hồ Chí Minh",
    to: "HAN",
    toCity: "Hà Nội",
    departTime: "",
    arriveTime: "",
    duration: "",
    isDirect: true,
    terminal: "Nhà ga 3",
    economyPrice: 0,
    premiumEconomyPrice: 0,
    businessPrice: 0,
    availableSeats: 180,
    status: "active" as "active" | "inactive" | "cancelled",
    date: "",
  });

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const data = await adminFlightApi.getAllFlights();
      setFlights(data);
    } catch (error) {
      console.error("Failed to fetch flights:", error);
      toast.error(t('admin.cannotLoadFlights'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const stats = [
    { label: t('admin.totalFlights'), value: flights.length.toLocaleString(), icon: Plane, color: "blue" },
    { label: t('admin.active'), value: flights.filter((f: AdminFlight) => f.status === "active").length.toLocaleString(), icon: TrendingUp, color: "green" },
    { label: t('admin.bookedToday'), value: "0", icon: Calendar, color: "purple" }, // Placeholder
    { label: t('admin.revenueThisMonth'), value: "0", icon: DollarSign, color: "orange" }, // Placeholder
  ];

  const airports = [
    { code: "SGN", city: "TP. Hồ Chí Minh", name: "Sân bay Tân Sơn Nhất" },
    { code: "HAN", city: "Hà Nội", name: "Sân bay Nội Bài" },
    { code: "DAD", city: "Đà Nẵng", name: "Sân bay Đà Nẵng" },
    { code: "PQC", city: "Phú Quốc", name: "Sân bay Phú Quốc" },
    { code: "CXR", city: "Nha Trang", name: "Sân bay Cam Ranh" },
  ];

  const airlines = [
    { code: "VN", name: "Vietnam Airlines" },
    { code: "VJ", name: "VietJet Air" },
    { code: "BL", name: "Pacific Airlines" },
    { code: "QH", name: "Bamboo Airways" },
  ];

  const aircrafts = [
    "Airbus A320",
    "Airbus A321",
    "Airbus A350",
    "Boeing 787",
    "Boeing 777",
  ];

  const handleEdit = (flight: AdminFlight) => {
    setEditingFlight(flight);
    setFormData({
      airline: flight.airline,
      airlineName: flight.airlineName,
      flightNumber: flight.flightNumber,
      aircraft: flight.aircraft,
      from: flight.from,
      fromCity: flight.fromCity,
      to: flight.to,
      toCity: flight.toCity,
      departTime: flight.departTime,
      arriveTime: flight.arriveTime,
      duration: flight.duration,
      isDirect: flight.isDirect,
      terminal: flight.terminal,
      economyPrice: flight.economyPrice,
      premiumEconomyPrice: flight.premiumEconomyPrice,
      businessPrice: flight.businessPrice,
      availableSeats: flight.availableSeats,
      status: flight.status,
      date: flight.date,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingFlight) {
      try {
        await adminFlightApi.updateFlight(editingFlight.id, formData);
        toast.success(t('admin.flightUpdated', { number: formData.flightNumber }));
        setIsEditDialogOpen(false);
        setEditingFlight(null);
        resetForm();
        fetchFlights();
      } catch (error) {
        console.error("Failed to update flight:", error);
        toast.error(t('admin.cannotUpdateFlight'));
      }
    }
  };

  const handleDelete = (flight: AdminFlight) => {
    setFlightToDelete(flight);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (flightToDelete) {
      try {
        await adminFlightApi.deleteFlight(flightToDelete.id);
        toast.success(t('admin.flightDeleted', { number: flightToDelete.flightNumber }));
        setIsDeleteDialogOpen(false);
        setFlightToDelete(null);
        fetchFlights();
      } catch (error) {
        console.error("Failed to delete flight:", error);
        toast.error(t('admin.cannotDeleteFlight'));
      }
    }
  };

  const handleAddFlight = async () => {
    try {
      await adminFlightApi.createFlight(formData);
      toast.success(t('admin.flightAdded', { number: formData.flightNumber }));
      setIsAddFlightOpen(false);
      resetForm();
      fetchFlights();
    } catch (error) {
      console.error("Failed to create flight:", error);
      toast.error(t('admin.cannotAddFlight'));
    }
  };

  const resetForm = () => {
    setFormData({
      airline: "VN",
      airlineName: "Vietnam Airlines",
      flightNumber: "",
      aircraft: "Airbus A321",
      from: "SGN",
      fromCity: "TP. Hồ Chí Minh",
      to: "HAN",
      toCity: "Hà Nội",
      departTime: "",
      arriveTime: "",
      duration: "",
      isDirect: true,
      terminal: "Nhà ga 3",
      economyPrice: 0,
      premiumEconomyPrice: 0,
      businessPrice: 0,
      availableSeats: 180,
      status: "active",
      date: "",
    });
  };

  const handleAirlineChange = (value: string) => {
    const airline = airlines.find(a => a.code === value);
    setFormData({
      ...formData,
      airline: value,
      airlineName: airline?.name || "",
    });
  };

  const handleFromChange = (value: string) => {
    const airport = airports.find(a => a.code === value);
    setFormData({
      ...formData,
      from: value,
      fromCity: airport?.city || "",
    });
  };

  const handleToChange = (value: string) => {
    const airport = airports.find(a => a.code === value);
    setFormData({
      ...formData,
      to: value,
      toCity: airport?.city || "",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">{t('admin.active')}</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-700">{t('admin.paused')}</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">{t('admin.cancelled')}</Badge>;
      default:
        return null;
    }
  };

  const filteredFlights = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const base = flights.filter((flight: AdminFlight) =>
      flight.flightNumber.toLowerCase().includes(q) ||
      flight.fromCity.toLowerCase().includes(q) ||
      flight.toCity.toLowerCase().includes(q) ||
      flight.airlineName.toLowerCase().includes(q)
    );
    return base;
  }, [flights, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredFlights.length / pageSize));
  const paginatedFlights = useMemo(() => {
    const start = page * pageSize;
    return filteredFlights.slice(start, start + pageSize);
  }, [filteredFlights, page, pageSize]);

  const paginationRange = useMemo(() => {
    const siblingCount = 2; // show 2 pages on each side
    const totalPageNumbers = siblingCount * 2 + 5; // first, last, current, 2 dots

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const leftSiblingIndex = Math.max(page + 1 - siblingCount, 2);
    const rightSiblingIndex = Math.min(page + 1 + siblingCount, totalPages - 1);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    const range: (number | string)[] = [1];

    if (showLeftDots) {
      range.push('dots-left');
    } else {
      for (let i = 2; i < leftSiblingIndex; i++) {
        range.push(i);
      }
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      range.push(i);
    }

    if (showRightDots) {
      range.push('dots-right');
    } else {
      for (let i = rightSiblingIndex + 1; i < totalPages; i++) {
        range.push(i);
      }
    }

    range.push(totalPages);
    return range;
  }, [page, totalPages]);

  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  useEffect(() => {
    const maxPage = Math.max(0, totalPages - 1);
    if (page > maxPage) setPage(maxPage);
  }, [page, totalPages]);

  const FlightFormFields = () => (
    <div className="space-y-4 py-4">
      {/* Flight Number & Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="flightNumber">{t('admin.flightNumber')} *</Label>
          <Input
            id="flightNumber"
            value={formData.flightNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, flightNumber: e.target.value })}
            placeholder="VN 6123"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">{t('admin.flightDate')} *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Airline & Aircraft */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="airline">{t('admin.airline')} *</Label>
          <Select value={formData.airline} onValueChange={handleAirlineChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {airlines.map((airline) => (
                <SelectItem key={airline.code} value={airline.code}>
                  {airline.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="aircraft">{t('admin.aircraft')} *</Label>
          <Select value={formData.aircraft} onValueChange={(value) => setFormData({ ...formData, aircraft: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aircrafts.map((aircraft) => (
                <SelectItem key={aircraft} value={aircraft}>
                  {aircraft}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Route */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="from">{t('admin.departure')} *</Label>
          <Select value={formData.from} onValueChange={handleFromChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport.code} value={airport.code}>
                  {airport.code} - {airport.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="to">{t('admin.destination')} *</Label>
          <Select value={formData.to} onValueChange={handleToChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport.code} value={airport.code}>
                  {airport.code} - {airport.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Time */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departTime">{t('admin.departureTime')} *</Label>
          <Input
            id="departTime"
            type="time"
            value={formData.departTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, departTime: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="arriveTime">{t('admin.arrivalTime')} *</Label>
          <Input
            id="arriveTime"
            type="time"
            value={formData.arriveTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, arriveTime: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">{t('admin.flightDuration')} *</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="1h 10p"
            required
          />
        </div>
      </div>

      {/* Terminal & Flight Type */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="terminal">{t('admin.terminal')}</Label>
          <Input
            id="terminal"
            value={formData.terminal}
            onChange={(e) => setFormData({ ...formData, terminal: e.target.value })}
            placeholder={t('admin.terminalPlaceholder')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="isDirect">{t('admin.flightType')} *</Label>
          <Select
            value={formData.isDirect ? "direct" : "transit"}
            onValueChange={(value) => setFormData({ ...formData, isDirect: value === "direct" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">{t('admin.directFlight')}</SelectItem>
              <SelectItem value="transit">{t('admin.transitFlight')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="economyPrice">{t('admin.economyPrice')} (VNĐ) *</Label>
          <Input
            id="economyPrice"
            type="number"
            value={formData.economyPrice}
            onChange={(e) => setFormData({ ...formData, economyPrice: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="premiumEconomyPrice">{t('admin.premiumEconomyPrice')} (VNĐ) *</Label>
          <Input
            id="premiumEconomyPrice"
            type="number"
            value={formData.premiumEconomyPrice}
            onChange={(e) => setFormData({ ...formData, premiumEconomyPrice: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessPrice">{t('admin.businessPrice')} (VNĐ) *</Label>
          <Input
            id="businessPrice"
            type="number"
            value={formData.businessPrice}
            onChange={(e) => setFormData({ ...formData, businessPrice: Number(e.target.value) })}
            required
          />
        </div>
      </div>

      {/* Available Seats & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="availableSeats">{t('admin.availableSeats')} *</Label>
          <Input
            id="availableSeats"
            type="number"
            value={formData.availableSeats}
            onChange={(e) => setFormData({ ...formData, availableSeats: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">{t('admin.status')} *</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t('admin.active')}</SelectItem>
              <SelectItem value="inactive">{t('admin.paused')}</SelectItem>
              <SelectItem value="cancelled">{t('admin.cancelled')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout currentPage="admin-flights" onNavigate={onNavigate} activePage="admin-flights">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{t('admin.manageFlights')}</h1>
            <p className="text-gray-600">{t('admin.manageFlightsDesc')}</p>
          </div>
          <Dialog open={isAddFlightOpen} onOpenChange={setIsAddFlightOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {t('admin.addFlight')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('admin.addNewFlight')}</DialogTitle>
                <DialogDescription>
                  {t('admin.addFlightDesc')}
                </DialogDescription>
              </DialogHeader>
              <FlightFormFields />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddFlightOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleAddFlight}>{t('admin.addFlight')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-xl">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Search & Table */}
        <Card className="p-6">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t('admin.searchFlights')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.flight')}</TableHead>
                  <TableHead>{t('admin.route')}</TableHead>
                  <TableHead>{t('admin.time')}</TableHead>
                  <TableHead>{t('admin.priceFrom')}</TableHead>
                  <TableHead>{t('admin.booked')}</TableHead>
                  <TableHead>{t('admin.available')}</TableHead>
                  <TableHead>{t('admin.status')}</TableHead>
                  <TableHead className="text-right">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      {t('common.loading')}
                    </TableCell>
                  </TableRow>
                ) : filteredFlights.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      {t('admin.noFlightsFound')}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedFlights.map((flight) => (
                    <TableRow key={flight.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{flight.flightNumber}</p>
                          <p className="text-sm text-gray-500">{flight.airlineName}</p>
                          <p className="text-xs text-gray-400">{flight.aircraft}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{flight.from}</span> → <span className="font-medium">{flight.to}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {flight.fromCity} - {flight.toCity}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {flight.isDirect ? t('admin.directFlight') : t('admin.transitFlight')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{flight.departTime} - {flight.arriveTime}</p>
                          <p className="text-gray-500">{flight.duration}</p>
                          <p className="text-xs text-gray-400">{flight.date}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{flight.economyPrice.toLocaleString()}đ</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{flight.totalBookings}</p>
                      </TableCell>
                      <TableCell>
                        <p className={flight.availableSeats < 50 ? "text-red-600 font-medium" : "font-medium"}>
                          {flight.availableSeats}
                        </p>
                      </TableCell>
                      <TableCell>{getStatusBadge(flight.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2" onClick={() => handleEdit(flight)}>
                              <Edit className="w-4 h-4" />
                              {t('common.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => {
                              setSelectedFlightForSeats(flight);
                              setIsSeatConfigDialogOpen(true);
                            }}>
                              <Grid3x3 className="w-4 h-4" />
                              Cấu hình ghế
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-600" onClick={() => handleDelete(flight)}>
                              <Trash2 className="w-4 h-4" />
                              {t('common.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredFlights.length > 0 && (
            <div className="flex items-center justify-between flex-wrap gap-3 mt-4 text-sm text-gray-700">
              <div>
                Trang {page + 1} / {totalPages} · {filteredFlights.length} chuyến bay
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  {t('common.previous')}
                </Button>

                {paginationRange.map((item, idx) => {
                  if (typeof item === 'string') {
                    return (
                      <span key={item + idx} className="px-2 text-gray-500 select-none">…</span>
                    );
                  }
                  const pageIndex = item - 1;
                  const isActive = pageIndex === page;
                  return (
                    <Button
                      key={item}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={isActive ? "bg-blue-600 text-white" : ""}
                      onClick={() => setPage(pageIndex)}
                    >
                      {item}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page + 1 >= totalPages}
                >
                  {t('common.next')}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.editFlight')}</DialogTitle>
            <DialogDescription>
              {t('admin.editFlightDesc', { number: editingFlight?.flightNumber })}
            </DialogDescription>
          </DialogHeader>
          <FlightFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveEdit}>{t('common.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.confirmDeleteFlight')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.deleteFlight Description', {
                number: flightToDelete?.flightNumber,
                from: flightToDelete?.fromCity,
                to: flightToDelete?.toCity
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Seat Configuration Dialog */}
      {selectedFlightForSeats && (
        <SeatConfigurationDialog
          open={isSeatConfigDialogOpen}
          onOpenChange={setIsSeatConfigDialogOpen}
          flightId={selectedFlightForSeats.id}
          onSuccess={() => {
            fetchFlights();
          }}
        />
      )}
    </AdminLayout>
  );
}