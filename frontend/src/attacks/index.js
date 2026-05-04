import { sshBruteForce } from "./sshBruteForce";
import { ddosAttack } from "./DDOS";

export const attackRegistry = {
  1: sshBruteForce,
  2: ddosAttack,
};
