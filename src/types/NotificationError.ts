export interface NotificationError {
  idNotification: number;
  idAgravo: string;
  idadePaciente: number;
  dataNotification: string;
  dataNascimento: string | null;
  classificacao: string;
  sexo: string;
  idBairro: number;
  nomeBairro: string;
  evolucao: string;
  semanaEpidemiologica: number;
  iteration: number;
}