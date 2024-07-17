export default interface USER_TYPE {
  name: string;
  phone: number;
  password?: string;
  role: "ADMIN" | "USER";
  gender: "MALE" | "FEMALE";
  village: string;
  email?: string;
}

export default interface PADDY_TYPES {
  userId: object;
  paddyType: "1001" | "1009" | "DERADUN" | "BHULAXMI";
  packet: number[];
  nonPlastic: number;
  date: Date;
  rate: number;
  nonPlasticRate: number;
}
