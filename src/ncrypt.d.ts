
export interface INcrypt {
  convertTextToDecimal(text: string): number[];
  applySecretToCharacters(charCodes: number[] | number): number;
  convertByteToHexadecimal(number: number): string;
  encrypt(text: object | string | number | boolean): string;
  decrypt(data: string): string;
}
