const cartController = () => {
  return {
    index(req, res) {
      res.render("customers/cart", { cart: req.session.cart || null });
    },

    update(req, res) {
      // Khởi tạo giỏ hàng nếu chưa có
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
        };
      }
      const cart = req.session.cart;

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const productId = req.body._id;
      const productPrice = parseFloat(req.body.price) || 0;

      // Cập nhật giỏ hàng
      if (!cart.items[productId]) {
        cart.items[productId] = {
          item: req.body,
          qty: 1,
        };
        cart.totalQty += 1;
        cart.totalPrice += productPrice;
      } else {
        cart.items[productId].qty += 1;
        cart.totalQty += 1;
        cart.totalPrice += productPrice;
      }

      // Trả về thông tin giỏ hàng
      return res.json({ totalQty: cart.totalQty, totalPrice: cart.totalPrice });
    },
  };
};

export default cartController;
