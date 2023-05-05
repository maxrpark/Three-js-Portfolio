declare module 'troika-three-text' {
  export class Text {
    text: string | number;
    fontSize: number;
    color: string;
    anchorX?: string | number;
    anchorY?: string | number;
    textAlign: string;
    visible: boolean;

    sync(): void;
    dispose(): void;
  }
}
