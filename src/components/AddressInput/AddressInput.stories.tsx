import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddressInput } from "./AddressInput";

const meta: Meta<typeof AddressInput> = {
  title: "Components/AddressInput",
  component: AddressInput,
  args: {
    placeholder: "Saisissez une adresse",
  },
};
export default meta;

type Story = StoryObj<typeof AddressInput>;

export const Default: Story = {};

export const CustomDebounce: Story = {
  args: {
    debounceMs: 500,
    placeholder: "Debounce 500ms",
  },
};
