import { render, screen, within } from "@testing-library/vue";
import AppModal from "../AppModal.vue";
import userEvent from "@testing-library/user-event";
import ElementPlus from "element-plus";

const title = "hello here";
const content = "Lorem ipsum dolor sit amet consectetur, adi";
const foot = "end of file";

const example = {
  template: `
    <app-modal>
      <template #modal-openButton="{ openModal }">
        <button @click="openModal">open</button>
      </template>
      <template v-slot:modal-title> 
        <h1>${title}</h1>
      </template>
      <template v-slot:modal-content>
        <p>${content}</p>
      </template>
      <template v-slot:modal-footer>
        <span>${foot}</span>
      </template>
    </app-modal>
  `,
  components: {
    AppModal,
  },
};

test("modal can be open and close", async () => {
  render(example, {
    global: {
      plugins: [ElementPlus],
    },
    props: {
      modelValue: true,
    },
  });

  await userEvent.click(screen.getByRole("button", { name: /open/i }));
  const modal = screen.getByLabelText("dialog");
  const inModal = within(modal);
  expect(inModal.queryByRole("heading", { name: title })).toBeTruthy();
  expect(inModal.queryByText(content)).not.toBeFalsy();

  await userEvent.click(inModal.getByRole("button", { name: /close/i }));
  expect(screen.queryByRole("dialog")).toBeFalsy();
});
