import { shallowMount } from "@vue/test-utils";
import DashboardHeader from "@/components/DashboardHeader.vue";

describe("DashboardHeader.vue", () => {
  it("renders dashboard title in h1", () => {
    const wrapper = shallowMount(DashboardHeader);

    const title = wrapper.find("h1");
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe("TV Shows");
  });
});
