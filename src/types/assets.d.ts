declare module "*.svg" {
  import type { ComponentProps, FunctionComponent } from "react";

  const content: FunctionComponent<ComponentProps<"svg">>;
  export default content;
}
