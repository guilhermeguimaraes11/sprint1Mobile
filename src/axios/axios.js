import axios from 'axios';

const api = axios.create({
  baseURL: "http://10.89.240.78:5000/reservas/v1/",
  headers: {
    accept: "application/json",
  },
});

const sheets = {
  postLogin: (usuario) => api.post("login/", usuario),
  postCadastro: (usuario) => api.post("user/", usuario),
  getSalas: () => api.get("salas/"),
  getReservas: () => api.get("reservaschedule/"),
  postReserva: (reserva) => api.post("reservaschedule/", reserva),

  updateReserva: (idReserva, dadosAtualizados) =>
    api.put(`reservaschedule/${idReserva}`, dadosAtualizados),

  deleteReserva: (idReserva) =>
    api.delete(`reservaschedule/${idReserva}`),
};

export default sheets;
