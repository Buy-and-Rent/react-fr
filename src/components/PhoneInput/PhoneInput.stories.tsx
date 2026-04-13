import type { Meta, StoryObj } from "@storybook/react-vite";
import { PhoneInput } from "./PhoneInput";

const meta: Meta<typeof PhoneInput> = {
  title: "Components/PhoneInput",
  component: PhoneInput,
  args: {
    placeholder: "06 12 34 56 78",
  },
};
export default meta;

type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = {};
