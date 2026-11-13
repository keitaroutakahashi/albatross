// @types/jsdom を入れずに済むよう、parse-ts-league.ts が使う範囲だけ宣言する
declare module "jsdom" {
  export class JSDOM {
    constructor(html: string);
    window: Window & typeof globalThis;
  }
}
