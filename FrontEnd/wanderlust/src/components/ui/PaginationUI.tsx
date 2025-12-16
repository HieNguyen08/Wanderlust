import React from 'react';
import { Button } from './button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationUIProps {
    currentPage: number; // 0-indexed
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export const PaginationUI: React.FC<PaginationUIProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false,
}) => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(0, currentPage - 2);
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }

        // First page
        if (startPage > 0) {
            pages.push(
                <Button
                    key={0}
                    variant="outline"
                    size="icon"
                    className="w-9 h-9"
                    onClick={() => onPageChange(0)}
                    disabled={isLoading}
                >
                    1
                </Button>
            );
            if (startPage > 1) {
                pages.push(<span key="start-ellipsis" className="px-2 py-1">...</span>);
            }
        }

        // Middle pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === currentPage ? "default" : "outline"}
                    size="icon"
                    className="w-9 h-9"
                    onClick={() => onPageChange(i)}
                    disabled={isLoading}
                >
                    {i + 1}
                </Button>
            );
        }

        // Last page
        if (endPage < totalPages - 1) {
            if (endPage < totalPages - 2) {
                pages.push(<span key="end-ellipsis" className="px-2 py-1">...</span>);
            }
            pages.push(
                <Button
                    key={totalPages - 1}
                    variant="outline"
                    size="icon"
                    className="w-9 h-9"
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={isLoading}
                >
                    {totalPages}
                </Button>
            );
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-2 py-4">
            <Button
                variant="outline"
                size="icon"
                className="w-9 h-9"
                onClick={() => onPageChange(0)}
                disabled={currentPage === 0 || isLoading}
            >
                <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="w-9 h-9"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0 || isLoading}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {renderPageNumbers()}

            <Button
                variant="outline"
                size="icon"
                className="w-9 h-9"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1 || isLoading}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="w-9 h-9"
                onClick={() => onPageChange(totalPages - 1)}
                disabled={currentPage === totalPages - 1 || isLoading}
            >
                <ChevronsRight className="h-4 w-4" />
            </Button>
        </div>
    );
};
