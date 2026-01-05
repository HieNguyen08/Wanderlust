import { adminFlightSeatApi, BulkFlightSeatRequest, SeatConfiguration } from '@/api/adminFlightSeatApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface SeatConfigurationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    flightId: string;
    onSuccess?: () => void;
}

export default function SeatConfigurationDialog({
    open,
    onOpenChange,
    flightId,
    onSuccess,
}: SeatConfigurationDialogProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    // Form state
    const [rows, setRows] = useState<number>(18);
    const [allColumns, setAllColumns] = useState<string[]>(['A', 'B', 'C', 'D', 'E', 'F']);
    const [seatConfigurations, setSeatConfigurations] = useState<SeatConfiguration[]>([
        {
            columns: ['A', 'B'],
            cabinClass: 'ECONOMY',
            seatType: 'WINDOW',
            price: 0,
            isExitRow: false,
            extraLegroom: false,
        },
        {
            columns: ['C', 'D'],
            cabinClass: 'ECONOMY',
            seatType: 'MIDDLE',
            price: 0,
            isExitRow: false,
            extraLegroom: false,
        },
        {
            columns: ['E', 'F'],
            cabinClass: 'ECONOMY',
            seatType: 'AISLE',
            price: 0,
            isExitRow: false,
            extraLegroom: false,
        },
    ]);

    const cabinClassOptions = ['ECONOMY', 'BUSINESS', 'FIRST'];
    const seatTypeOptions = ['WINDOW', 'MIDDLE', 'AISLE'];

    const handleAddConfiguration = () => {
        const newConfig: SeatConfiguration = {
            columns: [],
            cabinClass: 'ECONOMY',
            seatType: 'WINDOW',
            price: 0,
            isExitRow: false,
            extraLegroom: false,
        };
        setSeatConfigurations([...seatConfigurations, newConfig]);
    };

    const handleRemoveConfiguration = (index: number) => {
        setSeatConfigurations(seatConfigurations.filter((_, i) => i !== index));
    };

    const handleConfigurationChange = (
        index: number,
        field: keyof SeatConfiguration,
        value: any
    ) => {
        const updated = [...seatConfigurations];
        (updated[index] as any)[field] = value;
        setSeatConfigurations(updated);
    };

    const handleToggleColumn = (configIndex: number, column: string) => {
        const updated = [...seatConfigurations];
        const columns = updated[configIndex].columns || [];
        if (columns.includes(column)) {
            updated[configIndex].columns = columns.filter(c => c !== column);
        } else {
            updated[configIndex].columns = [...columns, column];
        }
        setSeatConfigurations(updated);
    };

    const validateForm = (): boolean => {
        if (!rows || rows <= 0) {
            toast.error('Số hàng phải lớn hơn 0');
            return false;
        }

        if (!allColumns || allColumns.length === 0) {
            toast.error('Phải có ít nhất một cột');
            return false;
        }

        for (let i = 0; i < seatConfigurations.length; i++) {
            const config = seatConfigurations[i];
            if (!config.columns || config.columns.length === 0) {
                toast.error(`Cấu hình hàng ${i + 1} phải có ít nhất một cột`);
                return false;
            }
            if (!config.cabinClass || !config.seatType) {
                toast.error(`Cấu hình hàng ${i + 1} phải đầy đủ`);
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const request: BulkFlightSeatRequest = {
                flightId,
                rows,
                columns: allColumns,
                seatConfigurations,
            };

            await adminFlightSeatApi.bulkCreateFlightSeats(request);
            toast.success('Ghế đã được tạo thành công!');
            onOpenChange(false);
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error creating seats:', error);
            toast.error('Lỗi khi tạo ghế');
        } finally {
            setLoading(false);
        }
    };

    const handleAddColumn = (newColumn: string) => {
        if (newColumn && !allColumns.includes(newColumn)) {
            setAllColumns([...allColumns, newColumn]);
        }
    };

    const handleRemoveColumn = (column: string) => {
        setAllColumns(allColumns.filter(c => c !== column));
        // Also remove from all configurations
        setSeatConfigurations(
            seatConfigurations.map(config => ({
                ...config,
                columns: config.columns.filter(c => c !== column),
            }))
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Cấu hình ghế chuyến bay</DialogTitle>
                    <DialogDescription>
                        Thiết lập bố cục ghế cho chuyến bay
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Rows */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Số hàng ghế</label>
                        <Input
                            type="number"
                            min="1"
                            max="50"
                            value={rows}
                            onChange={(e) => setRows(parseInt(e.target.value) || 0)}
                            placeholder="18"
                        />
                    </div>

                    {/* Columns */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Các cột (A, B, C, ...)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {allColumns.map((col) => (
                                <div
                                    key={col}
                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
                                >
                                    {col}
                                    <button
                                        onClick={() => handleRemoveColumn(col)}
                                        className="hover:text-blue-900 cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                id="newColumn"
                                placeholder="Nhập cột mới (A, B, C, ...)"
                                maxLength={1}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const input = e.currentTarget;
                                        handleAddColumn(input.value.toUpperCase());
                                        input.value = '';
                                    }
                                }}
                            />
                            <Button
                                onClick={() => {
                                    const input = document.getElementById('newColumn') as HTMLInputElement;
                                    handleAddColumn(input?.value.toUpperCase() || '');
                                    if (input) input.value = '';
                                }}
                                variant="outline"
                            >
                                <Plus size={16} />
                            </Button>
                        </div>
                    </div>

                    {/* Seat Configurations */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Cấu hình ghế</label>
                            <Button
                                onClick={handleAddConfiguration}
                                variant="outline"
                                size="sm"
                            >
                                <Plus size={16} className="mr-1" />
                                Thêm cấu hình
                            </Button>
                        </div>

                        {seatConfigurations.map((config, idx) => (
                            <Card key={idx}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-sm">Cấu hình {idx + 1}</CardTitle>
                                        <button
                                            onClick={() => handleRemoveConfiguration(idx)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {/* Cabin Class */}
                                    <div>
                                        <label className="text-xs font-medium mb-1 block">Hạng vé</label>
                                        <Select
                                            value={config.cabinClass}
                                            onValueChange={(value) =>
                                                handleConfigurationChange(idx, 'cabinClass', value as any)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cabinClassOptions.map((option) => (
                                                    <SelectItem key={option} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Seat Type */}
                                    <div>
                                        <label className="text-xs font-medium mb-1 block">Loại ghế</label>
                                        <Select
                                            value={config.seatType}
                                            onValueChange={(value) =>
                                                handleConfigurationChange(idx, 'seatType', value as any)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {seatTypeOptions.map((option) => (
                                                    <SelectItem key={option} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label className="text-xs font-medium mb-1 block">Giá thêm</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={config.price || 0}
                                            onChange={(e) =>
                                                handleConfigurationChange(
                                                    idx,
                                                    'price',
                                                    parseFloat(e.target.value) || 0
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Extra Features */}
                                    <div className="flex gap-2">
                                        <label className="flex items-center gap-2 text-xs">
                                            <input
                                                type="checkbox"
                                                checked={config.isExitRow || false}
                                                onChange={(e) =>
                                                    handleConfigurationChange(idx, 'isExitRow', e.target.checked)
                                                }
                                                className="cursor-pointer"
                                            />
                                            Hàng thoát hiểm
                                        </label>
                                        <label className="flex items-center gap-2 text-xs">
                                            <input
                                                type="checkbox"
                                                checked={config.extraLegroom || false}
                                                onChange={(e) =>
                                                    handleConfigurationChange(idx, 'extraLegroom', e.target.checked)
                                                }
                                                className="cursor-pointer"
                                            />
                                            Chân thêm
                                        </label>
                                    </div>

                                    {/* Column Selection */}
                                    <div>
                                        <label className="text-xs font-medium mb-2 block">Chọn cột</label>
                                        <div className="flex flex-wrap gap-2">
                                            {allColumns.map((col) => (
                                                <label
                                                    key={col}
                                                    className="flex items-center gap-2 px-3 py-2 border rounded cursor-pointer hover:bg-gray-50"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={config.columns.includes(col)}
                                                        onChange={() => handleToggleColumn(idx, col)}
                                                        className="cursor-pointer"
                                                    />
                                                    {col}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? 'Đang tạo...' : 'Tạo ghế'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
