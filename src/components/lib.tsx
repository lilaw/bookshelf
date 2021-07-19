import type {HttpError} from "@/types"
export const FullPageSpinner = () => {
  return (
    <div class="el-loading-mask is-fullscreen" style="z-index: 2001; background-color: rgb(0 0 0);">
      <div class="el-loading-spinner">
        <svg class="circular" viewBox="25 25 50 50" aria-label="loading">
          <circle class="path" cx="50" cy="50" r="20" fill="none"></circle>
        </svg>
      </div>
    </div>
  );
};

export function ErrorMessage({error, ...props}: {error: HttpError}) {
  return (
    <div
      role="alert"
      style={[{color: 'ef5350'}]}
      {...props}
    >
      <span>There was an error: </span>
      <pre
        style={[
          {whiteSpace: 'break-spaces', margin: '0', marginBottom: -5},
        ]}
      >
        {'  '}{error.message}
      </pre>
    </div>
  )
}

export function test(props: {tt: string}) {
  debugger
  return <p>{props.tt}</p>
}