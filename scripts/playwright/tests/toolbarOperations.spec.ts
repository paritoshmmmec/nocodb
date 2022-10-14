import { test } from "@playwright/test";
import { DashboardPage } from "../pages/Dashboard";
import setup from "../setup";

test.describe("Toolbar operations (GRID)", () => {
  let dashboard: DashboardPage;
  let context: any;

  async function validateFirstRow(value: string) {
    await dashboard.grid.cell.verify({
      index: 0,
      columnHeader: "Country",
      value: value,
    });
  }

  test.beforeEach(async ({ page }) => {
    context = await setup({ page });
    dashboard = new DashboardPage(page, context.project);
  });

  test("Hide, Sort, Filter", async () => {
    // close 'Team & Auth' tab
    await dashboard.closeTab({ title: "Team & Auth" });

    await dashboard.treeView.openTable({ title: "Country" });
    const toolbar = dashboard.grid.toolbar;

    await dashboard.grid.column.verify({
      title: "LastUpdate",
      isVisible: false,
    });

    // hide column
    await toolbar.fields.toggle({ title: "LastUpdate" });
    await dashboard.grid.column.verify({
      title: "LastUpdate",
      isVisible: true,
    });

    // un-hide column
    await toolbar.fields.toggle({ title: "LastUpdate" });
    await dashboard.grid.column.verify({
      title: "LastUpdate",
      isVisible: false,
    });

    await validateFirstRow("Afghanistan");
    // Sort column
    await toolbar.sort.addSort({ columnTitle: "Country", isAscending: false });
    await validateFirstRow("Zambia");

    // reset sort
    await toolbar.sort.resetSort();
    await validateFirstRow("Afghanistan");

    // Filter column
    await toolbar.filter.addNew({
      columnTitle: "Country",
      value: "India",
      opType: "is equal",
    });
    await validateFirstRow("India");

    // Reset filter
    await toolbar.filter.resetFilter();
    await validateFirstRow("Afghanistan");

    await dashboard.closeTab({ title: "Country" });
  });
});
