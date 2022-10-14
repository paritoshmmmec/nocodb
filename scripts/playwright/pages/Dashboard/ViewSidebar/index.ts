import { expect, Locator } from "@playwright/test";
import { DashboardPage } from "../";
import BasePage from "../../Base";

export class ViewSidebarPage extends BasePage {
  readonly project: any;
  readonly dashboard: DashboardPage;
  readonly createGalleryButton: Locator;
  readonly createGridButton: Locator;
  readonly createFormButton: Locator;
  readonly createKanbanButton: Locator;

  constructor(dashboard: DashboardPage) {
    super(dashboard.rootPage);
    this.dashboard = dashboard;
    this.createGalleryButton = this.get().locator('.nc-create-gallery-view');
    this.createGridButton = this.get().locator('.nc-create-grid-view');
    this.createFormButton = this.get().locator('.nc-create-form-view');
    this.createKanbanButton = this.get().locator('.nc-create-kanban-view');
  }

  get() {
    return this.dashboard.get().locator('.nc-view-sidebar');
  }

  private async createView({ title, locator }: { title: string, locator: Locator }) {
    await locator.click();
    await this.rootPage.locator('input[id="form_item_title"]').fill(title);
    await this.rootPage.locator('.ant-modal-content').locator('button:has-text("Submit")').click();
    await this.toastWait({ message: 'View created successfully'});
  }

  async createGalleryView({ title }: { title: string }) {
    await this.createView({ title, locator: this.createGalleryButton });
  }

  async createGridView({ title }: { title: string }) {
    await this.createView({ title, locator: this.createGridButton });
  }

  async createFormView({ title }: { title: string }) {
    await this.createView({ title, locator: this.createFormButton });
  }

  async createKanbanView({ title }: { title: string }) {
    await this.createView({ title, locator: this.createKanbanButton });
  }

  async verifyView({ title, index }: { title: string, index: number }) {
    return await expect.poll(async() => {
      await this.get().locator(`.nc-views-menu`).locator('.ant-menu-title-content').nth(index).textContent();
    }).toBe(title);
  }

  async verifyViewNotPresent({ title, index }: { title: string, index: number }) {
    const viewList = this.get().locator(`.nc-views-menu`).locator('.ant-menu-title-content');
    if(await viewList.count() <= index) {
      return true
    }

    return await expect.poll(async() => {
      await this.get().locator(`.nc-views-menu`).locator('.ant-menu-title-content').nth(index).textContent();
    }).not.toBe(title);
  }

  async reorderViews({sourceView, destinationView}: {
    sourceView: string,
    destinationView: string,
  }) {

    await this.dashboard.get().locator(`[pw-data="view-sidebar-drag-handle-${sourceView}"]`).dragTo(
      this.get().locator(`[pw-data="view-sidebar-view-${destinationView}"]`),
    );
  }

  async deleteView({ title }: { title: string }) {
    await this.get().locator(`[pw-data="view-sidebar-view-${title}"]`).hover();
    await this.get()
      .locator(`[pw-data="view-sidebar-view-actions-${title}"]`)
      .locator('.nc-view-delete-icon')
      .click();

    await this.rootPage.locator('.nc-modal-view-delete').locator('button:has-text("Submit")').click();
    await this.rootPage.locator('.nc-modal-view-delete').locator('button:has-text("Submit")').waitFor({ state: 'detached' });
    await this.toastWait({ message: 'View deleted successfully'});
  }
}
