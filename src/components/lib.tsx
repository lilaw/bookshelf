import type { HttpError } from "@/types";
export const FullPageSpinner: () => JSX.Element = () => {
  return (
    <div
      class="el-loading-mask is-fullscreen"
      style="z-index: 2001; background-color: rgb(0 0 0);"
    >
      <div class="el-loading-spinner">
        <svg class="circular" viewBox="25 25 50 50" aria-label="loading">
          <circle class="path" cx="50" cy="50" r="20" fill="none"></circle>
        </svg>
      </div>
    </div>
  );
};
export const PageSpinner: () => JSX.Element = () => {
  return (
    <div class="el-loading-mask">
      <div class="el-loading-spinner">
        <svg class="circular" viewBox="25 25 50 50" aria-label="loading">
          <circle class="path" cx="50" cy="50" r="20" fill="none"></circle>
        </svg>
      </div>
    </div>
  );
};

export function ErrorMessage({
  error,
  ...props
}: {
  error: HttpError | string;
}): JSX.Element {
  const message = typeof error === "string" ? error : error.message;
  return (
    <div role="alert" style={[{ color: "ef5350" }]} {...props}>
      <span>There was an error: </span>
      <pre
        style={[{ whiteSpace: "break-spaces", margin: "0", marginBottom: -5 }]}
      >
        {"  "}
        {message}
      </pre>
    </div>
  );
}
