import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <>
      <Navbar />
 <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/product/:id" element={<ProductDetail />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
    <Route path="/cart" element={<Cart />} />

    <Route path="/orders" element={<Orders />} />


</Routes>

    </>
  );
}
