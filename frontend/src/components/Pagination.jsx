function Pagination({
  page,
  totalPages,
  totalCount,
  onPageChange,
  hasPrevious,
  hasNext,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrapper">
      <span className="pagination-info">
        Trang <strong>{page}</strong> / {totalPages} (Tổng số {totalCount} sách)
      </span>
      <div className="pagination-buttons">
        <button
          disabled={!hasPrevious}
          onClick={() => onPageChange(page - 1)}
          className="btn btn-secondary btn-sm"
        >
          &larr; Trang trước
        </button>
        <button
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          className="btn btn-secondary btn-sm"
        >
          Trang sau &rarr;
        </button>
      </div>
    </div>
  );
}

export default Pagination;
