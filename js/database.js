const DB = {
  getUsers() { return JSON.parse(localStorage.getItem('dyv_users') || '[]'); },
  saveUsers(users) { localStorage.setItem('dyv_users', JSON.stringify(users)); },

  registerUser(nome, email, password) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) return { success: false, error: 'Email já registado.' };
    const newUser = { id: Date.now(), nome, email, password, data_registo: new Date().toLocaleDateString('pt-PT'), encomendas: [] };
    users.push(newUser);
    this.saveUsers(users);
    return { success: true, user: newUser };
  },

  loginUser(email, password) {
    const user = this.getUsers().find(u => u.email === email && u.password === password);
    if (user) { sessionStorage.setItem('dyv_current_user', JSON.stringify(user)); return { success: true, user }; }
    return { success: false, error: 'Email ou password incorretos.' };
  },

  getCurrentUser() { return JSON.parse(sessionStorage.getItem('dyv_current_user') || 'null'); },
  logoutUser() { sessionStorage.removeItem('dyv_current_user'); },

  getOrders() { return JSON.parse(localStorage.getItem('dyv_orders') || '[]'); },

  saveOrder(cartItems) {
    const user = this.getCurrentUser();
    const orders = this.getOrders();
    const total = cartItems.reduce((sum, item) => {
      const p = typeof getProductById === 'function' ? getProductById(item.id) : null;
      return sum + (p ? p.precio * item.qty : 0);
    }, 0);
    const order = {
      id: 'ENC-' + Date.now(),
      user_email: user ? user.email : 'convidado',
      user_nome: user ? user.nome : 'Convidado',
      items: cartItems,
      total: total.toFixed(2),
      data: new Date().toLocaleDateString('pt-PT'),
      hora: new Date().toLocaleTimeString('pt-PT'),
      estado: 'Pendente'
    };
    orders.push(order);
    localStorage.setItem('dyv_orders', JSON.stringify(orders));
    return order;
  },

  getStats() {
    return {
      total_users: this.getUsers().length,
      total_orders: this.getOrders().length,
      total_revenue: this.getOrders().reduce((sum, o) => sum + parseFloat(o.total), 0).toFixed(2),
      users: this.getUsers(),
      orders: this.getOrders()
    };
  }
};

(function initDB() {
  if (DB.getUsers().length === 0) {
    DB.registerUser('Cliente Teste', 'cliente@deliciasyvinos.com', '1234');
    DB.registerUser('Admin', 'admin@deliciasyvinos.com', 'admin123');
  }
})();
