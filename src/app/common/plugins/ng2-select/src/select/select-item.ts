
export class SelectItem {
  public value: string;
  public label: string;
  public children: Array<SelectItem>;
  public parent: SelectItem;

  public constructor(source: any) {
    if (typeof source === 'string') {
      this.value = this.label = source;
    }
    if (typeof source === 'object') {
      this.value = source.value || source.label;
      this.label = source.label;
      if (source.children && source.label) {
        this.children = source.children.map((c: any) => {
          const r: SelectItem = new SelectItem(c);
          r.parent = this;
          return r;
        });
        this.label = source.label;
      }
    }
  }

  public fillChildrenHash(optionsMap: Map<string, number>, startIndex: number): number {
    let i = startIndex;
    this.children.map((child: SelectItem) => {
      optionsMap.set(child.value, i++);
    });
    return i;
  }

  public hasChildren(): boolean {
    return this.children && this.children.length > 0;
  }

  public getSimilar(): SelectItem {
    const r: SelectItem = new SelectItem(false);
    r.value = this.value;
    r.label = this.label;
    r.parent = this.parent;
    return r;
  }
}
