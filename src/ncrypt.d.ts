
export interface INcrypt {
  convertTextToDecimal(text: string): number[];
  applySaltToCharacters(charCodes: number[] | number): number;
  convertByteToHexadecimal(number: number): string;
  encodeData(): string;
  decodeData(data: string): string;
}
