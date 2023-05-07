import { Text } from "troika-three-text";
import { gsap } from "gsap";

interface Prop {
  text: string | number;

  fontSize?: number;
  color?: string;
  anchorX?: string | number;
  anchorY?: string | number;
  textAlign?: string;
  visible?: boolean;
}

export default class Text2D {
  instance: Text;

  // Props
  text: string;
  fontSize: number;
  color: string;
  anchorX: string | number;
  anchorY: string | number;
  textAlign: string;
  visible: boolean;

  constructor(props?: Prop) {
    Object.assign(this, props);
    this.createText();
  }

  createText() {
    this.instance = new Text();

    this.instance.text = this.text;
    this.instance.fontSize = this.fontSize ? this.fontSize : 2;
    this.instance.color = this.color ? this.color : "white";
    this.instance.anchorX = this.anchorX ? this.anchorX : "center";

    this.instance.sync();
  }

  updateText(text: string | number) {
    this.instance.text = text;
    this.instance.sync();
  }
  updatePositionY(positionY: any) {
    gsap.to(this.instance, {
      anchorY: positionY,
    });

    this.instance.sync();
  }
}
