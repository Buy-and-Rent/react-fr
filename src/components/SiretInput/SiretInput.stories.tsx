import type { Meta, StoryObj } from "@storybook/react-vite";
import { SiretInput } from "./SiretInput";

const meta: Meta<typeof SiretInput> = {
  title: "Components/SiretInput",
  component: SiretInput,
  args: {
    placeholder: "Numero SIRET",
  },
};
export default meta;

type Story = StoryObj<typeof SiretInput>;

export const Default: Story = {};
