export class Task {
  id: number;
  text: string;
  checked: boolean;

  public constructor(id: number, text: string, checked: boolean) {
    this.id = id;
    this.text = text;
    this.checked = checked;
  }
}
