function BookDetail({ book, onClose }) {
  if (!book) return null;

  return (
    <div className="dashboard-card detail-card animate-slide-in">
      <div className="detail-header">
        <h2 className="card-title">Chi Tiết Sách</h2>
        <button onClick={onClose} className="btn-close-detail" aria-label="Đóng chi tiết">
          &times;
        </button>
      </div>
      <div className="detail-grid">
        <div className="detail-info-item">
          <span className="info-label">Mã sách (ID):</span>
          <span className="info-value text-mono">#{book.id}</span>
        </div>
        <div className="detail-info-item">
          <span className="info-label">Tiêu đề:</span>
          <span className="info-value text-highlight">{book.title}</span>
        </div>
        <div className="detail-info-item">
          <span className="info-label">Tác giả:</span>
          <span className="info-value">{book.author}</span>
        </div>
        <div className="detail-info-item">
          <span className="info-label">Đơn giá:</span>
          <span className="info-value text-accent">${Number(book.price).toFixed(2)}</span>
        </div>
        <div className="detail-info-item">
          <span className="info-label">Số lượng khả dụng:</span>
          <span className="info-value">
            <span className={`badge ${book.quantity > 0 ? "badge-success" : "badge-danger"}`}>
              {book.quantity} quyển
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
