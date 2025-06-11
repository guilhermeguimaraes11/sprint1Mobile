import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Cria a instância do Axios
const api = axios.create({
  baseURL: "http://10.89.240.72:5000/reservas/v1/",
  headers: {
    Accept: "application/json",
  },
});

// Interceptor para adicionar o token nas requisições
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    console.log("Token no Axios: ", token)
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Endpoints organizados
const sheets = {
  postLogin: (usuario) => api.post("login/", usuario),
  postCadastro: (usuario) => api.post("user/", usuario),
  getSalas: () => api.get("salas/"),
  getReservas: () => api.get("reservaschedule/"),
  postReserva: (reserva) => api.post("reservaschedule/", reserva),
  updateReserva: (idReserva, dadosAtualizados) => api.put(`reservaschedule/${idReserva}`, dadosAtualizados),
  deleteReserva: (idReserva) => api.delete(`reservaschedule/${idReserva}`),
  getDisponibilidade: (data_inicio, data_fim) => api.get(`salasdisponiveldata/${data_inicio}/${data_fim}`),
  updateUsuario: (id_usuario, dados) => api.put(`user/${id_usuario}`, dados),
    

};

export default sheets;
