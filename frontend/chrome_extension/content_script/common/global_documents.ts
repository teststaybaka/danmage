export class GlobalDocuments {
  public static create(documents: Document[]): GlobalDocuments {
    return new GlobalDocuments(documents);
  }

  public constructor(private documents: Document[]) {}

  public hideWhenMousedown(carvedElement: HTMLElement, hide: () => void): void {
    for (let document of this.documents) {
      document.addEventListener("mousedown", (event) => {
        if (carvedElement.contains(event.target as HTMLElement)) {
          return;
        }
        hide();
      });
    }
  }

  public onKeydown(callback: (event: KeyboardEvent) => void): void {
    for (let document of this.documents) {
      document.body.addEventListener("keydown", (event) => callback(event));
    }
  }
}
