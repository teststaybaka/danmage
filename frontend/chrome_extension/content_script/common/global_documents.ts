export class GlobalDocuments {
  public constructor(private documents: Document[]) {}

  public static create(documents: Document[]): GlobalDocuments {
    return new GlobalDocuments(documents);
  }

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
}
