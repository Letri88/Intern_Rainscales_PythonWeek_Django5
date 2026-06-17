import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Header from "../components/Header";
import BookFilter from "../components/BookFilter";
import BookForm from "../components/BookForm";
import BookDetail from "../components/BookDetail";
import BookTable from "../components/BookTable";
import Pagination from "../components/Pagination";

function Home() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [titleFilter, setTitleFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    quantity: "",
  });
  
  const [editingId, setEditingId] = useState(null);
  const [detailBook, setDetailBook] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        await api.post("api/logout/", { refresh: refreshToken });
      }
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.reload();
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      author: "",
      price: "",
      quantity: "",
    });
    setEditingId(null);
  };

  const loadBooks = useCallback(async () => {
    try {
      const response = await api.get("api/books/", {
        params: {
          page,
          page_size: pageSize,
          title: titleFilter || undefined,
          author: authorFilter || undefined,
        },
      });

      // Map from CustomPagination structure
      if (response.data) {
        setBooks(response.data.results || []);
        setNext(response.data.links?.next || null);
        setPrevious(response.data.links?.previous || null);
        setTotalPages(response.data.total_pages || 1);
        setTotalCount(response.data.count || 0);
      }
    } catch (error) {
      console.error(error);
      alert("Không tải được danh sách sách");
    }
  }, [page, pageSize, titleFilter, authorFilter]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
    loadBooks();
  };

  const clearFilter = () => {
    setTitleFilter("");
    setAuthorFilter("");
    setPage(1);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.price || !form.quantity) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.put(`api/books/${editingId}/`, form);
        alert("Cập nhật sách thành công");
      } else {
        await api.post("api/books/", form);
        alert("Thêm sách thành công");
      }
      resetForm();
      loadBooks();
    } catch (error) {
      console.error(error);
      alert(editingId ? "Cập nhật thất bại" : "Thêm sách thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDetail = async (id) => {
    try {
      const response = await api.get(`api/books/${id}/`);
      setDetailBook(response.data);
    } catch (error) {
      console.error(error);
      alert("Không lấy được chi tiết sách");
    }
  };

  const startEdit = (book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      price: book.price,
      quantity: book.quantity,
    });
    // Scroll to form smoothly
    const formElement = document.getElementById("book-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const deleteBook = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa sách này không?");
    if (!confirmDelete) return;

    try {
      await api.delete(`api/books/${id}/`);
      alert("Xóa sách thành công");
      // Adjust page index if the last item on the page was deleted
      if (books.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        loadBooks();
      }
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header Bar */}
      <Header onLogout={logout} />

      {/* Main Grid Layout */}
      <div className="dashboard-grid">
        
        {/* Left Side: Filter and Add/Edit Forms */}
        <aside className="dashboard-sidebar">
          
          {/* Filter Card */}
          <BookFilter
            titleFilter={titleFilter}
            setTitleFilter={setTitleFilter}
            authorFilter={authorFilter}
            setAuthorFilter={setAuthorFilter}
            onFilter={handleFilter}
          />

          {/* Form Card (Add/Edit) */}
          <BookForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            editingId={editingId}
            onCancel={resetForm}
            isSubmitting={isSubmitting}
          />
        </aside>

        {/* Right Side: List and Details */}
        <main className="dashboard-main">
          
          {/* Detail View Card */}
          <BookDetail book={detailBook} onClose={() => setDetailBook(null)} />

          {/* Book List Card */}
          <div className="dashboard-card">
            <div className="list-card-header">
              <h2 className="card-title">Danh Sách Sách ({totalCount} kết quả)</h2>
              
              <div className="list-controls">
                <label className="select-label">Hiển thị:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="form-select"
                >
                  <option value={10}>10 dòng</option>
                  <option value={20}>20 dòng</option>
                  <option value={50}>50 dòng</option>
                  <option value={100}>100 dòng</option>
                </select>
              </div>
            </div>

            {/* Book Table List */}
            <BookTable
              books={books}
              onDetail={getDetail}
              onEdit={startEdit}
              onDelete={deleteBook}
            />

            {/* Pagination Controls */}
            <Pagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={setPage}
              hasPrevious={!!previous}
              hasNext={!!next}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;