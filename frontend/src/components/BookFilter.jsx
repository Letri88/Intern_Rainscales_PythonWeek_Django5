function BookFilter({
  titleFilter,
  setTitleFilter,
  authorFilter,
  setAuthorFilter,
  onFilter,
}) {
  return (
    <div className="dashboard-card">
      <h2 className="card-title">Tìm Kiếm Sách</h2>
      <form onSubmit={onFilter} className="vertical-form">
        <div className="form-group">
          <label>Tên sách</label>
          <input
            type="text"
            placeholder="Nhập tiêu đề sách..."
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Tác giả</label>
          <input
            type="text"
            placeholder="Nhập tên tác giả..."
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="btn-group">
          <button type="submit" className="btn btn-primary">Tìm kiếm</button>
        </div>
      </form>
    </div>
  );
}

export default BookFilter;
