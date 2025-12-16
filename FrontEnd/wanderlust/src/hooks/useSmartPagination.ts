import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSmartPaginationProps<T> {
    fetchData: (page: number, size: number) => Promise<{ data: T[]; totalItems: number }>;
    pageSize?: number;
    preloadRange?: number; // Number of pages to preload before and after current
}

interface UseSmartPaginationReturn<T> {
    currentPage: number;
    totalPages: number;
    currentItems: T[];
    isLoading: boolean;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    totalItems: number;
    refresh: () => void;
}

export function useSmartPagination<T>({
    fetchData,
    pageSize = 9,
    preloadRange = 2,
}: UseSmartPaginationProps<T>): UseSmartPaginationReturn<T> {
    const [currentPage, setCurrentPage] = useState(0); // 0-indexed
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Cache stores data for each page: pageIndex -> data[]
    const [cache, setCache] = useState<Map<number, T[]>>(new Map());

    // Track which pages are currently being fetched to prevent duplicate requests
    const loadingPagesRef = useRef<Set<number>>(new Set());

    // To avoid infinite loops or race conditions
    const mountedRef = useRef(true);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const totalPages = Math.ceil(totalItems / pageSize);

    const loadPage = useCallback(async (page: number) => {
        if (page < 0) return;

        // Check if already in cache
        if (cache.has(page)) return;

        // Check if already loading
        if (loadingPagesRef.current.has(page)) return;

        loadingPagesRef.current.add(page);

        // Only set main loading state if it's the current page we are waiting for
        if (page === currentPage) {
            setIsLoading(true);
        }

        try {
            const result = await fetchData(page, pageSize);

            if (mountedRef.current) {
                setCache((prev) => {
                    const newCache = new Map(prev);
                    newCache.set(page, result.data);
                    return newCache;
                });
                setTotalItems(result.totalItems);
            }
        } catch (error) {
            console.error(`Failed to load page ${page}`, error);
        } finally {
            loadingPagesRef.current.delete(page);
            if (mountedRef.current && page === currentPage) {
                setIsLoading(false);
            }
        }
    }, [cache, currentPage, fetchData, pageSize]);

    // Main effect to load current page and preload adjacent pages
    useEffect(() => {
        const pagesToLoad = new Set<number>();

        // Always load current page
        pagesToLoad.add(currentPage);

        // Preload next pages
        for (let i = 1; i <= preloadRange; i++) {
            pagesToLoad.add(currentPage + i);
        }

        // Preload prev pages (if user goes back)
        for (let i = 1; i <= preloadRange; i++) {
            if (currentPage - i >= 0) {
                pagesToLoad.add(currentPage - i);
            }
        }

        // Process all needed pages
        pagesToLoad.forEach(page => {
            // We don't check totalPages here strictly because we might not know it yet for initial load,
            // but generally we should stop at totalPages if known.
            if (totalItems > 0 && page >= Math.ceil(totalItems / pageSize)) return;

            loadPage(page);
        });

    }, [currentPage, loadPage, preloadRange, totalItems, pageSize]);

    const goToPage = (page: number) => {
        if (page >= 0 && (totalItems === 0 || page < Math.ceil(totalItems / pageSize))) {
            setCurrentPage(page);
        }
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    const refresh = () => {
        setCache(new Map());
        loadingPagesRef.current.clear();
        loadPage(currentPage);
    };

    const currentItems = cache.get(currentPage) || [];

    return {
        currentPage,
        totalPages,
        currentItems,
        isLoading: isLoading && !cache.has(currentPage), // Only show loading if we don't have data for current page
        goToPage,
        nextPage,
        prevPage,
        totalItems,
        refresh
    };
}
