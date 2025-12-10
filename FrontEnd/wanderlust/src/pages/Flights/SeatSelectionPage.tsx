import { AnimatePresence, motion } from 'framer-motion';
import { Armchair, ArrowLeft, Check, Info, Plane, Power, Usb, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Badge } from '../../components/ui/badge';
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../components/ui/hover-card';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { PageType } from '../../MainApp';
import { flightSeatApi } from '../../utils/api';
import { cn } from '../../components/ui/utils';

interface SeatSelectionPageProps {
    onNavigate: (page: PageType, data?: any) => void;
    pageData: {
        tripType: string;
        from: any;
        to: any;
        departDate: Date;
        returnDate?: Date;
        passengers: {
            adults: number;
            children: number;
            infants: number;
            total: number;
        };
        cabinClass: string; // 'economy', 'business', 'first'
        outboundFlight: any;
        returnFlight?: any;
        currentFlightValidating?: 'outbound' | 'return';
        selectedSeatsOutbound?: any[];
        selectedSeatsReturn?: any[];
    }
}

// Seat Class Definitions
const SEAT_CLASSES = {
    ALL: 'ALL',
    ECONOMY: 'ECONOMY',
    BUSINESS: 'BUSINESS',
    FIRST_CLASS: 'FIRST_CLASS'
};

