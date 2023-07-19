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
  public instance: Text;

  // Props
  private text: string;
  private fontSize: number;
  private color: string;
  private anchorX: string | number;
  public anchorY: string | number;
  public textAlign: string;
  public visible: boolean = true;

  constructor(props?: Prop) {
    Object.assign(this, props);
    this.createText();
  }

  private createText() {
    this.instance = new Text();

    this.instance.text = this.text;
    this.instance.fontSize = this.fontSize ? this.fontSize : 2;
    this.instance.color = this.color ? this.color : "white";
    this.instance.anchorX = this.anchorX ? this.anchorX : "center";
    this.instance.visible = this.visible;

    this.instance.sync();
  }

  public isVisible(value: boolean) {
    this.visible = value;

    this.instance.visible = this.visible;
    this.instance.sync();
  }

  public updateText(text: string | number) {
    this.instance.text = text;
    this.instance.sync();
  }
  public updatePositionY(positionY: number) {
    gsap.to(this.instance, {
      anchorY: positionY,
    });
    this.instance.sync();
  }
}
