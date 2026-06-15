import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

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

  const resetForm = () => {
    setForm({
      title: "",
      author: "",
      price: "",
      quantity: "",
    });
    setEditingId(null);
  };

  const loadBooks = async () => {
    try {
      const response = await api.get("api/books/", {
        params: {
          page,
          page_size: pageSize,
          title: titleFilter,
          author: authorFilter,
        },
      });

      setBooks(response.data.results);
      setNext(response.data.next);
      setPrevious(response.data.previous);
    } catch (error) {
      console.log(error);
      alert("Không tải được danh sách sách");
    }
  };

  useEffect(() => {
    loadBooks();
  }, [page, pageSize]);

  const handleFilter = () => {
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

  const addBook = async () => {
    try {
      await api.post("api/books/", form);
      resetForm();
      loadBooks();
      alert("Thêm sách thành công");
    } catch (error) {
      console.log(error);
      alert("Thêm sách thất bại");
    }
  };

  const getDetail = async (id) => {
    try {
      const response = await api.get(`api/books/${id}/`);
      setDetailBook(response.data);
    } catch (error) {
      console.log(error);
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
  };

  const saveEdit = async () => {
    try {
      await api.put(`api/books/${editingId}/`, form);
      resetForm();
      loadBooks();
      alert("Cập nhật sách thành công");
    } catch (error) {
      console.log(error);
      alert("Cập nhật thất bại");
    }
  };

  const deleteBook = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa sách này không?");
    if (!confirmDelete) return;

    try {
      await api.delete(`api/books/${id}/`);
      loadBooks();
      alert("Xóa sách thành công");
    } catch (error) {
      console.log(error);
      alert("Xóa thất bại");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <h1>Book Management</h1>

      <section style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px" }}>
        <h2>Filter Books</h2>

        <input
          placeholder="Filter by title"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
        />

        <input
          placeholder="Filter by author"
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
        />

        <button onClick={handleFilter}>Search</button>
        <button onClick={clearFilter}>Clear</button>
      </section>

      <section style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px" }}>
        <h2>{editingId ? "Edit Book" : "Add Book"}</h2>

        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} />

        {editingId ? (
          <>
            <button onClick={saveEdit}>Save</button>
            <button onClick={resetForm}>Cancel</button>
          </>
        ) : (
          <button onClick={addBook}>Add Book</button>
        )}
      </section>

      <section style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px" }}>
        <h2>Book List</h2>

        <label>Page size: </label>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={20}>20 records</option>
          <option value={100}>100 records</option>
        </select>

        <p>Current page: {page}</p>

        <button disabled={!previous} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <button disabled={!next} onClick={() => setPage(page + 1)}>
          Next
        </button>

        <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.price}</td>
                <td>{book.quantity}</td>
                <td>
                  <button onClick={() => getDetail(book.id)}>Detail</button>
                  <button onClick={() => startEdit(book)}>Edit</button>
                  <button onClick={() => deleteBook(book.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {detailBook && (
        <section style={{ border: "1px solid #ddd", padding: "15px" }}>
          <h2>Book Detail</h2>
          <p>ID: {detailBook.id}</p>
          <p>Title: {detailBook.title}</p>
          <p>Author: {detailBook.author}</p>
          <p>Price: {detailBook.price}</p>
          <p>Quantity: {detailBook.quantity}</p>
          <button onClick={() => setDetailBook(null)}>Close Detail</button>
        </section>
      )}
    </div>
  );
}

export default Home;