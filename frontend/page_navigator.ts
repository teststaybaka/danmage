export class PageNavigator<Page> {
  public goTo: (page: Page) => void;
  private currentPage: Page;

  public constructor(
    private addPage: (page: Page) => void,
    private removePage: (page: Page) => void,
    private updatePage: (page: Page) => void = () => {}
  ) {
    this.goTo = this.goToInternal;
  }

  private goToInternal = (page: Page): void => {
    if (this.currentPage !== page) {
      this.removePage(this.currentPage);
      this.currentPage = page;
      this.addPage(this.currentPage);
    } else {
      this.updatePage(this.currentPage);
    }
  };

  // Once removed, all future navigations are stopped.
  public remove(): void {
    this.removePage(this.currentPage);
    this.goTo = () => {};
  }
}
