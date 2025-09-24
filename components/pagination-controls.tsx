"use client";

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination, PaginationState } from '@/hooks/use-pagination';

interface PaginationControlsProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  className?: string;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange,
  className,
}) => {
  const { pageNumbers } = usePagination({
    initialPage: pagination.currentPage,
    itemsPerPage: pagination.itemsPerPage,
    totalItems: pagination.totalItems,
    onPageChange,
  });

  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-700">
        Showing {pagination.startIndex + 1} to {Math.min(pagination.endIndex + 1, pagination.totalItems)} of {pagination.totalItems} results
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.hasPrevPage) {
                  onPageChange(pagination.currentPage - 1);
                }
              }}
              className={!pagination.hasPrevPage ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {pageNumbers.map((pageNumber, index) => {
            const isFirstPage = index === 0 && pageNumbers[0] > 1;
            const isLastPage = index === pageNumbers.length - 1 && pageNumbers[pageNumbers.length - 1] < pagination.totalPages;
            
            return (
              <React.Fragment key={pageNumber}>
                {isFirstPage && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(1);
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {pageNumbers[0] > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}
                
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(pageNumber);
                    }}
                    isActive={pageNumber === pagination.currentPage}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
                
                {isLastPage && (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < pagination.totalPages - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(pagination.totalPages);
                        }}
                      >
                        {pagination.totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </React.Fragment>
            );
          })}
          
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.hasNextPage) {
                  onPageChange(pagination.currentPage + 1);
                }
              }}
              className={!pagination.hasNextPage ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControls;
