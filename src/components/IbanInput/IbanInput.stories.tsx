import type { Meta, StoryObj } from "@storybook/react-vite";
import { IbanInput } from "./IbanInput";

const meta: Meta<typeof IbanInput> = {
  title: "Components/IbanInput",
  component: IbanInput,
  args: {
    placeholder: "FR76 XXXX XXXX ...",
  },
};
export default meta;

type Story = StoryObj<typeof IbanInput>;

export const Default: Story = {};
