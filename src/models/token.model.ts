export class Token {
  id: number = 0;
  reference_id: string | number = "";
  network_id: number = 0;
  name: string = "";
  symbol: string = "";
  decimals: number = 0;
  type: string = "native";
  image: string = "";
  target_networks: number[] = [];
}
