import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/AdminLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Plus, MoreVertical, Edit, Trash2, Plane,
  TrendingUp, Calendar, DollarSign, Search
} from "lucide-react";
import type { PageType } from "../../MainApp";
import { toast } from "sonner";
import { adminFlightApi, AdminFlight } from "../../api/adminFlightApi";

interface AdminFlightsPageProps {
  onNavigate: (page: PageType, data?: any) => void;
}

export default function AdminFlightsPage({ onNavigate }: AdminFlightsPageProps) {
  const [flights, setFlights] = useState<AdminFlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFlightOpen, setIsAddFlightOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<AdminFlight | null>(null);
  const [flightToDelete, setFlightToDelete] = useState<AdminFlight | null>(null);

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
      toast.error("Không thể tải danh sách chuyến bay");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const stats = [
    { label: "Tổng chuyến bay", value: flights.length.toLocaleString(), icon: Plane, color: "blue" },
    { label: "Đang hoạt động", value: flights.filter((f: AdminFlight) => f.status === "active").length.toLocaleString(), icon: TrendingUp, color: "green" },
    { label: "Đã đặt hôm nay", value: "0", icon: Calendar, color: "purple" }, // Placeholder
    { label: "Doanh thu tháng này", value: "0", icon: DollarSign, color: "orange" }, // Placeholder
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
        toast.success(`Đã cập nhật chuyến bay: ${formData.flightNumber}`);
        setIsEditDialogOpen(false);
        setEditingFlight(null);
        resetForm();
        fetchFlights();
      } catch (error) {
        console.error("Failed to update flight:", error);
        toast.error("Không thể cập nhật chuyến bay");
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
        toast.success(`Đã xóa chuyến bay: ${flightToDelete.flightNumber}`);
        setIsDeleteDialogOpen(false);
        setFlightToDelete(null);
        fetchFlights();
      } catch (error) {
        console.error("Failed to delete flight:", error);
        toast.error("Không thể xóa chuyến bay");
      }
    }
  };

  const handleAddFlight = async () => {
    try {
      await adminFlightApi.createFlight(formData);
      toast.success(`Đã thêm chuyến bay: ${formData.flightNumber}`);
      setIsAddFlightOpen(false);
      resetForm();
      fetchFlights();
    } catch (error) {
      console.error("Failed to create flight:", error);
      toast.error("Không thể thêm chuyến bay");
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
        return <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-700">Tạm dừng</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">Đã hủy</Badge>;
      default:
        return null;
    }
  };

  const filteredFlights = flights.filter((flight: AdminFlight) =>
    flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.fromCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.toCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.airlineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const FlightFormFields = () => (
    <div className="space-y-4 py-4">
      {/* Flight Number & Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="flightNumber">Số hiệu chuyến bay *</Label>
          <Input
            id="flightNumber"
            value={formData.flightNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, flightNumber: e.target.value })}
            placeholder="VN 6123"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Ngày bay *</Label>
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
          <Label htmlFor="airline">Hãng hàng không *</Label>
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
          <Label htmlFor="aircraft">Máy bay *</Label>
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
          <Label htmlFor="from">Điểm đi *</Label>
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
          <Label htmlFor="to">Điểm đến *</Label>
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
          <Label htmlFor="departTime">Giờ khởi hành *</Label>
          <Input
            id="departTime"
            type="time"
            value={formData.departTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, departTime: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="arriveTime">Giờ đến *</Label>
          <Input
            id="arriveTime"
            type="time"
            value={formData.arriveTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, arriveTime: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Thời gian bay *</Label>
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
          <Label htmlFor="terminal">Nhà ga</Label>
          <Input
            id="terminal"
            value={formData.terminal}
            onChange={(e) => setFormData({ ...formData, terminal: e.target.value })}
            placeholder="Nhà ga 3"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="isDirect">Loại chuyến bay *</Label>
          <Select
            value={formData.isDirect ? "direct" : "transit"}
            onValueChange={(value) => setFormData({ ...formData, isDirect: value === "direct" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">Bay thẳng</SelectItem>
              <SelectItem value="transit">Có điểm dừng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="economyPrice">Giá Phổ thông (VNĐ) *</Label>
          <Input
            id="economyPrice"
            type="number"
            value={formData.economyPrice}
            onChange={(e) => setFormData({ ...formData, economyPrice: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="premiumEconomyPrice">Giá Phổ thông Đặc biệt (VNĐ) *</Label>
          <Input
            id="premiumEconomyPrice"
            type="number"
            value={formData.premiumEconomyPrice}
            onChange={(e) => setFormData({ ...formData, premiumEconomyPrice: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessPrice">Giá Thương gia (VNĐ) *</Label>
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
          <Label htmlFor="availableSeats">Số ghế còn trống *</Label>
          <Input
            id="availableSeats"
            type="number"
            value={formData.availableSeats}
            onChange={(e) => setFormData({ ...formData, availableSeats: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái *</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Tạm dừng</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
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
            <h1 className="text-3xl text-gray-900 mb-2">Quản lý Chuyến bay</h1>
            <p className="text-gray-600">Quản lý thông tin các chuyến bay trong hệ thống</p>
          </div>
          <Dialog open={isAddFlightOpen} onOpenChange={setIsAddFlightOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm chuyến bay
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm chuyến bay mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin chi tiết về chuyến bay
                </DialogDescription>
              </DialogHeader>
              <FlightFormFields />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddFlightOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddFlight}>Thêm chuyến bay</Button>
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
              placeholder="Tìm kiếm theo số hiệu, hãng bay, tuyến đường..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chuyến bay</TableHead>
                  <TableHead>Tuyến bay</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Giá từ</TableHead>
                  <TableHead>Đã đặt</TableHead>
                  <TableHead>Còn trống</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : filteredFlights.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Không tìm thấy chuyến bay nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFlights.map((flight) => (
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
                            {flight.isDirect ? "Bay thẳng" : "Có điểm dừng"}
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
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-600" onClick={() => handleDelete(flight)}>
                              <Trash2 className="w-4 h-4" />
                              Xóa
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
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa chuyến bay</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chuyến bay {editingFlight?.flightNumber}
            </DialogDescription>
          </DialogHeader>
          <FlightFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveEdit}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chắc chắn muốn xóa chuyến bay này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn chuyến bay <strong>{flightToDelete?.flightNumber}</strong> ({flightToDelete?.fromCity} → {flightToDelete?.toCity}).
              Tất cả các booking liên quan sẽ bị ảnh hưởng. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}