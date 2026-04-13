import type { Meta, StoryObj } from "@storybook/react-vite";
import { PostalCodeInput } from "./PostalCodeInput";

const meta: Meta<typeof PostalCodeInput> = {
  title: "Components/PostalCodeInput",
  component: PostalCodeInput,
  args: {
    placeholder: "Code postal",
  },
};
export default meta;

type Story = StoryObj<typeof PostalCodeInput>;

export const Default: Story = {};
