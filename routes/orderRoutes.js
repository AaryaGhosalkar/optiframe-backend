import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [view, setView] = useState("menu");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [model3d, setModel3d] = useState("");
  const [stock, setStock] = useState("");

  const API = "https://optiframe-backend.onrender.com/api";

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    const res = await fetch(`${API}/products`);
    const data = await res.json();
    setProducts(data);
  };

  // FETCH ORDERS
  const fetchOrders = async () => {
    const res = await fetch(`${API}/orders`);
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // ADD PRODUCT
  const addProduct = async () => {
    await fetch(`${API}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, image, model3d, stock }),
    });

    setName("");
    setPrice("");
    setImage("");
    setModel3d("");
    setStock("");

    fetchProducts();
    alert("Product Added");
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    await fetch(`${API}/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  // UPDATE ORDER STATUS
  const updateStatus = async (id, status) => {
    await fetch(`${API}/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchOrders();
  };

  // ================= VIEWS =================

  if (view === "menu") {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Admin Dashboard</h1>
        <button onClick={() => setView("add")}>Add Product</button>
        <button onClick={() => setView("inventory")}>Inventory</button>
        <button onClick={() => setView("orders")}>Orders</button>
      </div>
    );
  }

  if (view === "add") {
    return (
      <div style={{ padding: "40px" }}>
        <button onClick={() => setView("menu")}>Back</button>
        <h2>Add Product</h2>

        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
        <input placeholder="Frame Path" value={model3d} onChange={(e) => setModel3d(e.target.value)} />
        <input placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />

        <button onClick={addProduct}>Add</button>
      </div>
    );
  }

  if (view === "inventory") {
    return (
      <div style={{ padding: "40px" }}>
        <button onClick={() => setView("menu")}>Back</button>
        <h2>Inventory</h2>

        {products.map((p) => (
          <div key={p._id}>
            {p.name} - Stock: {p.stock}
            <button onClick={() => deleteProduct(p._id)}>Delete</button>
          </div>
        ))}
      </div>
    );
  }

  if (view === "orders") {
    return (
      <div style={{ padding: "40px" }}>
        <button onClick={() => setView("menu")}>Back</button>
        <h2>Orders</h2>

        {orders.map((o) => (
          <div key={o._id}>
            <p>{o.customerEmail}</p>
            <p>Total: ₹{o.totalAmount}</p>
            <p>Status: {o.status}</p>

            <button onClick={() => updateStatus(o._id, "Shipped")}>Shipped</button>
            <button onClick={() => updateStatus(o._id, "Delivered")}>Delivered</button>
          </div>
        ))}
      </div>
    );
  }

  return null;
}