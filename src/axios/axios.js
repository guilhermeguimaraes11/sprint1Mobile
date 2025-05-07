import axios from "axios";


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
  postReserva: (reserva) => api.post("reservaschedule/", reserva),
    getDisponibilidadeSala: (idSala, data) =>
    api.get(`salas/${idSala}/disponibilidade`, {
      params: { data },
    }),
};

export default sheets;