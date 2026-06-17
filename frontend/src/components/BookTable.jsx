function BookTable({ books, onDetail, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Giá bán</th>
            <th>Số lượng</th>
            <th className="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td className="text-mono">#{book.id}</td>
                <td className="text-bold">{book.title}</td>
                <td>{book.author}</td>
                <td className="text-accent">${Number(book.price).toFixed(2)}</td>
                <td>
                  <span className={`badge ${book.quantity > 0 ? "badge-success" : "badge-danger"}`}>
                    {book.quantity}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => onDetail(book.id)} className="btn btn-xs btn-info" title="Xem chi tiết">
                      Chi tiết
                    </button>
                    <button onClick={() => onEdit(book)} className="btn btn-xs btn-warning" title="Chỉnh sửa">
                      Sửa
                    </button>
                    <button onClick={() => onDelete(book.id)} className="btn btn-xs btn-danger" title="Xóa">
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted py-4">
                Không tìm thấy cuốn sách nào khớp với điều kiện lọc.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BookTable;
