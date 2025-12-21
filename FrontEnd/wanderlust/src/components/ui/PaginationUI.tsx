import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

interface PaginationUIProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationUI({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationUIProps) {
  const renderPages = () => {
    const items = [];
    
    // Simple logic: if fewer than 7 pages, show all.
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
             items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={i === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(i);
                      }}
                    >
                      {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return items;
    }
    
    // Complex logic with ellipsis
    // Show 1, ellipsis, current-1, current, current+1, ellipsis, total
    
    items.push(
        <PaginationItem key={1}>
            <PaginationLink href="#" isActive={currentPage === 1} onClick={(e) => { e.preventDefault(); onPageChange(1); }}>1</PaginationLink>
        </PaginationItem>
    );
    
    if (currentPage > 4) {
        items.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
    }
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    // Ensure we don't duplicate 1 or totalPages
    // Actually simplicity is key.
    // If we are at 1, start is 2. End is 2 (if total is large)
    
    for (let i = start; i <= end; i++) {
         items.push(
            <PaginationItem key={i}>
                <PaginationLink href="#" isActive={i === currentPage} onClick={(e) => { e.preventDefault(); onPageChange(i); }}>{i}</PaginationLink>
            </PaginationItem>
        );
    }

    if (currentPage < totalPages - 3) {
         items.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
    }
    
    items.push(
        <PaginationItem key={totalPages}>
            <PaginationLink href="#" isActive={currentPage === totalPages} onClick={(e) => { e.preventDefault(); onPageChange(totalPages); }}>{totalPages}</PaginationLink>
        </PaginationItem>
    );
    
    return items;
  };
  

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {renderPages()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
