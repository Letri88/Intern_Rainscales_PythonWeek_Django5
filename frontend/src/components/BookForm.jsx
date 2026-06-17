function BookForm({
  form,
  onChange,
  onSubmit,
  editingId,
  onCancel,
  isSubmitting,
}) {
  return (
    <div id="book-form-section" className="dashboard-card">
      <h2 className="card-title">{editingId ? "Cập Nhật Sách" : "Thêm Sách Mới"}</h2>
      <form onSubmit={onSubmit} className="vertical-form">
        <div className="form-group">
          <label>Tiêu đề</label>
          <input
            name="title"
            placeholder="Nhập tiêu đề sách"
            value={form.title}
            onChange={onChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label>Tác giả</label>
          <input
            name="author"
            placeholder="Nhập tên tác giả"
            value={form.author}
            onChange={onChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group col-6">
            <label>Giá sách (USD)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group col-6">
            <label>Số lượng</label>
            <input
              name="quantity"
              type="number"
              placeholder="0"
              value={form.quantity}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>
        </div>
        <div className="btn-group">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : editingId ? "Lưu thay đổi" : "Thêm sách"}
          </button>
          {editingId && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Hủy bỏ
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default BookForm;
