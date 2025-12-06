import { api } from "./index";

export const WorkflowAPI = {
  demo: () => api.post("/workflow/demo"),
};
