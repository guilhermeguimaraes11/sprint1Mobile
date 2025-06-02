import axios from 'axios';

const api = axios.create({
  baseURL: "http://10.89.240.78:5000/reservas/v1/", // A URL base da sua API
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
  updateReserva: (idReserva, dadosAtualizados) => api.put(`reservaschedule/${idReserva}`, dadosAtualizados),
  deleteReserva: (idReserva) => api.delete(`reservaschedule/${idReserva}`),

  // Consultas de Disponibilidade
  getSalasDisponiveisPorData: (id_sala, data_inicio, data_fim) =>
    api.get(`salasdisponiveldata/${id_sala}/${data_inicio}/${data_fim}`),

  // Se for por horário, use a seguinte função:
  getSalasDisponiveisPorHorario: (id_sala, hora_inicio, hora_fim) =>
    api.get("salasdisponivelhorario", { params: { id_sala, hora_inicio, hora_fim } }),
};

export default sheets;