export default function SeatSelectionPage({ onNavigate, pageData }: SeatSelectionPageProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [allSeats, setAllSeats] = useState<any[]>([]);
    const [displayedSeats, setDisplayedSeats] = useState<any[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<string>(SEAT_CLASSES.ALL);
    const [selectedSeatDetail, setSelectedSeatDetail] = useState<any>(null); // For mobile/click detail

    // Calculate passengers count requiring seats (adults + children)
    const requiredSeatsCount = pageData ? (pageData.passengers.adults + pageData.passengers.children) : 1;

    // Determine which flight we are creating seats for
    const isOutbound = !pageData?.currentFlightValidating || pageData.currentFlightValidating === 'outbound';
    const currentFlight = isOutbound ? pageData?.outboundFlight : pageData?.returnFlight;

    useEffect(() => {
        const fetchSeats = async () => {
            if (!currentFlight?.id) return;

            try {
                setLoading(true);
                const data = await flightSeatApi.getSeatsByFlight(currentFlight.id);
                setAllSeats(data);
                setDisplayedSeats(data); // Initially show all

                // Set default tab based on booking class
                const initialTab = getCabinClassEnum(pageData?.cabinClass || 'economy');
                if (data.some((s: any) => s.cabinClass === initialTab)) {
                    setActiveTab(initialTab);
                } else {
                    setActiveTab(SEAT_CLASSES.ALL);
                }

            } catch (error) {
                console.error("Failed to fetch seats", error);
                toast.error(t('flights.fetchSeatsError') || "Không thể tải sơ đồ ghế");
            } finally {
                setLoading(false);
            }
        };

        fetchSeats();
    }, [currentFlight]);

    // Filter displayed seats when tab changes
    useEffect(() => {
        if (activeTab === SEAT_CLASSES.ALL) {
            setDisplayedSeats(allSeats);
        } else {
            setDisplayedSeats(allSeats.filter(s => s.cabinClass === activeTab));
        }
    }, [activeTab, allSeats]);


    const getCabinClassEnum = (cabinClass: string) => {
        const mapping: Record<string, string> = {
            'economy': 'ECONOMY',
            'business': 'BUSINESS',
            'first': 'FIRST_CLASS'
        };
        return mapping[cabinClass.toLowerCase()] || 'ECONOMY';
    };

    const handleSeatClick = (seat: any) => {
        if (seat.status !== 'AVAILABLE') return;

        const isSelected = selectedSeats.find(s => s.id === seat.id);

        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            if (selectedSeats.length >= requiredSeatsCount) {
                // If max reached, replace the last selected one? Or just warn.
                // Let's replace the first one if length is 1, else warn
                if (requiredSeatsCount === 1) {
                    setSelectedSeats([seat]);
                } else {
                    toast.error(t('flights.maxSeatsSelected') || `Bạn chỉ có thể chọn tối đa ${requiredSeatsCount} ghế`);
                }
                return;
            }
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleContinue = () => {
        if (selectedSeats.length < requiredSeatsCount) {
            toast.error(t('flights.pleaseSelectSeats') || `Vui lòng chọn đủ ${requiredSeatsCount} ghế`);
            return;
        }

        if (isOutbound && pageData.tripType === 'round-trip' && pageData.returnFlight) {
            onNavigate('seat-selection', {
                ...pageData,
                currentFlightValidating: 'return',
                selectedSeatsOutbound: selectedSeats
            });
        } else {
            const finalSelectedSeats = {
                outbound: isOutbound ? selectedSeats : pageData.selectedSeatsOutbound || [],
                return: !isOutbound ? selectedSeats : (pageData.selectedSeatsReturn || [])
            };

            onNavigate('flight-review', {
                ...pageData,
                selectedSeats: finalSelectedSeats
            });
        }
    };

    // --- Helpers for Rendering ---

    // Seat Colors based on Class
    const getSeatColor = (cabinClass: string, isSelected: boolean, isAvailable: boolean) => {
        if (!isAvailable) return "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed";
        if (isSelected) return "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105 z-10";

        switch (cabinClass) {
            case 'FIRST_CLASS':
                return "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200 hover:border-amber-400";
            case 'BUSINESS':
                return "bg-emerald-100 border-emerald-300 text-emerald-900 hover:bg-emerald-200 hover:border-emerald-400";
            case 'ECONOMY':
            default:
                return "bg-white border-blue-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50";
        }
    };

    const getSeatTypeLabel = (type: string) => {
        const map: Record<string, string> = { 'WINDOW': 'Cửa sổ', 'MIDDLE': 'Giữa', 'AISLE': 'Lối đi' };
        return map[type] || type;
    };

    const getCabinLabel = (cabin: string) => {
        const map: Record<string, string> = { 'ECONOMY': 'Phổ thông', 'BUSINESS': 'Thương gia', 'FIRST_CLASS': 'Hạng nhất' };
        return map[cabin] || cabin;
    }

    // Sort displayed seats by Row/Pos
    const sortedSeats = [...displayedSeats].sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row;
        return a.position.localeCompare(b.position);
    });

    const rows = [...new Set(sortedSeats.map(s => s.row))];

    return (
        <div className="min-h-screen bg-slate-50 relative pb-32">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => onNavigate('flights')} className="gap-2 text-slate-600 hover:text-slate-900">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">{t('common.back')}</span>
                    </Button>
                    <div className="text-center">
                        <h1 className="text-lg font-bold text-slate-800">
                            {isOutbound ? "Chọn ghế chiều đi" : "Chọn ghế chiều về"}
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">
                            {currentFlight?.departureAirportCode} → {currentFlight?.arrivalAirportCode} • {currentFlight?.flightNumber}
                        </p>
                    </div>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Visual Seat Map (Left/Center) */}
                <div className="lg:col-span-8 flex flex-col items-center">

                    {/* Class Selector Tabs */}
                    <div className="w-full max-w-md mb-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-4 bg-slate-200">
                                <TabsTrigger value={SEAT_CLASSES.ALL}>Tất cả</TabsTrigger>
                                <TabsTrigger value={SEAT_CLASSES.ECONOMY}>Phổ thông</TabsTrigger>
                                <TabsTrigger value={SEAT_CLASSES.BUSINESS}>Thương gia</TabsTrigger>
                                <TabsTrigger value={SEAT_CLASSES.FIRST_CLASS}>Hạng nhất</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Fuselage Container */}
                    <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border-4 border-slate-200 p-8 md:p-12 relative overflow-hidden min-h-[600px]">
                        {/* Cockpit Indicator */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none flex justify-center pt-6 opacity-50">
                            <Plane className="w-16 h-16 text-slate-300" />
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
                                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-slate-500 font-medium animate-pulse">Đang tải sơ đồ ghế...</p>
                            </div>
                        ) : sortedSeats.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
                                <Armchair className="w-16 h-16 mb-4 opacity-50" />
                                <p>Không tìm thấy ghế phù hợp</p>
                            </div>
                        ) : (
                            <div className="relative z-10 pt-10 space-y-4">
                                {rows.map(rowNum => {
                                    const rowSeats = sortedSeats.filter(s => s.row === rowNum).sort((a, b) => a.position.localeCompare(b.position));

                                    // Calculate logic split for aisle (simple split in half for demo)
                                    const mid = Math.ceil(rowSeats.length / 2);
                                    const left = rowSeats.slice(0, mid);
                                    const right = rowSeats.slice(mid);

                                    return (
                                        <div key={rowNum} className="flex justify-center items-center gap-6 md:gap-10">
                                            {/* Left Group */}
                                            <div className="flex gap-2">
                                                {left.map(seat => <SeatItem key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onToggle={() => handleSeatClick(seat)} getSeatColor={getSeatColor} />)}
                                            </div>

                                            {/* Row Number */}
                                            <div className="w-6 text-center text-xs font-bold text-slate-300">{rowNum}</div>

                                            {/* Right Group */}
                                            <div className="flex gap-2">
                                                {right.map(seat => <SeatItem key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onToggle={() => handleSeatClick(seat)} getSeatColor={getSeatColor} />)}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Tail Indicator */}
                        <div className="mt-12 text-center text-slate-300 text-xs font-bold uppercase tracking-widest">
                            Phía sau máy bay
                        </div>
                    </div>
                </div>

                {/* Info Sidebar (Right) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Summary Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Check className="w-5 h-5 text-blue-600" />
                            Ghế của bạn
                        </h3>

                        <div className="space-y-4">
                            {selectedSeats.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                                    <p className="text-slate-400 text-sm">Chưa có ghế nào được chọn</p>
                                    <p className="text-blue-500 text-xs mt-1 font-medium">Vui lòng chọn {requiredSeatsCount} ghế</p>
                                </div>
                            ) : (
                                selectedSeats.map((seat, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-sm ${seat.cabinClass === 'BUSINESS' ? 'bg-emerald-500' :
                                                seat.cabinClass === 'FIRST_CLASS' ? 'bg-amber-500' : 'bg-blue-600'
                                                }`}>
                                                {seat.row}{seat.position}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">{getCabinLabel(seat.cabinClass)}</p>
                                                <p className="text-xs text-slate-500">{getSeatTypeLabel(seat.seatType)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-800">
                                                {seat.price ? `+${(seat.price / 1000).toFixed(0)}K` : 'Free'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-500 font-medium">Tổng cộng</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    {selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0).toLocaleString('vi-VN')}₫
                                </span>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 h-12 text-lg shadow-lg shadow-blue-200"
                            disabled={selectedSeats.length < requiredSeatsCount}
                            onClick={handleContinue}
                        >
                            {selectedSeats.length >= requiredSeatsCount
                                ? (isOutbound && pageData.tripType === 'round-trip' && pageData.returnFlight
                                    ? 'Chọn ghế chiều về'
                                    : 'Xác nhận & Tiếp tục')
                                : `Chọn thêm ${requiredSeatsCount - selectedSeats.length} ghế`
                            }
                        </Button>
                    </motion.div>

                    {/* Legend */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h4 className="font-semibold text-slate-700 mb-4">Chú thích</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-white border border-blue-300"></div>
                                <span className="text-slate-600">Phổ thông</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-300"></div>
                                <span className="text-slate-600">Thương gia</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300"></div>
                                <span className="text-slate-600">Hạng nhất</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-blue-600"></div>
                                <span className="text-slate-600">Đang chọn</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-gray-200"></div>
                                <span className="text-slate-400">Đã đặt</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

// Separate Component for individual seat to handle Hover State cleanly
const SeatItem = ({ seat, isSelected, onToggle, getSeatColor }: { seat: any, isSelected: boolean, onToggle: () => void, getSeatColor: any }) => {
    const isAvailable = seat.status === 'AVAILABLE';
    const colorClass = getSeatColor(seat.cabinClass, isSelected, isAvailable);

    // Simulated amenities based on class
    const getAmenities = (cls: string) => {
        if (cls === 'FIRST_CLASS') return { legroom: '42"', recline: '180°', power: true, usb: true, wifi: true };
        if (cls === 'BUSINESS') return { legroom: '36"', recline: '160°', power: true, usb: true, wifi: true };
        return { legroom: '31"', recline: '110°', power: false, usb: true, wifi: false }; // Economy
    };

    const amenities = getAmenities(seat.cabinClass);

    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger asChild>
                <button
                    onClick={onToggle}
                    disabled={!isAvailable}
                    className={cn(
                        "w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl border-2 flex items-center justify-center transition-all duration-200 relative group",
                        colorClass
                    )}
                >
                    <Armchair className={cn(
                        "w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110",
                        !isAvailable ? "opacity-30" : "",
                        isSelected ? "text-white" : "opacity-70"
                    )} strokeWidth={2.5} />

                    {/* Badge for Extra Legroom or Special */}
                    {(seat.extraLegroom || seat.isExitRow) && isAvailable && !isSelected && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white"></div>
                    )}
                </button>
            </HoverCardTrigger>

            {/* Popover Detail */}
            {isAvailable && (
                <HoverCardContent side="right" className="w-72 p-0 overflow-hidden border-none shadow-xl">
                    <div className="bg-slate-900 text-white p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-xl font-bold flex items-center gap-2">
                                    Ghế {seat.row}{seat.position}
                                </h4>
                                <Badge variant="secondary" className="mt-1 bg-slate-700 hover:bg-slate-700 text-slate-100 border-none">
                                    {seat.cabinClass === 'ECONOMY' ? 'Phổ thông' : seat.cabinClass === 'BUSINESS' ? 'Thương gia' : 'Hạng nhất'}
                                </Badge>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-emerald-400">
                                    {seat.price ? `+${(seat.price / 1000).toFixed(0)}K` : 'Free'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-2 rounded-lg">
                                <p className="text-xs text-slate-500">Khoảng để chân</p>
                                <p className="font-semibold text-slate-800">{amenities.legroom}</p>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg">
                                <p className="text-xs text-slate-500">Độ ngả lưng</p>
                                <p className="font-semibold text-slate-800">{amenities.recline}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-400 uppercase">Tiện nghi</p>
                            <div className="flex gap-4">
                                {amenities.power && (
                                    <div className="flex flex-col items-center gap-1 text-slate-600" title="Ổ cắm điện">
                                        <Power className="w-5 h-5" />
                                        <span className="text-[10px]">Power</span>
                                    </div>
                                )}
                                {amenities.usb && (
                                    <div className="flex flex-col items-center gap-1 text-slate-600" title="Cổng USB">
                                        <Usb className="w-5 h-5" />
                                        <span className="text-[10px]">USB</span>
                                    </div>
                                )}
                                {amenities.wifi && (
                                    <div className="flex flex-col items-center gap-1 text-slate-600" title="Wi-Fi">
                                        <Wifi className="w-5 h-5" />
                                        <span className="text-[10px]">Wi-Fi</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </HoverCardContent>
            )}
        </HoverCard>
    )
}
