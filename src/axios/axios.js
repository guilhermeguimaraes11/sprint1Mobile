import axios from "axios";


const api = axios.create({
  baseURL: "http://192.168.100.8:5000/reservas/v1/",
  headers: {
    accept: "application/json",
  },
});

const sheets = {
  postLogin: (usuario) => api.post("login/", usuario),
  postCadastro: (usuario) => api.post("user/", usuario),
  getSalas: () => api.get("salas/"),
  postReserva: (reserva) => api.post("reservaschedule/", reserva),
};

export default sheets;