import { shallowMount, mount, flushPromises } from "@vue/test-utils";
import DashboardHeader from "@/components/DashboardHeader.vue";
import ShowCard from "@/components/ShowCard.vue";
import ShowDetails from "@/views/ShowDetails.vue";
describe("DashboardHeader.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(DashboardHeader, {
      global: {
        mocks: {
          $route: { name: "home" },
          $router: { push: jest.fn(), back: jest.fn() },
          $store: {
            state: { selectedGenre: null },
            commit: jest.fn()
          }
        }
      }
    });
  });

  it("renders dashboard title in h1", () => {
    const title = wrapper.find("h1");
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe("Show Glance");
  });

  it("shows the search button when on the home page", () => {
    const searchBtn = wrapper.find(".next-button");
    expect(searchBtn.exists()).toBe(true);
  });
});

describe("ShowCard.vue", () => {
  it("displays the show title correctly", () => {
    const mockShow = {
      id: 1,
      name: "Show 1",
      rating: { average: 9.0 },
      image: { medium: "path/to/img.jpg" }
    };

    const wrapper = mount(ShowCard, {
      props: { show: mockShow, genre: "Drama" },
      global: {
        mocks: {
          $store: { state: { scrollPosition: 0, screenHeight: 800 } },
          $router: { push: jest.fn() }
        }
      }
    });

    expect(wrapper.find("p").text()).toBe("Show 1");
  });
});

describe("ShowDetails.vue", () => {
  it("renders ShowDetails correctly after loading", async () => {
    const mockShow = {
      id: 169,
      name: "Breaking Bad",
      rating: { average: 9.2 },
      genres: ["Drama", "Crime"],
      summary: "<p>Breaking Bad follows...</p>",
      premiered: "2008-01-20",
      ended: "2013-09-29",
      language: "English"
    };

    const wrapper = mount(ShowDetails, {
      props: { id: "169" },
      global: {
        mocks: {
          $store: {
            dispatch: jest.fn((action) => {
              if (action === "getShow") return Promise.resolve(mockShow);
              if (action === "getShowImages") return Promise.resolve([]);
              if (action === "showAkas") return Promise.resolve([]);
            }),
            commit: jest.fn(),
            state: { loaded: true },
            getters: { getShowById: () => mockShow }
          },
          $router: { push: jest.fn() }
        },
        stubs: ["ShowCast", "ShowSeasons", "PageLoader", "Transition"]
      }
    });

    await flushPromises();
    const title = wrapper.find("h1");

    expect(title.exists()).toBe(true);
    expect(title.text()).toBe("Breaking Bad");
  });
});
